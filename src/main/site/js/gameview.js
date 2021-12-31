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

/** @private */ const GameViewtemplate = document.createElement('template');
GameViewtemplate.innerHTML = `
		<style>
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

class GameView extends HTMLElement {
	/** @private */static template = GameViewtemplate;
	/** @private */ model;
	/** @type {string} @private */ gameId;
	
	constructor() {
		super();
		const content = GameView.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
 	}

	connectedCallback() {
		this.gameId = this.getAttribute('gameid');
		const gameview = this.shadowRoot.getElementById('gameview');
		gameview.innerHTML = `<p>Getting data for game ${this.gameId}</p>`;
	}
	
	render(game) {
		const gameview = this.shadowRoot.getElementById('gameview');
		game.getCharacters((characters) => {
			var listHTML = '<ul class="characterlist" id="characterlist">';
			characters.forEach((character) => { 
				listHTML = listHTML + `<li><span>${character.name}</span><button id='cvbtn${character.id}' data-id='${character.id}'>view</button></li>`; 
				});
			listHTML = listHTML + '</ul>';
			gameview.innerHTML = `<div class='fieldlabel'>Game Name:</div><div class='fieldvalue'>${game.name}</div>
			${listHTML}`;
			const clist = this.shadowRoot.getElementById('characterlist');
			clist.childNodes.forEach((li) => {
				li.childNodes[1].addEventListener('click',(e) => { 
					const id = e.target.getAttribute('data-id');
					console.log("clicked on a character "+id);
					window.gebApp.controller.displayCharacterViewClicked(id);
				});
			});
		});

	}
		
}

window.customElements.define('game-view',GameView);
