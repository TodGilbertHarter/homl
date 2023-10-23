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

import { html, LitElement, render } from 'https://unpkg.com/lit@2/index.js?module';
import {repeat} from 'https://unpkg.com/lit@2/directives/repeat.js?module';
import {ref, createRef} from 'https://unpkg.com/lit@2/directives/ref.js?module';

/**
 * Class to view all the equipment in the game.
 */
class EquipmentView extends LitElement {
	
	constructor() {
		super();
		this.equipmentRepo = window.gebApp.equipmentRepo;
		this.equipment = [];
		this.implementRef = createRef();
		this.weaponRef = createRef();
		this.gearRef = createRef();
		this.armorRef = createRef();
		this.toolRef = createRef();
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
		this.gearRef.value.setEquipmentList(this.filterEquipment('gear'));
		this.armorRef.value.setEquipmentList(this.filterEquipment('armor'));
		this.toolRef.value.setEquipmentList(this.filterEquipment('tool'));
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
			<armor-list id='armor' ${ref(this.armorRef)}></armor-list>
			<gear-list id='gear' ${ref(this.gearRef)}></gear-list>
			<tool-list id='tools' ${ref(this.toolRef)}></tool-list>
		</div>`
	}
}

window.customElements.define('equipment-view',EquipmentView);

class EquipmentList extends LitElement {
	constructor() {
		super();
		this.equipment = [];
		this.item = null;
		this.detailTemplate = (item) => html`<div slot='content'>Details: ${item.name}</div>`;
		this.onClick = (e) => {
			const id = e.target.id;
			const dialog = document.createElement('dialog-widget');
			this.item = this.lookupItem(id);
			render(this.detailTemplate(this.item),dialog);
			document.getElementsByTagName('body')[0].appendChild(dialog);
		}
	}

	lookupItem(id) {
		for(var i = 0; i < this.equipment.length; i++) {
			if(this.equipment[i].id === id) {
				return this.equipment[i];
			}
		}
	}
	
	setEquipmentList(list) {
		this.equipment = list;
		this.requestUpdate();
	}
	
}

class ImplementList extends EquipmentList {
	
	constructor() {
		super();
		this.detailTemplate = (item) => html`<div slot='content'>
			<h1 class='equipmentdetailtitle'>Implement Details</h1>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Name:</span><span class='equipmentdetailvalue'>${item.name}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Cost:</span><span class='equipmentdetailvalue'>${item.cost}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Ability:</span><span class='equipmentdetailvalue'>${item.ability}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Damage:</span><span class='equipmentdetailvalue'>${item.damage}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Hands:</span><span class='equipmentdetailvalue'>${item.hands}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetailvalue'>${item.description}</span></div>
		 </div>`;
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
			${repeat(this.equipment,(item,index) => html`<implement-view  @click=${this.onClick} name=${item.name} id=${item.id} ability=${item.ability} damage=${item.damage}
			description=${item.description} hands=${item.hands}></implement-view>`)}
		</div>`;
	}
}

class WeaponList extends EquipmentList {
	
	constructor() {
		super();
		this.detailTemplate = (item) => html`<div slot='content'>
			<h1 class='equipmentdetailtitle'>Weapon Details</h1>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Name:</span><span class='equipmentdetailvalue'>${item.name}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Category:</span><span class='equipmentdetailvalue'>${item.category}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Type:</span><span class='equipmentdetailvalue'>${item.weapontype}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Ability:</span><span class='equipmentdetailvalue'>${item.ability}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Damage:</span><span class='equipmentdetailvalue'>${item.damage}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Hands:</span><span class='equipmentdetailvalue'>${item.hands}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Range:</span><span class='equipmentdetailvalue'>${item.range}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Tags:</span><span class='equipmentdetailvalue'>${item.tags}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Cost:</span><span class='equipmentdetailvalue'>${item.cost}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Load:</span><span class='equipmentdetailvalue'>${item.load}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetailvalue'>${item.description}</span></div>
		 </div>`;
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
			${repeat(this.equipment,(item,index) => html`<weapon-view @click=${this.onClick} name=${item.name} id=${item.id} ability=${item.ability} damage=${item.damage}
			description=${item.description} hands=${item.hands} range=${item.range} category=${item.category} type=${item.weapontype} tags=${item.tags}></weapon-view>`)}
			</div>`;
	}
}

class ArmorList extends EquipmentList {
	
	constructor() {
		super();
		this.detailTemplate = (item) => html`<div slot='content'>
			<h1 class='equipmentdetailtitle'>Armor Details</h1>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Name:</span><span class='equipmentdetailvalue'>${item.name}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>DR:</span><span class='equipmentdetailvalue'>${item.dr}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Ability:</span><span class='equipmentdetailvalue'>${this.listAbilities(item)}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Load:</span><span class='equipmentdetailvalue'>${this.load}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Cost:</span><span class='equipmentdetailvalue'>${item.cost}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetailvalue'>${item.description}</span></div>
		 </div>`;
	}
	
	listAbilities(item) {
		return `DEX: ${item.DEX}, CON: ${item.CON}`;
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
			armor-view {
				display: table-row;
			}
			armor-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Armor</span>
			<div class='tr'><span>Type</span><span>DR</span><span>Load</span><span>Cost</span>
			<span>DEX</span><span>CON</span><span>Description</span></div>
			${repeat(this.equipment,(item,index) => html`<armor-view @click=${this.onClick} name=${item.name} id=${item.id} dr=${item.dr} dex=${item.DEX} con=${item.CON} 
			cost=${item.cost} load=${item.load} description=${item.description}></armor-view>`)}
		</div>`;
	}
}

