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

import { html, LitElement, render, repeat, ref, createRef } from 'lit3';

/**
 * Class to view all the equipment in the game.
 */
class EquipmentView extends LitElement {
	static properties = {
		selectable: {}
	}
	
	constructor() {
		super();
		this.equipmentRepo = window.gebApp.equipmentRepo;
		this.equipment = [];
		this.selectable = 'false';
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
			<style>
				implement-list::part(tableheader), weapon-list::part(tableheader), armor-list::part(tableheader), gear-list::part(tableheader), tool-list::part(tableheader) {
					font-size: 1.5em;
				}

				implement-list::part(equipmenttitle), weapon-list::part(equipmenttitle), armor-list::part(equipmenttitle), gear-list::part(equipmenttitle), tool-list::part(equipmenttitle) {
					font-size: 1.5em;
				}
			</style>
			<h1 part='sectiontitle'>HoML Equipment</h1>
			<implement-list selectable='${this.selectable}' id='implements' ${ref(this.implementRef)}></implement-list>
			<weapon-list selectable='${this.selectable}' id='weapons' ${ref(this.weaponRef)}></weapon-list>
			<armor-list selectable='${this.selectable}' id='armor' ${ref(this.armorRef)}></armor-list>
			<gear-list selectable='${this.selectable}' id='gear' ${ref(this.gearRef)}></gear-list>
			<tool-list selectable='${this.selectable}' id='tools' ${ref(this.toolRef)}></tool-list>
		</div>`
	}
}

window.customElements.define('equipment-view',EquipmentView);

class EquipmentList extends LitElement {
	static properties = {
		selectable: {},
		dialogselector: {},
		descriptiondisabled: {},
		calculateload: {},
		actionenabled: {}
	}
	
	constructor() {
		super();
		this.equipment = [];
		this.item = null;
		this.dialogselector = 'body';
		this.selectable = 'false';
		this.descriptiondisabled = 'false';
		this.calculateload = 'false';
		this.actionenabled = 'false';
		this.dialog = null;
		this.load = 'N/A';
		this.cost = 'N/A';
		this.detailTemplate = (item) => html`<div slot='content'>Details: ${item.name}</div>${this.renderButtons()}`;
		this.onClick = (e) => {
			const id = e.target.id;
			this.dialog = document.createElement('dialog-widget');
			this.item = this.lookupItem(id);
			render(this.detailTemplate(this.item),this.dialog);
			document.getElementsByTagName('body')[0].appendChild(this.dialog);
		}
	}

	willUpdate() {
		if(this.calculateload === 'true') {
			let totalload = 0;
			for(var i = 0; i < this.equipment.length; i++) {
				let l = parseInt(this.equipment[i].load);
				if(l === NaN) { l = 0}
				if(this.equipment[i].load > 0) {
					totalload += l;
				}
			}
			if(totalload > 0) {this.load = totalload}
		}
	}
	
	dismissClickHandler(e) {
		this.dismiss();
	}
	
	selectClickHandler(e) {
		this.dispatchEvent(new CustomEvent('equipmentselected',{bubbles: true, composed: true, detail: {equipment: this.item}}));
		this.dismiss();
	}

	dismiss() {
		const tag = document.querySelector(this.dialogselector);
		tag.removeChild(this.dialog);
		this.dialog = null;
	}
	
	renderAction() {
		if(this.actionenabled !== 'false') {
			return html`<span></span>`;
		}
		return null;
	}
	
	renderDescription() {
		if(this.descriptiondisabled === 'false') {
			return html`<span>Description</span>`;
		}
		return null;
	}
	
	renderButtons() {
		if(this.selectable === 'true') {
			return html`<button class='dialogbutton' slot='buttonbar' id='equipmentselect' @click=${this.selectClickHandler.bind(this)}>select</button>
			<button class='dialogbutton' slot='buttonbar' id='dismiss' @click=${this.dismissClickHandler.bind(this)}>dismiss</button>`;
		}
		return '';
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
		 	<div class='equipmentdetailrow'><span class='equipmentdetaillabel'>Load:</span><span class='equipmentdetailvalue'>${item.load}</span></div>
		 	<div class='equipmentdetailrow'><span class='equipmentdetailvalue'>${item.description}</span></div>
		 </div>${this.renderButtons()}`;
	}

