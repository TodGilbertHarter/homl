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
import { characterSheetFactory } from './charactersheet.js';

class NotView { /* Closure Compiler had fits about the class name 'View', hence the weird name... */
	/**
	This class represents the application view. It should be used by all the other code to interface with
	the DOM, etc. This allows us to abstract away the structure and organization of the UI's look.
	 */
	/** @private */ theDocument;
	/** @private */ gebApp;
	controller;
	currentDialog;
	
	constructor(gebApp,adocument) {
		this.gebApp = gebApp;
		this.theDocument = adocument;
	}

	displayEquipmentList() {
		const displayarea = this.theDocument.getElementById('mainappview');
		displayarea.innerHTML = `<equipment-view id='equipmentview'></equipment-view>`;
	}
	
	displayFeatList() {
		const displayarea = this.theDocument.getElementById('mainappview');
		displayarea.innerHTML = `<feat-viewer id='featviewer'></feat-viewer>`;
	}
	/**
	 * Render the Create a game UI.
	 */
	displayCreateGameUI() {
		const displayarea = this.theDocument.getElementById('mainappview');
		displayarea.innerHTML = `<game-create id='gamecreate'></game-create>`;
	}
	
	/**
	 * Display the user sign in UI.
	 */		
	displaySignInUI() {
		const dialog = this.theDocument.createElement('dialog-widget');
		dialog.innerHTML = this.theDocument.getElementById('signin-dialog').innerHTML;
		this.theDocument.getElementsByTagName('body')[0].appendChild(dialog);

		dialog.populate([
			(e) => { 
				console.log('clicked sign in');
				const email = dialog.querySelector('#logindialogemail').value;
				const password = dialog.querySelector('#logindialogpassword').value;
				this.controller.doSignIn(email,password, 
					(user,player) => { 
						dialog.dismiss(); 
						this.controller.authenticated(); },
					(message) => { 
						message = "<h1 class='dialogtitle'>Sign In Failure</h1><p>"+message+"</p>";
						this.displayErrorDialog(message); } 
					);
			},
			(e) => { 
				console.log('clicked cancel');
				dialog.dismiss();
				this.controller.goBack();
			}
		]);
	}
	
	/**
	 * Add a new tab to the left tab panel.
	 */
	addTabToLeftPanel(tab,tabContents,isactive) {
		const tp = this.theDocument.getElementById('leftslottabpanel');
		tp.addTab(tab,tabContents,isactive);
	}

	/**
	 * Add a game lister component to the given tab bar.
	 */
	displayGameLister(isactive) {
		const content = this.theDocument.createElement('tab-body');
		content.innerHTML = "<game-search class='search' id='lefttabgamesearch' displayid='leftgametablist'></game-search><game-list id='leftgametablist'></game-list>";
		this.addTabToLeftPanel('Games',content,isactive)
	}
	
	displayCharacterLister(isactive) {
		const content = this.theDocument.createElement('tab-body');
		content.innerHTML = "<character-search class='search' id='lefttabgamesearch' displayid='leftcharactertablist'></character-search><character-list id='leftcharactertablist'></character-list>";
		this.addTabToLeftPanel('Characters',content,isactive)
	}
	
	/**
	 * Display the default tab arrangement.
	 */
	displayTabs() {
		this.displayGameLister(false);
		this.displayCharacterLister(true);
	}
	
	/**
	 * Remove all elements from the tab bar.
	 */
	clearTabs() {
		const tbar = this.theDocument.getElementById('leftslottabbar');
		tbar.innerHTML = '';
		const tabs = this.theDocument.getElementById('leftslottabpanel');
		tabs.childNodes.forEach((t) => { if(t.nodeName === 'DIV') { t.parentElement.removeChild(t) } });
	}
	
	displaySignOutUI() {
		console.log("got to signed out UI");
		this.getSessionWidget().signedIn(false);
		this.clearTabs();
	}
	
	displayAuthenticatedUI() {
		console.log('got to authenticated UI');
		this.getSessionWidget().signedIn(true);
		this.displayTabs();
	}
	
	gameListAttached(list) {
		this.controller.registerGamesListener(list.getRenderFn());
		this.controller.getGamesByOwner(window.gebApp.authenticator.player);
	}
	
	getSessionWidget() {
		return this.theDocument.getElementById('sessionwidget');
	}
	
	getElement(id) {
		return this.theDocument.getElementById(id);
	}
	
	displaySignUpUI() {
		const dialog = this.theDocument.createElement('dialog-widget');
		dialog.innerHTML = this.theDocument.getElementById('signup-dialog').innerHTML;
		this.theDocument.getElementsByTagName('body')[0].appendChild(dialog);
		dialog.populate([
			(e) => { 
				console.log('clicked sign up');
				const email = dialog.querySelector('#logindialogemail').value;
				const password = dialog.querySelector('#logindialogpassword').value;
				this.controller.doSignUp(email,password,
					() => { 
						dialog.dismiss(); 
						this.controller.signedUp(); 
						}, 
					(message) => {
						console.trace(message);
						message = `<h1 class='dialogtitle'>Sign Up Failure</h1><p>${message}</p>`;
						this.displayErrorDialog(message);
						dialog.dismiss();
					} 
				);
			},
			(e) => { 
				console.log('clicked cancel');
				dialog.dismiss();
				this.controller.goBack();
			}
		]);
	}
	
	displayErrorDialog(message) {
		const dialog = this.theDocument.createElement('dialog-widget');
		dialog.innerHTML = `<div slot='content' class='errordialogmessage'>${message}</div>`;
		this.theDocument.getElementsByTagName('body')[0].appendChild(dialog);
	}
	
	displayGameInfo(gameId) {
		const displayarea = this.theDocument.getElementById('mainappview');
		displayarea.innerHTML = `<game-view gameid='${gameId}' id='gv${gameId}'></game-view>`;
		const gameview = this.theDocument.getElementById(`gv${gameId}`);
		this.controller.doGameInfoDisplay(gameview);
	}
	
	displayCharacterInfo(characterId) {
		const displayarea = this.theDocument.getElementById('mainappview');
		characterSheetFactory(displayarea,characterId,this.gebApp.characterRepo,(sheet) => {
/*			const c = displayarea.childNodes[0];
			if(c !== 'undefined') { 
				displayarea.replaceChild(sheet,c);
			} else { // this area could be empty
				displayarea.appendChild(sheet);
			} */
		});
	}
	
}

export { NotView };