class GearList extends EquipmentList {
	
	constructor() {
		super();
		this.detailTemplate = (item) => html`<div slot='content'>
			<h1 class='equipmentdetailtitle'>Equipment Details</h1>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Name:</span><span class='equipmentdetailvalue'>${item.name}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Cost:</span><span class='equipmentdetailvalue'>${item.cost}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Load:</span><span class='equipmentdetailvalue'>${item.load}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetailvalue'>${item.description}</span></div>
		 </div>`;
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
			gear-view {
				display: table-row;
			}
			gear-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Gear &amp; Goods</span>
			<div class='tr'><span>Name</span><span>Load</span><span>Cost</span><span>Description</span></div>
			${repeat(this.equipment,(item,index) => html`<gear-view @click=${this.onClick} name=${item.name} id=${item.id} cost=${item.cost} load=${item.load}
			description=${item.description}></gear-view>`)}
		</div>`;
	}
}

class ToolList extends EquipmentList {
	
	constructor() {
		super();
		this.detailTemplate = (item) => html`<div slot='content'>
			<h1 class='equipmentdetailtitle'>Tool Details</h1>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Name:</span><span class='equipmentdetailvalue'>${item.name}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Ability:</span><span class='equipmentdetailvalue'>${item.ability}</span></div>		 	
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Cost:</span><span class='equipmentdetailvalue'>${item.cost}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Load:</span><span class='equipmentdetailvalue'>${item.load}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetailvalue'>${item.description}</span></div>
		 </div>`;
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
			tool-view {
				display: table-row;
			}
			tool-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Tools</span>
			<div class='tr'><span>Name</span><span>Ability</span><span>Load</span><span>Cost</span><span>Description</span></div>
			${repeat(this.equipment,(item,index) => html`<tool-view @click=${this.onClick} name=${item.name} ability=${item.ability} id=${item.id} cost=${item.cost} load=${item.load}
			description=${item.description}></tool-view>`)}
		</div>`;
	}
}

window.customElements.define('implement-list',ImplementList);
window.customElements.define('weapon-list',WeaponList);
window.customElements.define('armor-list',ArmorList);
window.customElements.define('gear-list',GearList);
window.customElements.define('tool-list',ToolList);

class ImplementView extends LitElement {
	static properties = {
		id: {},
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
			.centered {
				text-align: center;
			}
		</style>
		<span>${this.name}</span><span class='centered'>${this.ability}</span><span class='centered'>${this.damage}</span><span class='centered'>${this.hands}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('implement-view',ImplementView);

class WeaponView extends LitElement {
	static properties = {
		id: {},
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
			.centered {
				text-align: center;
			}
		</style>
		<span>${this.name}</span><span class='centered'>${this.ability}</span><span class='centered'>${this.damage}</span><span class='centered'>${this.hands}</span>
		<span class='centered'>${this.range}</span><span class='centered'>${this.category}</span><span class='centered'>${this.type}</span><span class='centered'>${this.tags}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('weapon-view',WeaponView);

class ArmorView extends LitElement {
	static properties = {
		id: {},
		name: {},
		dr: {},
		load: {},
		cost: {},
		dex: {},
		con: {},
		description: {},
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
			.centered {
				text-align: center;
			}
		</style>
		<span>${this.name}</span><span class='centered'>${this.dr}</span><span class='centered'>${this.load}</span><span class='centered'>${this.cost}</span>
		<span class='centered'>${this.dex}</span><span class='centered'>${this.con}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('armor-view',ArmorView);

class GearView extends LitElement {
	static properties = {
		id: {},
		description: {},
		name: {},
		cost: {},
		load: {}
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
			.centered {
				text-align: center;
			}
		</style>
		<span>${this.name}</span><span class='centered'>${this.load}</span><span class='centered'>${this.cost}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('gear-view',GearView);

class ToolView extends LitElement {
	static properties = {
		id: {},
		description: {},
		name: {},
		cost: {},
		load: {},
		ability: {}
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
			.centered {
				text-align: center;
			}
		</style>
		<span>${this.name}</span><span class='centered'>${this.ability}</span><span class='centered'>${this.load}</span><span class='centered'>${this.cost}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('tool-view',ToolView);
