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
	
	constructor(gebApp,adocument) {
		this.gebApp = gebApp;
		this.theDocument = adocument;
	}

	displayCreateGameUI() {
		const displayarea = this.theDocument.getElementById('mainappview');
		displayarea.innerHTML = `<game-create id='gamecreate'></game-create>`;
	}
	
	addTabToLeftPanel(tab,tabContents) {
		this.theDocument.getElementById('leftslottabbar').appendChild(tab);
		this.theDocument.getElementById('leftslottabpanel').appendChild(tabContents);
	}
	
	currentDialog;
	
	displaySignInUI() {
		const dialogHTML = this.theDocument.getElementById('signin-dialog').innerHTML;
		this.currentDialog = this.theDocument.createElement('dialog-widget');
		this.currentDialog.innerHTML = dialogHTML;
		this.theDocument.getElementsByTagName('body')[0].appendChild(this.currentDialog);
		this.theDocument.getElementById('logindialogcancel').addEventListener('click',(e) => { 
			console.log('clicked cancel');
			this.currentDialog.dismiss();
			this.controller.goBack();
		});
		var myDoc = this.theDocument;
		this.theDocument.getElementById('logindialogsignin').addEventListener('click',(e) => { 
			console.log('clicked sign in');
			const email = this.theDocument.getElementById('logindialogemail').value;
			const password = this.theDocument.getElementById('logindialogpassword').value;
			this.controller.doSignIn(email,password, 
				(user,player) => { 
					this.currentDialog.dismiss(); 
					this.controller.authenticated(); },
				(message) => { 
					message = "<h1 class='dialogtitle'>Sign In Failure</h1><p>"+message+"</p>";
					this.displayErrorDialog(message); } 
				);
		});
	}
	
	displayGameLister(tbar,tabs) {
		const li = this.theDocument.createElement('li');
		li.innerText = 'Games';
		li.classList.add('active');
		tbar.appendChild(li);
		const content = this.theDocument.getElementById('gamesearchtemplate').content.cloneNode(true);
		content.firstChild.classList.add('active');
		tabs.appendChild(content);
	}
	
	displayTabs() {
		const tbar = this.theDocument.getElementById('leftslottabbar');
		const tabs = this.theDocument.getElementById('leftslottabpanel');
		this.displayGameLister(tbar,tabs);
	}
	
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
		const dialog = this.theDocument.getElementById('signin-dialog');
		const email = this.theDocument.getElementById('logindialogemail').value;
		const password = this.theDocument.getElementById('logindialogpassword').value;
		this.controller.doSignUp(email,password,
			() => { 
				this.currentDialog.dismiss(); 
				this.controller.signedUp(); 
				}, 
			(message) => {
				console.trace(message);
				message = `<h1 class='dialogtitle'>Sign Up Failure</h1><p>${message}</p>`;
				this.displayErrorDialog(message);
				this.currentDialog.dismiss();
			} 
		);
	}
	
	displayErrorDialog(message) {
		const dialog = this.theDocument.createElement('dialog-widget');
		dialog.innerHTML = `<div slot='contents' class='errordialogmessage'>${message}</div>`;
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
		characterSheetFactory(displayarea,characterId,this.gebApp.speciesRepo,
		  this.gebApp.callingRepo,this.gebApp.characterRepo,(sheet) => {
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

