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
	/** @private */ gebApp;
	/** @private */ view;
	/** @private */ authenticator;
	/** @private */ router;
	/** @private */ gameRepo;
	/** @private */ gamesListeners;
	/** @private */ characterListeners;
	/** @private */ characterRepo;
	/** @private */ characterController;
	/** @private */ callingRepo;
	/** @private */ equipmentRepo;
	/** @private */ boonRepo;
	/** @private */ featRepo;
	/** @private */ playerRepo;
		
	constructor(gebApp,view,authenticator,router,gameRepo,characterRepo,characterController,callingRepo,speciesRepo,
		backgroundRepo,originRepo,equipmentRepo,boonRepo,featRepo,playerRepo) {
		this.gebApp = gebApp;
		this.view = view;
		view.controller = this;
		this.authenticator = authenticator;
		this.router = router;
		this.gameRepo = gameRepo;
		this.characterRepo = characterRepo;
		this.characterController = characterController;
		this.callingRepo = callingRepo;
		this.speciesRepo = speciesRepo;
		this.backgroundRepo = backgroundRepo;
		this.originRepo = originRepo;
		this.equipmentRepo = equipmentRepo;
		this.boonRepo = boonRepo;
		this.featRepo = featRepo;
		this.playerRepo = playerRepo;
		this.router.add(/signup/,() => { this.view.displaySignUpUI(); });
		this.router.add(/signin/,() => { this.view.displaySignInUI(); });
		this.router.add(/signout/,() => { this.view.displaySignOutUI(); });
		this.router.add(/authenticated/,() => { this.view.displayAuthenticatedUI(); });
		this.router.add(/showgame\/(.*)/,(gameid) => { this.view.displayGameInfo(gameid); });
		this.router.add(/showcharacter\/(.*)/,(characterid) => { this.view.displayCharacterInfo(characterid); });
		this.router.add(/creategame/,() => { this.view.displayCreateGameUI(); });
		this.router.add(/equipment/,() => {this.view.displayEquipmentList(); });
		this.router.add(/playersettings/,() => {this.view.displayPlayerSettings(this.getCurrentPlayer().id); });
		this.router.add(/feats/,() => {this.view.displayFeatList(); });
		this.router.add(/boons/,() => {this.view.displayBoonList(); });
		this.actions = {};
	}
	
	registerAction(actionName,extensionPoint) {
		if(!this.actions[actionName]) this.actions[actionName] = [];
		this.actions[actionName].push(extensionPoint);
	}
	
	enableAction(actionName) {
		if(this.actions[actionName])
			this.actions[actionName].forEach((extensionPoint) => extensionPoint());
	}
	
	updatePlayer(player) {
		this.playerRepo.savePlayer(player);
		if(this.getCurrentPlayer().id === player.id) {
			this.authenticator.player = player;
		}
	}
	
	displayEquipmentView() {
		window.location.hash = '/equipment';
	}
	
	displayPlayerSettingsView() {
		window.location.hash = '/playersettings';
	}
	
	displayFeatView() {
		window.location.hash = '/feats';
	}
	
	displayBoonView() {
		window.location.hash = '/boons';
	}
	
	/**
	 * Set up everything which needs to happen after logon, and then head to the route
	 * which displays the logged in UI.
	 */
	authenticated() {
/*		this.callingRepo.addListener(this.onCallingsChanged);
		this.callingRepo.loadAllCallings();
		this.speciesRepo.addListener(this.onSpeciesChanged);
		this.speciesRepo.loadAllSpecies(); */
		window.location.hash = '/authenticated';
	}
	
	getProficienciesByType(type,onAvailable) {
		this.equipmentRepo.getEquipmentByType(type,onAvailable);
	}
	
	getAuthenticatedUser() {
		return this.authenticator.user;
	}
	
	getCurrentPlayer() {
		return this.authenticator.player;
	}
	
	/**
	 * Get a given player and call onDataAvailable when it is returned by
	 * the repo. Also synchronize the current player with the new data if it
	 * has the same id.
	 */
	getPlayerById(playerId,onDataAvailable) {
		this.playerRepo.getPlayerById(playerId, (player) => {
			var cp = this.getCurrentPlayer();
			if(cp.id === player.id) {
				this.authenticator.player = player;
			}
			onDataAvailable(player);
		});
	}
	
	onCallingsChanged(callings) {
		this.characterController.onCallingsChanged(callings);
	}
	
	onSpeciesChanged(species) {
		this.characterController.onSpeciesChanged(species);
	}
	/**
	 * Signed up implies we are authenticated, so just do the same thing.
	 */
	signedUp() {
		this.authenticated();
	}
	
	/**
	 * Invoke the back button functionality.
	 */
	goBack() {
		window.history.back();
	}

	/**
	 * Handle sign out. After the user is actually signed out, the route will update to reflect that.
	 */	
	signOutClicked() {
		this.authenticator.signOut(() => { window.location.hash = '/signout'; });
	}
	
	/**
	 * Display the signup UI.
	 */
	signUpClicked() {
		window.location.hash = "/signup";
	}
	
	/**
	 * Handle the user trying to sign in or out.
	 */
	signInClicked() {
		if(!this.authenticator.getAuthenticated) {
			window.location.hash = "/signin";
		} else {
			window.location.hash = "/signout";
		}
	}
	
	/**
	 * Open a copy of the rules in a separate window/tab.
	 */
	openHoML() {
		window.open("/homl.html");
	}
	
	/**
	 * Open a copy of the setting wiki in a separate window/tab.
	 */
	openErithnoi() {
		window.open("/erithnoi.html");
	}
	
	/**
	 * Handle creating a new game.
	 */
	handleNewGame() {
		window.location.hash = '/creategame';
	}

	handleSaveGame(game) {
		this.gameRepo.saveGame(game);
	}
	/**
	 * Handle the actual signup process via the authenticator.
	 */
	doSignUp(email, password, onSuccess, onFailure) {
		this.authenticator.createUserWithEmailAndPassword(email,password,onSuccess,onFailure);
	}
	
	/**
	 * Handle signin using the authenticator.
	 */
	doSignIn(email, password, onSuccess, onFailure) {
		this.authenticator.signInWithEmailAndPassword(email,password, onSuccess, onFailure);
	}
	
	/**
	 * Command the authenticator to sign the user out.
	 */
	doSignOut() {
		this.authenticator.signOut();
	}
	
	getPlayers(players,onSuccess) {
		this.playerRepo.getReferencedPlayers(players,onSuccess);
	}
	
	/**
	 * Initiate a search for all games owned by a given player.
	 */
	getGamesByOwner(owner) {
		this.gameRepo.getGamesByOwner(owner.id,this.onGamesChanged.bind(this));
	}
	
	/**
	 * Initiate a search for a game by name.
	 */
	doGameSearch(name) {
		this.gameRepo.getGamesByName(name,this.onGamesChanged.bind(this));
	}
	
	/**
	 * Register a handler to handle an update to the list of games.
	 */
	registerGamesListener(handler) {
		this.gamesListener = handler;
	}
	
	registerCharactersListener(handler) {
		this.characterListener = handler;
	}
	
	doCharacterSearch(name) {
		this.characterRepo.getCharactersByName(name,this.onCharactersChanged.bind(this));
	}
	
	onCharactersChanged(characters) {
		this.characterListener(characters);
	}
	
	/**
	 * Call the listener for updates to the list of games.
	 */
	onGamesChanged(games) {
		this.gamesListener(games);
	}
	
	/**
	 * Handle a request to display a specific id of game in the main view.
	 */
	displayGameViewClicked(gameId) {
		window.location.hash = `/showgame/${gameId}`;
	}
	
	doGameInfoDisplay(gameview) {
		this.gameRepo.getGameById(gameview.gameId,gameview.showGame.bind(gameview));
	}
	
	displayCharacterViewClicked(characterId) {
		window.location.hash = `/showcharacter/${characterId}`;
	}
	
}

export { Controller };