	renderLoad() {
		if(this.calculateload === 'true') {
			return html`<div class='tr footer'><span></span><span></span><span></span><span></span><span>Total:</span><span class='right'>${this.load}</span></div>`;
		}
		return null;
	}

	render() {
		return html`<style>
			.right {
				text-align: right;
			}
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.footer { 
				border-top: 1px double black;
				background-color: var(--theme-bg);
				color: var(--theme-fg);
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
			<span part='equipmenttitle'>Implements</span>
			<div part='tableheader' class='tr'>${this.renderAction()}<span>Name</span><span>Ability</span><span>Damage</span><span>Hands</span><span>Cost</span><span>Load</span>
			${this.renderDescription()}</div>
			${repeat(this.equipment,(item,index) => html`<implement-view actionenabled=${this.actionenabled} @click=${this.onClick} descriptiondisabled=${this.descriptiondisabled} name=${item.name} 
			id=${item.id} ability=${item.ability} damage=${item.damage} cost=${item.cost}
			description=${item.description} hands=${item.hands} load=${item.load}></implement-view>`)}
			${this.renderLoad()}
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
		 </div>${this.renderButtons()}`;
	}
	
	renderLoad() {
		if(this.calculateload === 'true') {
			return html`<div class='tr footer'><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span>Total:</span><span class='right'>${this.load}</span></div>`;
		}
		return null;
	}
	
	render() {
		return html`<style>
			.right {
				text-align: right;
			}
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.footer { 
				border-top: 1px double black;
				background-color: var(--theme-bg);
				color: var(--theme-fg);
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
			<span part='equipmenttitle'>Weapons</span>
			<div part='tableheader' class='tr'>${this.renderAction()}<span>Name</span><span>Ability</span><span>Damage</span><span>Hands</span>
			<span>Range</span><span>Category</span><span>Type</span><span>Tags</span><span>Cost</span><span>Load</span>${this.renderDescription()}</div>
			${repeat(this.equipment,(item,index) => html`<weapon-view  actionenabled=${this.actionenabled} descriptiondisabled=${this.descriptiondisabled} @click=${this.onClick} name=${item.name} id=${item.id} 
			ability=${item.ability} damage=${item.damage} load=${item.load} cost=${item.cost}
			description=${item.description} hands=${item.hands} range=${item.range} category=${item.category} type=${item.weapontype} tags=${item.tags}></weapon-view>`)}
			${this.renderLoad()}
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
		 </div>${this.renderButtons()}`;
	}
	
	listAbilities(item) {
		return `DEX: ${item.DEX}, CON: ${item.CON}`;
	}
	
	renderLoad() {
		if(this.calculateload === 'true') {
			return html`<div class='tr footer'><span></span><span></span><span></span><span></span><span>Total:</span><span class='right'>${this.load}</span></div>`;
		}
		return null;
	}
	
	render() {
		return html`<style>
			.right {
				text-align: right;
			}
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.footer { 
				border-top: 1px double black;
				background-color: var(--theme-bg);
				color: var(--theme-fg);
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
			<span part='equipmenttitle'>Armor</span>
			<div part='tableheader' class='tr'>${this.renderAction()}<span>Type</span><span>DR</span>
			<span>DEX</span><span>CON</span><span>Cost</span><span>Load</span>${this.renderDescription()}</div>
			${repeat(this.equipment,(item,index) => html`<armor-view actionenabled=${this.actionenabled} descriptiondisabled=${this.descriptiondisabled} @click=${this.onClick} name=${item.name} id=${item.id} dr=${item.dr} dex=${item.DEX} con=${item.CON} 
			cost=${item.cost} load=${item.load} description=${item.description}></armor-view>`)}
			${this.renderLoad()}
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
		 </div>${this.renderButtons()}`;
	}
	
