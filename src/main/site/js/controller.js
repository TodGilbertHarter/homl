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
class Controller {
	#view;
	#authenticator;
	#router;
	
	constructor(view,authenticator,router) {
		this.view = view;
		view.controller = this;
		this.authenticator = authenticator;
		this.router = router;
		this.router.add(/signup/,() => { this.view.displaySignUpUI(); });
		this.router.add(/signin/,() => { this.view.displaySignInUI(); });
		this.router.add(/signout/,() => { this.view.displaySignOutUI(); });
		this.router.add(/authenticated/,() => { this.view.displayAuthenticatedUI(); });
	}
	
	authenticated() {
		window.location.hash = '/authenticated';
	}
	
	signedUp() {
		this.authenticated();
	}
	
	goBack() {
		window.history.back();
	}
	
	signOutClicked() {
		this.authenticator.signOut(() => { window.location.hash = '/signout'; });
	}
	
	signUpClicked() {
		window.location.hash = "/signup";
	}
	
	signInClicked() {
		if(!this.authenticator.getAuthenticated) {
			window.location.hash = "/signin";
		} else {
			window.location.hash = "/signout";
		}
	}

	doSignUp(email, password, onSuccess, onFailure) {
		this.authenticator.createUserWithEmailAndPassword(email,password,onSuccess,onFailure);
	}
	
	doSignIn(email, password, onSuccess, onFailure) {
		this.authenticator.signInWithEmailAndPassword(email,password, onSuccess, onFailure);
	}
	
	doSignOut() {
		this.authenticator.signOut();
	}
}