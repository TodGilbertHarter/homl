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
	/** @private */ view;
	/** @private */ authenticator;
	/** @private */ router;
	/** @private */ gameRepo;
	/** @private */ gamesListener;
		
	constructor(view,authenticator,router,gameRepo) {
		this.view = view;
		view.controller = this;
		this.authenticator = authenticator;
		this.router = router;
		this.gameRepo = gameRepo
		this.router.add(/signup/,() => { this.view.displaySignUpUI(); });
		this.router.add(/signin/,() => { this.view.displaySignInUI(); });
		this.router.add(/signout/,() => { this.view.displaySignOutUI(); });
		this.router.add(/authenticated/,() => { this.view.displayAuthenticatedUI(); });
		this.router.add(/showgame\/(.*)/,(gameid) => {this.view.displayGameInfo(gameid); });
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
	
	doGameSearch(name) {
		this.gameRepo.getGamesByName(name,this.onGamesChanged.bind(this));
//		this.#gameRepo.getGameByName(name,this.onGamesChanged.bind(this));
	}
	
	registerGamesListener(handler) {
		this.gamesListener = handler;
	}
	
	onGamesChanged(games) {
		this.gamesListener(games);
	}
	
	displayGameViewClicked(gameId) {
		window.location.hash = `/showgame/${gameId}`;
	}
	
	doGameInfoDisplay(gameview) {
		this.gameRepo.getGameById(gameview.gameId,gameview.render.bind(gameview));
	}
}
