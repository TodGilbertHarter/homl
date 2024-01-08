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
import { schema, collections } from './schema.js';
import {gameContext} from './context.js';
import {EntityId, Search, SearchParam} from './baserepository.js';
import {Authenticator} from './authenticator.js';
import {Router} from './router.js';
import { Timestamp } from 'firebase-firestore';

class Controller {
	/** @private */ view;
	/** @private */ authenticator;
	/** @private */ router;
	/** @private */ characterController;
	/** @private */ preAuthPath;
	/** @private */ context;
		
	constructor(view,characterController) {
		this.view = view;
		this.view.controller = this;
		this.characterController = characterController;
		characterController.controller = this;
		this.authenticator = new Authenticator(this);
		this.router = new Router({ mode: 'hash', root: '/'});;
		this.preAuthPath = window.location.hash;
		this.context = gameContext;
		this.router.add(/signup/,() => { this.view.displaySignUpUI(); });
		this.router.add(/signin/,() => { this.view.displaySignInUI(); });
		this.router.add(/signout/,() => { this.view.displaySignOutUI(); });
		this.router.add(/authenticated/,() => { this.view.displayAuthenticatedUI(); });
		this.router.add(/showgame\/(.*)/,(gameid) => { this.view.displayGameInfo(EntityId.EntityIdFromString(gameid)); });
		this.router.add(/showcharacter\/(.*)/,(characterid) => { this.view.displayCharacterInfo(EntityId.EntityIdFromString(characterid)); });
		this.router.add(/creategame/,() => { this.view.displayCreateGameUI(); });
		this.router.add(/equipment/,() => {this.view.displayEquipmentList(); });
		this.router.add(/playersettings/,() => {this.view.displayPlayerSettings(this.getCurrentPlayer().id); });
		this.router.add(/playermessages\/(.*)/,(playerId) => {this.view.displayPlayerMessages(EntityId.EntityIdFromString(playerId)); });
		this.router.add(/conversations\/(.*)/,(id) => {this.view.displayConversation(EntityId.EntityIdFromString(id)); });
		this.router.add(/player\/(.*)/,(id) => {this.view.displayPlayer(EntityId.EntityIdFromString(id)); });
		this.router.add(/feats/,() => {this.view.displayFeatList(); });
		this.router.add(/boons/,() => {this.view.displayBoonList(); });
		this.router.add(/npcs/,() => {this.view.displayNpcList(); });
		this.router.add(/about/,() => {this.view.displayAbout(this.version());});
		this.actions = {};
	}

	currentPlayerListener = (player) => { this.authenticator.player = player }
	
	/**
	 * Return the player associated with a given uid.
	 */
	async getPlayerByUid(uid) {
		const sparam = new SearchParam("uid",uid,"==");
		const s = new Search([sparam],collections.players);
		const results = await schema.players.search(s,this.currentPlayerListener);
		return results[0];
	}
	
	signout() {
		this.authenticator.signout((player) => { 
			schema.players.unregister(player,this.currentPlayerListener);
		});
	}
	
	async updatePlayerLoginTime(player) {
		await schema.players.update(player,(draft) => { draft.loggedIn = Timestamp.fromDate(new Date());},true );
	}

	async createNewPlayer(uid,listener) {
	    this.player = new Player(null,this.user.uid,Timestamp.fromDate(new Date()),null,handle,null);
	    return schema.players.update(player,() => {},true,listener);
	}
	
	async getAllCallings(listener) {
		return schema.callings.fetchAll(listener);
	}
	
	async getAllSpecies(listener) {
		return schema.species.fetchAll(listener);
	}
	
	async getAllOrigins(listener) {
		return schema.origins.fetchAll(listener);
	}

	async doCharacterCriteriaSearch(criteria,resultListener,entityListener) {
		const s = new Search(criteria,collections.characters,resultListener);
		return schema.characters.search(s,entityListener);
	}

	async getPlayer(playerId,listener) {
		return schema.players.fetch(playerId,listener);
	}
	
	/**
	 * Initiate a search for a game by name.
	 */
	async doGameSearch(name,resultListener,entityListener) {
		const sparam = new SearchParam("name",name,"==");
		const s = new Search([sparam],collections.games,resultListener)
		return schema.games.search(s,entityListener);
	}
	
	async getPlayers(players,listener) {
		return schema.players.fetchMany(players,listener);
	}

	async getNpcs(npcIds,listener) {
		return schema.npcs.fetchMany(npcIds,listener);
	}
	
	async saveConversation(conversation,mutator) {
		return schema.conversations.update(conversation,mutator,true);
	}
	
	async getParticipantConversations(playerId) {
		const sp = new SearchParam('participants',playerId.getReference(),'array-contains');
		const search = new Search([sp],collections.conversations);
		return schema.conversations.search(search);
	}
	
	async sendMessage(message) {
		return schema.messages.update(message,() => {},true);
	}
	
	async subscribe(contextid,handler) {
		const sparam = new SearchParam("contextId",contextid.getReference(),"==");
		const search = new Search([sparam],collections.messages,handler);
		return schema.messages.subscribe(search);
	}
	
	async unsubscribe(contextid,handler) {
		const sparam = new SearchParam("contextId",contextid.getReference(),"==");
		const search = new Search([sparam],collections.messages,handler);
		return schema.messages.unsubscribe(search);
	}

