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

class NpcsList extends LitElement {
	static properties = {
		actionenabled: {},
		editenabled: {},
		extended: {},
		caption: {},
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
		this.extended = 'false';
		this.caption = null;
	}

	renderCaption() {
		if(this.caption) {
			return html`<span>${this.caption}</span>`
		}
		return null;
	}
	renderHeader() {
		if(this.extended === 'true') {
			return html`<div class='header'><span>Name</span><span class='right'>Level</span><span>Tags</span><span>Role</span><span>Size</span><span>FORT</span><span>REF</span><span>WILL</span></div>`;
		}
		return html`<div class='header'><span>Name</span><span>Level</span><span>Tags</span><span>Role</span></div>`;
	}
	
	_mysteryCatenate(tags) {
		var out = '';
		for(var i = 0; i < tags.length; i++) {
			out += tags[i]; if(i < tags.length - 1) out += ", ";
		}
		return out;
	}
	
	renderRow(item) {
		const joined = this._mysteryCatenate(item.tags);
		if(this.extended === 'true') {
			return html`<div class='tr'><span>${item.name}</span><span class='right'>${item.level}</span><span>${joined}</span><span>${item.role}</span>
			<span>${item.size}</span><span>${item.fort}</span><span>${item.ref}</span><span>${item.will}</span></div>`;
		}
		return html`<div class='tr'><span>${item.name}</span><span class='right'>${item.level}</span><span>${joined}</span><span>${item.role}</span></div>`;
	}
	
	render() {
		return html`<style>
			div.table { 
				width: 100%;
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table > span {
				display: table-caption;
				font-weight: bold;
				font-size: 1.5em;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.header { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.header > span { 
				display: table-cell; 
				font-weight: bold;
				padding-left: .5em;
				padding-right: .5em;
			}
			div.tr > span { 
				display: table-cell; 
				padding-left: .5em;
				padding-right: .5em;
			}
			div.tr:nth-child(even) {
				background-color: var(--theme-bg-dark);
			}
			.right {
				text-align: right;
			}
		</style>
		<div class='table'>
			${this.renderCaption()}
			${this.renderHeader()}
			${repeat(this._npcs,(item,index) => this.renderRow(item))}
		</div>`;
	}
	
}

window.customElements.define('npcs-list',NpcsList);

class NpcsViewer extends LitElement {
	static properties = {
		label: {},
		actionenabled: {},
		editenabled: {},
		extended: {}
	}
	
	set npcs(npcs) {
		this.npcListViewRef.value.npcs = npcs;
	}
	
	addNpcs(npcs) {
		this.npcListViewRef.value.addNpcs(npcs);
	}
	
	constructor() {
		super();
		this.actionenabled = 'false';
		this.editenabled = 'false';
		this.npcListViewRef = createRef();
		this.extended = 'false';
	}
	
	renderLabel() {
		if(this.label) {
			return html`<div part='label'>${this.label}</div>`;
		}
		return null;
	}
	
	render() {
		return html`<div>${this.renderLabel()}<npcs-list extended=${this.extended} actionenabled='${this.actionenabled}' editenabled='${this.editenabled}' ${ref(this.npcListViewRef)}></npcs-list></div>`;
	}
}

window.customElements.define('npcs-viewer',NpcsViewer);

class MonstersViewer extends LitElement {
	
	constructor() {
		super();
		this.npcsViewRef = createRef();
	}

	firstUpdated() {
		window.gebApp.npcRepo.findDtos("statblock",true,'==',(monsters) => {this.npcsViewRef.value.npcs = monsters; },(msg) => { console.log("Monster view failed "+msg)});
	}
	
	render() {
		return html`<h1 part='sectiontitle'>Monsters &amp; NPCs</h1>
		<npcs-viewer extended='true' ${ref(this.npcsViewRef)}></npcs-viewer>`;
	}
}

window.customElements.define('monsters-viewer',MonstersViewer);

