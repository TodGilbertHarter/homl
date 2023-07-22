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
import { html, LitElement } from 'https://unpkg.com/lit@2/index.js?module';
import { Game } from './game.js';

class GameCreate extends LitElement {
	/** @private */ model;
	
	constructor() {
		super();
 	}

	render() {
		return html`<style>
			div.list > div {
				display: flex;
			}
			div.list > div > div {
				flex: 1;
			}
			.clickable {
				cursor: pointer;
			}
		</style>
		<div class='gamecreate' part='gamecreate' id='gamecreate'>
			<label for='name'>Name:</label><input type='text' id='name'/>
			<button id='save' @click="${this.handleSaveButton}">Save</button>
		</div>`;
	}
	
	firstUpdated() {
		this.model = new Game(null, 'new game', window.gebApp.authenticator.player, null, null );
	}
	
	handleSaveButton() {
		this.model.name = this.shadowRoot.getElementById('name').value;
		window.gebApp.controller.handleSaveGame(this.model);
	}
}

window.customElements.define('game-create',GameCreate);
