/**
 * This software is Copyright (C) 2021 Tod G. Harter. All rights reserved.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
class Authenticator {
	#fb;
	#user;
	authenticated = false;
	#errorCode;
	#player;
	
	constructor(firebase) {
		this.fb = firebase;
	}
	
	getPlayer(onSuccess,onFailure) {
		this.player = null; //TODO: implement this
		onSuccess(this.user,this.player);
	}
	
	signOut(onComplete) {
		this.fb.auth().signOut().then(() => {
				this.authenticated = false;
				this.user = null;
				this.player = null;
				onComplete();
			}
		)
		.catch((error) => {
			console.log("Sign Out failed");
		});
	}
	
	signInWithEmailAndPassword(email,password, onSuccess, onFailure) {
		this.fb.auth().signInWithEmailAndPassword(email, password)
		  .then((userCredential) => {
			this.authenticated = true;
		    this.user = userCredential.user;
			this.errorCode = 0;
			this.getPlayer(onSuccess,onFailure);
		  })
		  .catch((error) => {
		    this.errorCode = error.code;
		    var errorMessage = error.message;
			this.authenticated = false;
			this.user = null;
			onFailure(errorMessage);
		  });
	}

	createUserWithEmailAndPassword(email,password, onSuccess, onFailure) {
		this.fb.auth().createUserWithEmailAndPassword(email, password)
		  .then((userCredential) => {
			this.authenticated = true;
		    this.user = userCredential.user;
			this.errorCode = 0;
		    this.player = {
		    	email: email,
		    	loggedin: Timestamp.fromDate(new Date())
		    };
		    var db = this.fb.firestore();
			db.collection('players').add(email);
			onSuccess(this.user,player);
		  })
		  .catch((error) => {
		    var errorCode = error.code;
		    var errorMessage = error.message;
			onFailure(errorMessage);
		  });
	}

	get ErrorCode() {
		return this.errorCode;
	}

	get User() {
		return this.user;
	}
	
	set User(value) {
		this.user = value;
	}
}