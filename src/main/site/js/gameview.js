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

class GameView extends LitElement {
	static properties = {
		gameId: {},
		value: {}
	};
	
	constructor() {
		super();
	}
	
	render() {
		return html` <style>
			div.gamedescription {
				display: flex;
				flex-wrap: wrap;
			}
			div.gamedescription > div.fieldlabel {
				font-weight: bold;
				flex:25%;
			}
			div.gamedescription > div.fieldvalue {
				flex: 75%;
			}
		</style>
		<div class='gameview' part='gameview' id='gameview'>
		</div>`;
	}
	
	firstUpdated() {
		const gameview = this.shadowRoot.getElementById('gameview');
		gameview.innerHTML = `<p>Getting data for game ${this.gameId}</p>`;
	}
	
	updated(changed) {
		super.updated(changed);
		this.displayGame();
	}
	
	displayGame() {
		const gameview = this.shadowRoot.getElementById('gameview');
		const model = this.value;
		if(typeof model !== 'undefined') {
			model.getCharacters((characters) => {
				gameview.innerHTML = `<div class="gamedescription"><div class='fieldlabel'>Game Name:</div><div class='fieldvalue'>${model.name}</div></div>
				<div class='textdescription'>${model.description}</div>
				<character-list class=characterlist id="characterlist"></character-list>`;
				const clist = this.shadowRoot.getElementById('characterlist');
				clist.setModel(characters);
			});
		}
	}
	
	showGame(game) {
		this.value = game;
	}
		
}

window.customElements.define('game-view',GameView);