	renderLoad() {
		if(this.calculateload === 'true') {
			return html`<div class='tr footer'><span></span><span>Total:</span><span class='right'>${this.load}</span></div>`;
		}
		return null;
	}

	render() {
		return html`<style>
			.right {
				text-align: right;
			}
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.footer { 
				border-top: 1px double black;
				background-color: var(--theme-bg);
				color: var(--theme-fg);
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
			<span part='equipmenttitle'>Gear &amp; Goods</span>
			<div part='tableheader' class='tr'>${this.renderAction()}<span>Name</span><span>Cost</span><span>Load</span>${this.renderDescription()}</div>
			${repeat(this.equipment,(item,index) => html`<gear-view actionenabled=${this.actionenabled} descriptiondisabled=${this.descriptiondisabled} @click=${this.onClick} name=${item.name} id=${item.id} cost=${item.cost} load=${item.load}
			description=${item.description}></gear-view>`)}
			${this.renderLoad()}
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
		 </div>${this.renderButtons()}`;
	}
	
	renderLoad() {
		if(this.calculateload === 'true') {
			return html`<div class='tr footer'><span></span><span></span><span>Total:</span><span class='right'>${this.load}</span></div>`;
		}
		return null;
	}

	render() {
		return html`<style>
			.right {
				text-align: right;
			}
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.footer { 
				border-top: 1px double black;
				background-color: var(--theme-bg);
				color: var(--theme-fg);
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
			<span part='equipmenttitle'>Tools</span>
			<div part='tableheader' class='tr'>${this.renderAction()}<span>Name</span><span>Ability</span><span>Cost</span><span>Load</span>${this.renderDescription()}</div>
			${repeat(this.equipment,(item,index) => html`<tool-view actionenabled=${this.actionenabled} descriptiondisabled=${this.descriptiondisabled} @click=${this.onClick} name=${item.name} ability=${item.ability} id=${item.id} cost=${item.cost} load=${item.load}
			description=${item.description}></tool-view>`)}
			${this.renderLoad()}
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
		name: {},
		load: {},
		cost: {},
		descriptiondisabled: {},
		actionenabled: {}
	};
	
	constructor() {
		super();
		this.descriptiondisabled = 'false';
		this.actionenabled = 'false';
		this.selectionenabled = 'false';
	}
	
	renderDescription() {
		if(this.descriptiondisabled === 'false') {
			return html`<span>${this.description}</span>`;
		}
		return null;
	}
	
	takeAction(e) {
		e.cancelBubble = true;
		this.dispatchEvent(new CustomEvent('equipmentaction',{bubbles: true, composed: true, detail: {equipment: this.id}}));
	}
	
	renderAction() {
		if(this.actionenabled !== 'false') {
			return html`<span><button @click=${this.takeAction}>${this.actionenabled}</button></span>`;
		}
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
			.right {
				text-align: right;
			}
		</style>
		${this.renderAction()}
		<span>${this.name}</span>
		<span class='centered'>${this.ability}</span>
		<span class='centered'>${this.damage}</span>
		<span class='centered'>${this.hands}</span>
		<span>${this.cost}</span>
		<span class='right'>${this.load}</span>
		${this.renderDescription()}`;
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
		tags: {},
		load: {},
		cost: {},
		descriptiondisabled: {},
		actionenabled: {}
	};
	
	constructor() {
		super();
		this.descriptiondisabled = 'false';
		this.actionenabled = 'false';
	}
	
	renderDescription() {
		if(this.descriptiondisabled === 'false') {
			return html`<span>${this.description}</span>`;
		}
		return null;
	}
	
	takeAction(e) {
		e.cancelBubble = true;
		this.dispatchEvent(new CustomEvent('equipmentaction',{bubbles: true, composed: true, detail: {equipment: this.id}}));
	}
	
