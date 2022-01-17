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
import { getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

/** @private */ const GameListtemplate = document.createElement('template');
GameListtemplate.innerHTML = `
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
		<div class='searchlist' part='container'>
			<div part='list' id='list' class='list'></div>
			<div part='pager' id='pager'></div>
		</div>`;

class GameList extends HTMLElement {
	/** @private */ static template = GameListtemplate;
	/** @private */ model;
	
	constructor() {
		super();
		const content = GameList.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
 	}

	connectedCallback() {
		window.gebApp.view.gameListAttached(this);
	}
	
	setModel(model) {
		this.model = model;
		this.render();
	}
	
	getRenderFn() {
		return this.setModel.bind(this);
	}
	
	render() {
		const list = this.shadowRoot.getElementById('list');
		const model = this.model;
		if(model != 'undefined') {
			list.innerHTML = '';
			model.forEach((game) => {
				getDoc(game.owner).then((owner) => {
				const gRow = window.gebApp.theDocument.createElement('div');
				gRow.innerHTML = `<div class='clickable'>${game.name}</div><div>${owner.data().email}</div>` // game.data().name;
				list.appendChild(gRow);
				gRow.firstChild.addEventListener('click',(e) => { 
					console.log(`clicked on game named ${game.name} with id ${game.id}`);
					window.gebApp.controller.displayGameViewClicked(game.id);
					});
				});
			});
		} else {
			list.innerHTML = 'no results';
		}
	}
	
}

window.customElements.define('game-list',GameList);
