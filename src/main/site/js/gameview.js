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
import {ref, createRef} from 'lit2/ref';

class GameView extends LitElement {
	static properties = {
		gameId: {},
		value: {},
		model: {attribute: false, state: true}
	};
	
	constructor() {
		super();
		this.gameViewRef = createRef();
		this.characterListRef = createRef();
		this.model = null;
	}
	
	showGame(game) {
		this.model = game;
	}

	updated(changed) {
		super.updated(changed);
		if(this.model) {
			this.model.getCharacters((characters) => {
				this.characterListRef.value.setModel(characters);
			});
		}
	}
	
	render() {
		return html` <style>
			div.gameview {
				width: auto;
				max-width: 500px;
				background-color: var(--box-bg);
			}
			div.gamedescription {
				width: auto;
			}
			div.gamedescription > span.fieldlabel {
				width: 8em;
			}
			div.gamedescription > span.fieldvalue {
				width: auto;
			}
			div.textdescription {
				border: 1px solid black;
			}
			.fieldlabel {
				padding-right: .25em;
				font-weight: bold;
				font-size: 1.125em;
			}
		</style>
		<div @dragover=${this.dragOver} @drop=${this.drop} class='gameview' part='gameview' id='gameview' ${ref(this.gameViewRef)}>
			${this.renderView()}
		</div>`;
	}
	
	dragOver(de) {
		de.preventDefault();
	}
	
	saveGame() {
		window.gebApp.gameRepo.saveGame(this.model);
	}
	
	drop(de) {
		const data = de.dataTransfer.getData("text/plain");
		console.log("dropped character with id "+data);
		this.model.addCharacter(data);
		this.saveGame();
	}
	
	renderView() {
		if(this.model) {
			return html`<div class="gamedescription"><span class='fieldlabel'>Name:</span><span class='fieldvalue'>${this.model.name}</span></div>
				<div class='textdescription'>${this.model.description}</div>
				<character-list class=characterlist id="characterlist" ${ref(this.characterListRef)}></character-list>`;
		} else {
			return html`<p>Getting data for game ${this.gameId}</p>`;
		}
	}
}

window.customElements.define('game-view',GameView);
