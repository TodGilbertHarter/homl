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
import { html, LitElement } from 'lit2';
import { Game } from './game.js';
import {ref, createRef } from 'lit2/ref';

class GameCreate extends LitElement {
	static properties = {
		_model: {attribute:false, state: true},
		name: {},
		description: {}
	}
	
	constructor() {
		super();
		this._model = null;
		this.nameRef = createRef();
		this.descriptionRef = createRef();
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
			.gamecreate {
				width: fit-content;
			}
			input {
				width: 97%;
			}
		</style>
		<div class='gamecreate' part='gamecreate' id='gamecreate'>
			<label for='name'>Name:</label><input type='text' value=${this.name} id='name' ${ref(this.nameRef)}/>
			<label for='description'>Description:</label><big-input rows='5' cols='100' max='500' value=${this.description} ${ref(this.descriptionRef)} id='description'></big-input>
			<button id='save' @click="${this.handleSaveButton}">Save</button>
		</div>`;
	}
	
	firstUpdated() {
		const nref = this.name.value;
		nref?.focus();
	}

	set model(newModel) {
		this._model = newModel;
	}
	
	handleSaveButton() {
		if(this._model === null)
			this.model = new Game(null, 'new game', window.gebApp.authenticator.player, null, null, 'a new game' );
		this._model.name = this.name.value.value;
		this._model.description = this.description.value.value;
		window.gebApp.controller.handleSaveGame(this._model);
	}
}

window.customElements.define('game-create',GameCreate);
