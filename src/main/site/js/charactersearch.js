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
import { html, LitElement, ref, createRef, repeat } from 'lit3';
import {schema, getReference} from './schema.js';
import {EntityId} from './baserepository.js';

class CharacterSearch extends LitElement {
	static properties = {
		displayId: {},
		_callings: {state:true, attribute: false},
		_species: {state:true, attribute: false},
		_origins: {state:true, attribute: false}
	}
	
	constructor() {
		super();
		this.nameRef = createRef();
		this.callingRef = createRef();
		this.speciesRef = createRef();
		this.originsRef = createRef();
		this._callings = {any: ''};
		this._species = {any: ''};
		this._origins = {any: ''};
		this._getChoices();
	}
	
	
	_callingsListener = (calling) => {
		this._callings[calling.name] = calling.id;
	}

	_speciesListener = (species) => {
		this._species[species.name] = species.id;
	}
	
	_originsListener = (origin) => {
		this._origins[origin.name] = origin.id;
	}
	
	_getChoices() {
		window.gebApp.controller.getAllCallings(this._callingsListener).then((callings) => {
			const nc = {any: ''};
			callings.forEach((calling) => nc[calling.name] = calling.id);
			this._callings = nc;
		});
		window.gebApp.controller.getAllSpecies(this._speciesListener).then((species) => {
			const nc = {any: ''};
			species.forEach((specie) => nc[specie.name] = specie.id);
			this._species = nc;
		});
		window.gebApp.controller.getAllOrigins(this._originsListener).then((origins) => {
			const nc = {any: ''};
			origins.forEach((origin) => nc[origin.name] = origin.id);
			this._origins = nc;
		});
	}
	
	_prepareSearchCriteria() {
		const criteria = [];
		const name = this.nameRef.value.value;
		const calling = this.callingRef.value.value;
		const species = this.speciesRef.value.value;
		const origin = this.originsRef.value.value;
		if(name !== '') {
			criteria.push({fieldName: 'name', fieldValue: name, op: '=='});
		}
		if(calling !== '') {
			criteria.push({fieldName: 'calling.callingref', fieldValue: EntityId.EntityIdFromString(calling).getReference(), op: '=='});
		}
		if(species !== '') {
			criteria.push({fieldName: 'species.speciesref', fieldValue: EntityId.EntityIdFromString(species).getReference(), op: '=='})
		}
		if(origin !== '') {
			criteria.push({fieldName: 'origin.originref', fieldValue: EntityId.EntityIdFromString(origin).getReference(), op: '=='})
		}
		return criteria;
	}
	
	onChange(e) {
		const viewer = this.parentElement.querySelector('#'+this.displayId);
//		window.gebApp.controller.registerCharactersListener(viewer.getRenderFn());
		const criteria = this._prepareSearchCriteria();
		window.gebApp.controller.doCharacterCriteriaSearch(criteria).then((characters) => viewer.getRenderFn()(characters));
	}

	renderCallings() {
		return html`<span><label for='calling'>Calling</label><select ${ref(this.callingRef)} id='calling' @change=${this.onChange}>
			${repeat(Object.keys(this._callings),(item) => html`<option value=${this._callings[item]}>${item}</option>`)}
		</select>`;
	}

	renderSpecies() {
		return html`<span><label for='species'>Species</label><select ${ref(this.speciesRef)} id='species' @change=${this.onChange}>
			${repeat(Object.keys(this._species),(item) => html`<option  value=${this._species[item]}>${item}</option>`)}
		</select>`;
	}
	
	renderOrigins() {
		return html`<span><label for='origins'>Origins</label><select ${ref(this.originsRef)} id='origins' @change=${this.onChange}>
			${repeat(Object.keys(this._origins),(item) => html`<option  value=${this._origins[item]}>${item}</option>`)}
		</select>`;
	}
	render() {
		return html`<div class='charactersearch' part='container'>
				<span><label for='name'>Name</label>
				<input ${ref(this.nameRef)} type='text' id='name' @change=${this.onChange}/></span>
				${this.renderCallings()}
				${this.renderSpecies()}
				${this.renderOrigins()}
			</div>`
	}
}

window.customElements.define('character-search',CharacterSearch);