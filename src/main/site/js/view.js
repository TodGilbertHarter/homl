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
class View {
	/**
	This class represents the application view. It should be used by all the other code to interface with
	the DOM, etc. This allows us to abstract away the structure and organization of the UI's look.
	 */
	#theDocument;
	controller;
	
	constructor(adocument) {
		this.theDocument = adocument;
	}
	
	addTabToLeftPanel(tab,tabContents) {
		this.theDocument.getElementById('leftslottabbar').appendChild(tab);
		this.theDocument.getElementById('leftslottabpanel').appendChild(tabContents);
	}
	
	displaySignInUI() {
		const dialogHTML = this.theDocument.getElementById('signin-dialog').innerHTML;
		const dialog = this.theDocument.createElement('dialog-widget');
		dialog.innerHTML = dialogHTML;
		this.theDocument.getElementsByTagName('body')[0].appendChild(dialog);
		this.theDocument.getElementById('logindialogcancel').addEventListener('click',(e) => { 
			console.log('clicked cancel');
			dialog.dismiss();
			this.controller.goBack();
		});
		this.theDocument.getElementById('logindialogsignin').addEventListener('click',(e) => { 
			console.log('clicked sign in');
			const email = this.theDocument.getElementById('logindialogemail').value;
			const password = this.theDocument.getElementById('logindialogpassword').value;
			this.controller.doSignIn(email,password, 
				(user,player) => { 
					dialog.dismiss(); 
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
		const content = this.theDocument.createElement('div');
		content.classList.add('tabcontents');
		content.classList.add('active');
		content.innerText = 'some games';
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
		tabs.innerHTML = '';
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
	
	getSessionWidget() {
		return this.theDocument.getElementById('sessionwidget');
	}
	
	displaySignUpUI() {
		const dialog = this.theDocument.getElementById('signin-dialog');
		const email = this.theDocument.getElementById('logindialogemail').value;
		const password = this.theDocument.getElementById('logindialogpassword').value;
		this.controller.doSignUp(email,password,
			() => { dialog.dismiss(); this.controller.signedUp(); }, 
				(message) => {message = "<h1 class='dialogtitle'>Sign Up Failure</h1><p>"+message+"</p>";
				this.displayErrorDialog(message);} 
		);
	}
	
	displayErrorDialog(message) {
		const dialog = this.theDocument.createElement('dialog-widget');
		dialog.innerHTML = `<div slot='contents' class='errordialogmessage'>${message}</div>`;
		this.theDocument.getElementsByTagName('body')[0].appendChild(dialog);
	}
}
