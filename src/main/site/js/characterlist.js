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

class CharacterList extends LitElement {
	/** @private */ model;
	/** @private */ playerRepo;
	
	constructor() {
		super();
	}
	
	render() {
		return html`
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
	}

	firstUpdated() {
		this.playerRepo = window.gebApp.playerRepo;
	}	
	
	setModel(model) {
		this.model = model;
		this.displayList();
	}
	
	getRenderFn() {
		return this.setModel.bind(this);
	}
	
	displayList() {
		const list = this.shadowRoot.getElementById('list');
		const model = this.model;
		if(model != 'undefined') {
			list.innerHTML = '';
			model.forEach((character) => {
				this.playerRepo.getReferencedPlayer(character.owner, (owner) => {
				const gRow = window.gebApp.theDocument.createElement('div');
				gRow.innerHTML = `<div class='clickable'>${character.name}</div><div>${owner.email}</div>`;
				list.appendChild(gRow);
				gRow.firstChild.addEventListener('click',(e) => { 
					console.log(`clicked on character named ${character.name}`);
					window.gebApp.controller.displayCharacterViewClicked(character.id);
					});
				});
			});
		} else {
			list.innerHTML = 'no results';
		}
	}
	
}

window.customElements.define('character-list',CharacterList);
