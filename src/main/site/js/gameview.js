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

import { html, LitElement } from 'https://unpkg.com/lit@2.0.2/index.js?module';

class GameView extends LitElement {
	static properties = {
		gameId: {},
		value: {}
	};
	/** @private */ model;
	
	constructor() {
		super();
	}
	
	render() {
		return html`		<style>
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
		<div class='gameview' part='gameview' id='gameview'>
		</div>`;
	}
	
	firstUpdated() {
		const gameview = this.shadowRoot.getElementById('gameview');
		gameview.innerHTML = `<p>Getting data for game ${this.gameId}</p>`;
	}
	
	showGame(game) {
		this.model = game;
		const gameview = this.shadowRoot.getElementById('gameview');
		game.getCharacters((characters) => {
			gameview.innerHTML = `<div class='fieldlabel'>Game Name:</div><div class='fieldvalue'>${game.name}</div>
			<character-list class=characterlist id="characterlist"></character-list>`;
			const clist = this.shadowRoot.getElementById('characterlist');
			clist.setModel(characters);
		});

	}
		
}

window.customElements.define('game-view',GameView);
