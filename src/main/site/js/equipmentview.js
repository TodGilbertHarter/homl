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

/**
 * Class to view all the equipment in the game and allow editing.
 */
class EquipmentView extends LitElement {
	
	constructor() {
		super();
		this.equipmentRepo = window.gebApp.equipmentRepo;
		this.equipment = [];
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
		this.equipment = equipment; this.requestUpdate();
	}
	
	render() {
		return html`<div>
			${repeat(this.equipment,(item,index) => html`${item.name}<br>`)}
		</div>`
	}
}

window.customElements.define('equipment-view',EquipmentView);

class EquipmentList extends LitElement {
	
	
}

window.customElements.define('equipment-list',EquipmentList);

class ImplementList extends LitElement {
	
}