	renderAction() {
		if(this.actionenabled !== 'false') {
			return html`<span><button @click=${this.takeAction}>${this.actionenabled}</button></span>`;
		}
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
			.right {
				text-align: right;
			}
		</style>
		${this.renderAction()}
		<span>${this.name}</span><span class='centered'>${this.ability}</span><span class='centered'>${this.damage}</span><span class='centered'>${this.hands}</span>
		<span class='centered'>${this.range}</span><span class='centered'>${this.category}</span><span class='centered'>${this.type}</span>
		<span class='centered'>${this.tags}</span><span>${this.cost}</span><span class='right'>${this.load}</span>${this.renderDescription()}`;
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
		descriptiondisabled: {},
		actionenabled: {}
	};
	
	constructor() {
		super();
		this.discriptiondiabled = 'false';
		this.actionenabled = 'false';
	}
	
	renderDescription() {
		if(this.descriptiondisabled === 'false') {
			return html`<span>${this.description}</span>`;
		}
		return null;
	}

	takeAction(e) {
		e.cancelBubble = true;
		this.dispatchEvent(new CustomEvent('equipmentaction',{bubbles: true, composed: true, detail: {equipment: this.id}}));
	}
	
	renderAction() {
		if(this.actionenabled !== 'false') {
			return html`<span><button @click=${this.takeAction}>${this.actionenabled}</button></span>`;
		}
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
			.right {
				text-align: right;
			}
		</style>
		${this.renderAction()}
		<span>${this.name}</span><span class='centered'>${this.dr}</span><span class='centered'>${this.dex}</span>
		<span class='centered'>${this.con}</span><span class='centered'>${this.cost}</span><span class='right'>${this.load}</span>${this.renderDescription()}`;
	}
}

window.customElements.define('armor-view',ArmorView);

class GearView extends LitElement {
	static properties = {
		id: {},
		description: {},
		name: {},
		cost: {},
		load: {},
		descriptiondisabled: {},
		actionenabled: {}
	};
	
	constructor() {
		super();
		this.discriptiondiabled = 'false';
		this.actionenabled = 'false';
	}
	
	renderDescription() {
		if(this.descriptiondisabled === 'false') {
			return html`<span>${this.description}</span>`;
		}
		return null;
	}

	takeAction(e) {
		e.cancelBubble = true;
		this.dispatchEvent(new CustomEvent('equipmentaction',{bubbles: true, composed: true, detail: {equipment: this.id}}));
	}
	
	renderAction() {
		if(this.actionenabled !== 'false') {
			return html`<span><button @click=${this.takeAction}>${this.actionenabled}</button></span>`;
		}
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
			.right {
				text-align: right;
			}
		</style>
		${this.renderAction()}
		<span>${this.name}</span><span class='centered'>${this.cost}</span><span class='right'>${this.load}</span>${this.renderDescription()}`;
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
		ability: {},
		descriptiondisabled: {},
		actionenabled: {}
	};
	
	constructor() {
		super();
		this.discriptiondiabled = 'false';
		this.actionenabled = 'false';
	}
	
	renderDescription() {
		if(this.descriptiondisabled === 'false') {
			return html`<span>${this.description}</span>`;
		}
		return null;
	}

	takeAction(e) {
		e.cancelBubble = true;
		this.dispatchEvent(new CustomEvent('equipmentaction',{bubbles: true, composed: true, detail: {equipment: this.id}}));
	}
	
	renderAction() {
		if(this.actionenabled !== 'false') {
			return html`<span><button @click=${this.takeAction}>${this.actionenabled}</button></span>`;
		}
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
			.right {
				text-align: right;
			}
		</style>
		${this.renderAction()}
		<span>${this.name}</span><span class='centered'>${this.ability}</span><span class='centered'>${this.cost}</span><span class='right'>${this.load}</span>${this.renderDescription()}`;
	}
}

window.customElements.define('tool-view',ToolView);
