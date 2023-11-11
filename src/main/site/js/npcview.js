/**
 * This software is Copyright (C) 2023 Tod G. Harter. All rights reserved.
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
import {repeat} from 'lit2/repeat';
import {ref, createRef } from 'lit2/ref';

class NpcView extends LitElement {
	static properties = {
		id: {},
		name: {},
		statblock: {},
		editenabled: {},
		actionenabled: {}
	}
	
	constructor() {
		super();
		this.id = null;
		this.name = '';
		this.statblock = false;
		this.editenabled = 'false';
		this.actionenabled = false;
	}

	actionSelected() {
		this.dispatchEvent(new CustomEvent('npcaction',{bubbles: true, composed: true, detail: {npcid: this.id}}));
	}
	
	renderActionButton() {
		if(this.actionenabled !== 'false')
			return html`<button @click=${this.actionSelected}>${this.actionenabled}</button>`;
		else
			return null;
	}

	editSelected() {
		alert('edit selected');
	}
	
	renderEditButton() {
		if(this.editenabled !== 'false')
			return html`<button @click=${this.editSelected}>${this.editenabled}</button>`;
		else
			return null;
	}
	
	
	render() {
		return html`<div>
			<p>${this.name}</p>
			<div>${this.renderActionButton()}${this.renderEditButton()}</div>
		</div>`;
	}
}

window.customElements.define('npc-view',NpcView);

class NpcsViewer extends LitElement {
	static properties = {
		actionenabled: {},
		editenabled: {},
		_npcs: {attribute: false, state: true}
	}
	
	set npcs(npcs) {
		this._npcs = npcs;
	}
	
	addNpcs(npcs) {
		this._npcs = [...this._npcs,...npcs];
	}
	
	constructor() {
		super();
		this.actionenabled = 'false';
		this.editenabled = 'false';
		this._npcs = [];
	}
	
	render() {
		return html`<span>${repeat(this.notes,(item,index) => html`<npc-view actionenabled='${this.actionenabled}' editenabled='${this.editenabled}' name="${item.name}" statblock=${item.statblock} id=${item.id}></npc-view>`)}</span>`;
	}
}

window.customElements.define('npcs-viewer',NpcsViewer);
