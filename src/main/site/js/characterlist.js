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
import { html, LitElement, repeat, css } from 'lit3';

class CharacterList extends LitElement {
	static properties = {
		_model: {state: true}
	}
	
	constructor() {
		super();
		this._model = [];
	}
	
	static styles = css`
			div.list > div {
				display: flex;
			}
			div.list > div:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			} 
			div.list > div > div {
				flex: 1;
			}
			.clickable {
				cursor: pointer;
			}
	`;
	
	render() {
		return html`<div class='searchlist' part='container' @click=${this.onClick} @drag=${this.onDrag}>
			<div part='list' id='list' class='list'>
				${this._model.map((character) => {return this.renderCharacter(character)})}
			</div>
			<div part='pager' id='pager'></div>
		</div>`;
	}

	renderCharacter(character) {
		return html`<div><div draggable='true' class='clickable' data-characterid=${character.id}>${character.name}</div><div>${character.calling.name}</div></div>`;
	}

	set model(model) {
		this._model = model;
	}

	onClick(e) {
		if(e.target !== e.currentTarget) {
			const cid = e.target.dataset.characterid;
			console.log(`clicked on character with id ${cid}`);
			window.gebApp.controller.displayCharacterViewClicked(cid);
		}
	}
	
	onDrag(e) {
		const cid = e.target.dataset.characterid;
		console.log(`Dragging character with id ${cid}`);
		e.dataTransfer.setData("text/plain",cid);
	}
	
/*	displayList() {
		const list = this.shadowRoot.getElementById('list');
		const model = this.model;
		if(model !== undefined && model !== null) {
			list.innerHTML = '';
			model.forEach((character) => {
				this.playerRepo.getReferencedPlayer(character.owner, (owner) => {
				const email = typeof owner === "undefined" ? "unknown" : owner.email;
				const gRow = window.gebApp.theDocument.createElement('div');
				gRow.innerHTML = `<div draggable='true' class='clickable'>${character.name}</div><div>${character.calling.name}</div>`;
				list.appendChild(gRow);
				gRow.firstChild.addEventListener('click',(e) => { 
						console.log(`clicked on character named ${character.name}`);
						window.gebApp.controller.displayCharacterViewClicked(character.id);
					});
				gRow.firstChild.addEventListener('dragstart',(de) => {
						de.dataTransfer.setData("text/plain",character.id);
					});
				});
			});
		} else {
			list.innerHTML = 'no results';
		}
	} */
	
}

window.customElements.define('character-list',CharacterList);
