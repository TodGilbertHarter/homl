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

class Authenticator {
	controller;
	authenticated = false;
	user;
	errorCode;
	player;
	
	constructor(controller) {
		this.controller = controller;
	}
	
	/** @private */ getPlayerFromRepo(onSuccess,onFailure) {
		this.controller.getPlayerByUid(this.user.uid).then((data) => {
			this.player = data;
			onSuccess(this.user,this.player);
		}).catch((message) => onFailure(message));
	}
	
	signOut(onComplete) {
		getAuth().signOut().then(() => {
				onComplete(this.player);
				this.authenticated = false;
				this.user = null;
				this.player = null;
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
				this.controller.updatePlayerLoginTime(player);
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

	createUserWithEmailAndPassword(email, password, handle, onSuccess, onFailure) {
		createUserWithEmailAndPassword(getAuth(), email, password)
		  .then((userCredential) => {
			this.authenticated = true;
		    this.user = userCredential.user;
			this.errorCode = 0;
			this.player = this.controller.createNewPlayer(this.user.uid,(player) => {this.player = player});
		    onSuccess(this.player);
		  })
		  .catch((error) => {
		    this.errorCode = error.code;
		    var errorMessage = error.message;
		    console.info(`User failed to log in with error code: ${this.errorCode}. Message was: ${errorMessage}`)
			onFailure(errorMessage,this.errorCode);
		  });
	}

}

export { Authenticator };
