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

import { html, LitElement } from 'https://unpkg.com/lit@2/index.js?module';
import {repeat} from 'https://unpkg.com/lit@2/directives/repeat.js?module';
import {ref, createRef} from 'https://unpkg.com/lit@2/directives/ref.js?module';

/**
 * Class to view all the equipment in the game and allow editing.
 */
class EquipmentView extends LitElement {
	
	constructor() {
		super();
		this.equipmentRepo = window.gebApp.equipmentRepo;
		this.equipment = [];
		this.implementRef = createRef();
		this.weaponRef = createRef();
	}
	
	connectedCallback() {
		super.connectedCallback();
		this.equipmentRepo.addListener(this.equipmentUpdated);
		this.equipmentRepo.getAllEquipment((equipment) => { this.equipmentUpdated(equipment);  });
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.equipmentRepo.removeListener(this.equipmentUpdated);
	}
	
	equipmentUpdated(equipment) {
		this.equipment = equipment;
		this.implementRef.value.setEquipmentList(this.filterEquipment('implement'));
		this.weaponRef.value.setEquipmentList(this.filterEquipment('weapon'));
		this.requestUpdate();
	}
	
	filterEquipment(type) {
		return this.equipment.filter((item) => item.type === type).sort(
			(a, b) => {
				const nameA = a.name.toUpperCase(); // ignore upper and lowercase
				const nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
	}
	
	render() {
		return html`
		<div>
			<h1 part='sectiontitle'>HoML Equipment</h1>
			<implement-list id='implements' ${ref(this.implementRef)}></implement-list>
			<weapon-list id='weapons' ${ref(this.weaponRef)}></weapon-list>
		</div>`
	}
}

window.customElements.define('equipment-view',EquipmentView);

class EquipmentList extends LitElement {
	constructor() {
		super();
		this.equipment = [];
	}

	setEquipmentList(list) {
		this.equipment = list;
		this.requestUpdate();
	}
	
}

class ImplementList extends EquipmentList {
	
	constructor() {
		super();
	}
	
	render() {
		return html`<style>
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
				font-size: 1.5em;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.tr > span { 
				display: table-cell; 
				font-weight: bold;
				padding-left: .5em;
				padding-right: .5em;
			}
			implement-view {
				display: table-row;
			}
			implement-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Implements</span>
			<div class='tr'><span>Name</span><span>Ability</span><span>Damage</span><span>Hands</span><span>Description</span></div>
			${repeat(this.equipment,(item,index) => html`<implement-view name=${item.name} implementId=${item.implementId} ability=${item.ability} damage=${item.damage}
			description=${item.description} hands=${item.hands}></implement-view>`)}
		</div>`;
	}
}

class WeaponList extends EquipmentList {
	
	constructor() {
		super();
	}
	
	render() {
		return html`<style>
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
				font-size: 1.5em;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.tr > span { 
				display: table-cell; 
				font-weight: bold;
				padding-left: .5em;
				padding-right: .5em;
			}
			weapon-view {
				display: table-row;
			}
			weapon-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Weapons</span>
			<div class='tr'><span>Name</span><span>Ability</span><span>Damage</span><span>Hands</span>
			<span>Range</span><span>Category</span><span>Type</span><span>Tags</span><span>Description</span></div>
			${repeat(this.equipment,(item,index) => html`<weapon-view name=${item.name} weaponId=${item.weaponId} ability=${item.ability} damage=${item.damage}
			description=${item.description} hands=${item.hands} range=${item.range} category=${item.category} type=${item.type} tags=${item.tags}></implement-view>`)}
			</div>`;
	}
}

window.customElements.define('implement-list',ImplementList);
window.customElements.define('weapon-list',WeaponList);

class ImplementView extends LitElement {
	static properties = {
		implementId: {},
		ability: {},
		damage: {},
		description: {},
		hands: {},
		name: {}
	};
	
	constructor() {
		super();
	}
	
	render() {
		return html`<style>
			span { 
				display: table-cell;
				padding-left: .5em;
				padding-right: .5em;
				}
		</style>
		<span>${this.name}</span><span>${this.ability}</span><span>${this.damage}</span><span>${this.hands}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('implement-view',ImplementView);

class WeaponView extends LitElement {
	static properties = {
		weaponId: {},
		ability: {},
		damage: {},
		description: {},
		hands: {},
		name: {},
		range: {},
		category: {},
		type: {},
		tags: {}
	};
	
	constructor() {
		super();
	}
	
	render() {
		return html`<style>
			span { 
				display: table-cell;
				padding-left: .5em;
				padding-right: .5em;
				}
		</style>
		<span>${this.name}</span><span>${this.ability}</span><span>${this.damage}</span><span>${this.hands}</span>
		<span>${this.range}</span><span>${this.category}</span><span>${this.type}</span><span>${this.tags}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('weapon-view',WeaponView);
