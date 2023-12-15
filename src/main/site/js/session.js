/**
 * This software is Copyright (C) 2021-23 Tod G. Harter. All rights reserved.
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

import { html, LitElement } from 'lit3';

/**
 * Implements a widget which shows login status and initiates login and logout.
 */
class SessionWidget extends LitElement {
	static properties = {
		signedin: {},
		username: {}
	}
	
	/** @private */ bch;

	constructor() {
		super();
		this.signedin = "false";
		this.userName = null;
	}
	
	buttonClickHandler() {
		if(this.signedin === "true") {
			window.gebApp.controller.signOutClicked();
		} else {
			window.gebApp.controller.signInClicked();
		}
	}
	
	renderSignedIn() {
		return this.signedin === "true" ? `Sign Out ${this.username}` : 'Sign In';
	}

	render() {
		return html`<style>
			.component { 
				box-shadow: 3px 3px 5px 0px var(--shadow-color); 
			}
		</style>
		<div class='sessionwidget' part='button' id='button'>
			<slot name='text'><button class='component' id='signinbutton' @click=${this.buttonClickHandler}>${this.renderSignedIn()}</button></slot>
		</div>`;
	}
}

window.customElements.define('session-widget',SessionWidget);
