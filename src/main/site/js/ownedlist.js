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
import { html, LitElement, repeat, ref, createRef } from 'lit3';
import { EntityId } from './baserepository.js';

class OwnedList extends LitElement {
	static properties = {
		_model: {attribute: false, state: true},
		actionButton: {}
	}
	
	constructor() {
		super();
		this._model = [];
		this.actionButton = null;
	}
	
	renderAction(item) {
		if(this.actionButton) {
			return html`<div><button data-itemid=${item.ref} @click=${this.buttonAction}>${this.actionButton}</button></div>`;
		}
		return null;
	}
	
	buttonAction(e) {
		this.dispatchEvent(new CustomEvent('ownedaction',{bubbles: true, composed: true, detail: {itemid: e.target.dataset.itemid}}));
	}
	
	displayItem(item) {
		return html`<div><div>${item.name}</div>${this.renderAction(item)}</div>`;
	}
	
	render() {
		return html`
		<style>
			div.list > div {
				display: flex;
			}
			div.list > div:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			} 
			div.list > div > div {
				flex: 1;
			}
		</style>
		<div class='searchlist' part='container'>
			<div part='list' id='list' class='list'>
				${repeat(this._model,(item) => this.displayItem(item))}
			</div>
			<div part='pager' id='pager'></div>
		</div>`;
	}

	set model(model) {
		this._model = model;
	}
}

window.customElements.define('owned-list',OwnedList);

class OwnedManager extends LitElement {
	
	constructor() {
		super();
		this.listRef = createRef();
		this.addEventListener('ownedaction',this.handleDelete);
	}
	
	handleDelete(e) {
		const id = EntityId.EntityIdFromString(e.detail.itemid);
		window.gebApp.controller.removeOwned(id);
	}
	
	firstUpdated() {
		this.listRef.value.model = window.gebApp.controller.getCurrentPlayer().owned;
	}
	
	render() {
		return html`<owned-list part='list' ${ref(this.listRef)} actionButton='x'></owned-list>`;
	}
}

window.customElements.define('owned-manager',OwnedManager);
