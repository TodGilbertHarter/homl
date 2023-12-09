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
import { schema, getReference, resolveReference } from './schema.js';
import {gameContext} from './context.js';

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
	/** @private */ npcRepo;
	/** @private */ imageRepo;
	/** @private */ originRepo;
	/** @private */ preAuthPath;
	/** @private */ context;
		
	constructor(gebApp,view,authenticator,router,gameRepo,characterRepo,characterController,callingRepo,speciesRepo,
		backgroundRepo,originRepo,equipmentRepo,boonRepo,featRepo,playerRepo,npcRepo,imageRepo) {
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
		this.npcRepo = npcRepo;
		this.imageRepo = imageRepo;
		this.preAuthPath = window.location.hash;
		this.context = gameContext;
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
		this.router.add(/npcs/,() => {this.view.displayNpcList(); });
		this.actions = {};
	}

	/**
	 * Run some hairball using the application context's hairball interpreter.
	 */
	runHairballProgram(program) {
		return this.context.runHairball(program);
	}

	/**
	 * Add an owned record to the current player's list of owned
	 * items. This needs to be done in order to maintain the player's
	 * list of owned items.
	 */
	addOwned(id,schema,name) {
		this.updatePlayerOwns(this.getCurrentPlayer(),id,schema,name);
	}

	/**
	 * Update the ownership for the given player.
	 */	
	updatePlayerOwns(player,id,schema,name) {
		const owned = {id: id, name: name, ref: getReference(schema,id)};
		player.addOwned(owned);
		this.playerRepo.savePlayer(player);
	}
	
	/**
	 * Add a bookmark to the current player's bookmark list, and
	 * save it.
	 */
	addUserBookMark(newMark) {
		this.getCurrentPlayer().bookMarks.push(newMark);
		this.updateCurrentPlayer();
	}
	
	/**
	 * This allows client code to simply ask the controller to resolve any
	 * reference to any HoML object type stored in FireStore without needing
	 * to know which type it is.
	 */
	resolveReference(ref,onSuccess) {
		resolveReference(ref,onSuccess);
	}
	
	/**
	 * The path which was in the browser bar when the initial
	 * application load happened is restored. This is primarily
	 * intended to allow handling of deep links. A user follows a
	 * deep link into HoML, but is not currently authenticated, so
	 * they will not be able to properly view the link's contents.
	 * When we first instantiate the controller we capture this URL
	 * in the preAuthPath. Once login is complete the view will
	 * call this function. If the preAuthPath is the initial landing
	 * page, the router will do nothing, otherwise the page will be
	 * re-rendered with the proper content. In principle that can be
	 * called at any time, but I don't see other uses for it.
	 */
	goToPreAuthPath() {
		if(this.preAuthPath) {
			window.location.hash = this.preAuthPath;
		}
	}
	
	/**
	 * Trigger the router to act as if the user just navigated to the current route.
	 */
	refresh() {
		var hash = window.location.hash;
		this.router.navigate(hash);
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
	
	async getAllCallings() {
		return this.callingRepo.getAllCallingsAsync();
	}
	
	async getAllSpecies() {
		return this.speciesRepo.getAllSpeciesAsync();
	}
	
	async getAllOrigins() {
		return this.originRepo.getAllOriginsAsync();
	}

	getNpcs(npcrefs,onSuccess) {
		this.npcRepo.getReferencedNpcs(npcrefs,onSuccess);
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
	
	displayNpcView() {
		window.location.hash = '/npcs';
	}
	
	/**
	 * Do any additional work required after login is complete.
	 * Currently we just record the existing path and then set the
	 * path to '/authenticated', the view can display whatever it
	 * wants at that point, using the recorded path to decide if a
	 * deep link was hit, etc.
	 */
	authenticated() {
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
	
	getCurrentPlayerRef() {
		return getReference(schema.players,this.authenticator.player.id);
	}
	
	getImages(imageRefs,onSuccess) {
		this.imageRepo.getReferencedImages(imageRefs,onSuccess);
	}
	
	sendMessage(message) {
		return this.messageRepo.saveDto(message);
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
		if(this.getCurrentPlayer().id === game.owner.id)
			this.addOwned(game.id,schema.games,game.name);
		else {
			const owner = this.getPlayerById(game.owner.id);
			this.updatePlayerOwns(owner,game.id,schema.games,game.name);
		}
	}

	/**
	 * Handle the actual signup process via the authenticator.
	 */
	doSignUp(email, password, handle, onSuccess, onFailure) {
		this.authenticator.createUserWithEmailAndPassword(email,password,handle,onSuccess,onFailure);
	}
	
	updateCurrentPlayer() {
		const cp = this.getCurrentPlayer();
		this.playerRepo.savePlayer(cp);
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
	
	async doCharacterCriteriaSearch(criteria) {
		return await this.characterRepo.searchCharacters(criteria);
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

