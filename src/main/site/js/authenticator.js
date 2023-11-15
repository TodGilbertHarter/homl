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
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase-auth';
import { Timestamp } from 'firebase-firestore';

class Authenticator {
	/** @private */ fb;
	/** @private */ gebApp;
	/** @private */ playerRepo;
	user;
	/** @private */ authenticated = false;
	errorCode;
	player;
	
	constructor(gebApp,firebase,playerRepo) {
		this.gebApp - gebApp;
		this.fb = firebase;
		this.playerRepo = playerRepo;
	}
	
	/** @private */ getPlayerFromRepo(onSuccess,onFailure) {
		this.playerRepo.getPlayerByUid(this.user.uid,(data) => {
			this.player = data;
			onSuccess(this.user,this.player);
		}, (message) => onFailure(message));
	}
	
	signOut(onComplete) {
		getAuth().signOut().then(() => {
				this.authenticated = false;
				this.user = null;
				this.player = null;
				onComplete();
			}
		)
		.catch((e) => {
			console.log("Sign Out failed "+e.message);
		});
	}
	
	signInWithEmailAndPassword(email,password, onSuccess, onFailure) {
		signInWithEmailAndPassword(getAuth(), email, password)
		  .then((userCredential) => {
			this.authenticated = true;
		    this.user = userCredential.user;
			this.errorCode = 0;
			this.getPlayerFromRepo((user,player) => {
				player.loggedIn = Timestamp.fromDate(new Date());
				this.playerRepo.savePlayer(player);
				onSuccess();
				},
			onFailure);
			
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
		createUserWithEmailAndPassword(getAuth(), email, password)
		  .then((userCredential) => {
			this.authenticated = true;
		    this.user = userCredential.user;
			this.errorCode = 0;
		    this.player = new Player(null,this.user.uid,Timestamp.fromDate(new Date()),null);
		    this.playerRepo.savePlayer(this.player);
		    onSuccess(this.player);
		  })
		  .catch((error) => {
		    var errorCode = error.code;
		    var errorMessage = error.message;
			onFailure(errorMessage);
		  });
	}

}

export { Authenticator };