	displayConversation(id) {
		window.location.hash = `/conversations/${id}`;
	}
	
	displayPlayer(id) {
		window.location.hash = `/player/${id}`;
	}

	displayPlayerMessagesView(playerId) {
		const useid = playerId ? playerId : this.getCurrentPlayer().id;
		window.location.hash = `/playermessages/${useid}`;
	}

	displayAbout() {
		window.location.hash = '/about';
	}
	
	version() {
		return gebApp.version();
	}
	
	/**
	 * Run some hairball using the application context's hairball interpreter.
	 */
	runHairballProgram(program) {
		return this.context.runHairball(program);
	}
	
	addToContext(key,value) {
		this.context[key] = value;
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
	
	getAuthenticatedUser() {
		return this.authenticator.user;
	}
	
	getCurrentPlayer() {
		return this.authenticator.player;
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
	 * Handle signin using the authenticator.
	 */
	doSignIn(email, password, onSuccess, onFailure) {
		this.authenticator.signInWithEmailAndPassword(email,password, onSuccess, onFailure);
		this.compileCurrentPlayerMacros();
	}

	compileCurrentPlayerMacros() {
		const cp = this.getCurrentPlayer();
		if(cp?.macroset) {
			this.context.compileMacroSet(cp.macroset);
		}
	}
	
	/**
	 * Command the authenticator to sign the user out.
	 */
	doSignOut() {
		this.authenticator.signOut();
	}
	
	/**
	 * Handle a request to display a specific id of game in the main view.
	 */
	displayGameViewClicked(gameId) {
		window.location.hash = `/showgame/${gameId}`;
	}

	displayCharacterViewClicked(characterId) {
		window.location.hash = `/showcharacter/${characterId}`;
	}

	/**
	 * Handle the actual signup process via the authenticator.
	 */
	doSignUp(email, password, handle, onSuccess, onFailure) {
		this.authenticator.createUserWithEmailAndPassword(email,password,handle,onSuccess,onFailure);
		this.compileCurrentPlayerMacros();
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
	
	/**
	 * Trigger the router to act as if the user just navigated to the current route.
	 */
	refresh() {
		var hash = window.location.hash;
		this.router.navigate(hash);
	}
	
	/**
	 * Handle creating a new game.
	 */
	handleNewGame() {
		window.location.hash = '/creategame';
	}

	/**
	 * Add an owned record to the current player's list of owned
	 * items. This needs to be done in order to maintain the player's
	 * list of owned items.
	 */
	addOwned(id,name) {
		this.updatePlayerOwns(this.getCurrentPlayer(),id,name);
	}

	/**
	 * Update the ownership for the given player.
	 */	
	updatePlayerOwns(player,id,name) {
		return player.addOwned(id,name);
	}
	
	removeOwned(id) {
		this.removePlayerOwns(this.getCurrentPlayer(),id);
	}
	
	removePlayerOwns(player,id) {
		return player.deleteOwned(id);
	}
	
	saveCharacter(character) {
		schema.players.fetch(character.owner).then((owner) => {
	        this.updatePlayerOwns(owner,character.id,character.name);
			schema.characters.update(character,() => {},true);
		});
	}
	
	async getProficienciesByType(type) {
		return await schema.equipment.getEquipmentByType(type);
	}
	
	/** this will need a filter of some sort! */	
	async getAllPlayers() {
		return await schema.players.fetchAll();
	}

	/********************************************************** */

	/**
	 * Add a bookmark to the current player's bookmark list, and
	 * save it.
	 */
	addUserBookMark(newMark) {
		this.getCurrentPlayer().bookMarks.push(newMark);
		this.updateCurrentPlayer();
	}
	
	
	registerAction(actionName,extensionPoint) {
		if(!this.actions[actionName]) this.actions[actionName] = [];
		this.actions[actionName].push(extensionPoint);
	}
	
	enableAction(actionName) {
		if(this.actions[actionName])
			this.actions[actionName].forEach((extensionPoint) => extensionPoint());
	}
	
	getCurrentPlayerRef() {
		return getReference(schema.players,this.authenticator.player.id);
	}
	
	getImages(imageIds,onSuccess) {
		this.imageRepo.dtosFromIds(imageIds,onSuccess);
	}
	
	getCharactersByIds(ids,onSuccess) {
		this.characterRepo.dtosFromIds(ids,onSuccess);
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

	handleSaveGame(game) {
		this.gameRepo.saveGame(game);
		if(this.getCurrentPlayer().id === game.owner.id)
			this.addOwned(game.id,schema.games,game.name);
		else {
			const owner = this.getPlayerById(game.owner.id);
			this.updatePlayerOwns(owner,game.id,schema.games,game.name);
		}
	}

	updateCurrentPlayer() {
		const cp = this.getCurrentPlayer();
		this.playerRepo.savePlayer(cp);
		this.compileCurrentPlayerMacros();
	}
	
	/**
	 * Initiate a search for all games owned by a given player.
	 */
	getGamesByOwner(owner) {
		this.gameRepo.getGamesByOwner(owner.id,this.onGamesChanged.bind(this));
	}
	
	
	
	async getGameById(gameId) {
		return this.gameRepo.entityFromId(gameId);
	}
	
/*	doGameInfoDisplay(gameview) {
		this.gameRepo.getGameById(gameview.gameId,gameview.showGame.bind(gameview));
	} */
	
}

export { Controller };