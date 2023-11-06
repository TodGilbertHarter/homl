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

/** @private */ const SessionWidgettemplate = document.createElement('template');
SessionWidgettemplate.innerHTML = `<style>.component { box-shadow: 3px 3px 5px 0px var(--shadow-color) }</style><div class='sessionwidget' part='button' id='button'><slot name='text'><button class='component' id='signinbutton'>Sign In</button></slot></div>`;

class SessionWidget extends HTMLElement {
	/**
	Implements a widget which shows login status and initiates login and logout.
	 */

	/** @private */ static template = SessionWidgettemplate;
	/** @private */ bch;
	/** @private */ signedInState = false;

	constructor() {
		super();
		const content = SessionWidget.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
		this.bch = this.buttonClickHandler.bind(this);
	}
	
	connectedCallback() {
		const button = this.shadowRoot.getElementById('button');
		button.addEventListener('click',this.bch);
		this.signedInState = this.getAttribute('signedin');
	}
	
	buttonClickHandler() {
		if(this.signedInState) {
			window.gebApp.controller.signOutClicked();
		} else {
			window.gebApp.controller.signInClicked();
		}
	}
	
	signedIn(value) {
		this.signedInState = value;
		this.shadowRoot.getElementById('button').firstChild.firstChild.innerText = value ? 'Sign Out' : 'Sign In';
	}
	
	toggleSignedInState() {
		this.signedInState = !this.signedInState;
	}
}

window.customElements.define('session-widget',SessionWidget);
