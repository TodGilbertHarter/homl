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
import { BaseRepository } from './baserepository.js';
import { schema, getReference } from './schema.js';
import { LitElement, html } from 'lit2'; 
import {repeat} from 'lit2/repeat';
import {ref, createRef} from 'lit2/ref';

/**
 * Everything related to macros goes in this module.
 */

// Convert a macroset to a plain object for firestore
export const macroConverter = {
	toFirestore(macroset) {
		const data = {
			ownerId: macroset.ownerId,
			description: macroset.description,
			name: macroset.name,
			macros: [],
			version: 1.0
		}
		
		macroset.macros.forEach((macro) => {
			const md = {
				description: macro.description,
				name: macro.name,
				source: macro.source
			}
			data.macros.push(md);
		});
		return data;
	},
	
	fromFirestore(ownerid,data) {
		if(data) {
			const macros = [];
			const ms = new MacroSet(ownerid,macros,data.name,data.description);
			data.macros.forEach((macro) => {
				const nm = new Macro(macro.description,macro.name,macro.source);
				ms.addMacro(nm);
			});
			return ms;
		}
		return new MacroSet(ownerid,[],'new macro set','player macro set');
	}
}

/**
 * Macro entity class. This can be stored and effectively implements
 * the API of a Hairballjs Definition object, allowing macros to be
 * stored in vocabularies and referenced as Hairball words themselves.
 */
export class Macro {
	 description;
	 name;
	 source;
	 definition;
	 
	 constructor(description,name,source) {
		 this.description = description;
		 this.name = name;
		 this.source = source;
		 this.definition = null;
	 }
}


export class MacroSet {
	ownerId;
	macros;
	name;
	description;
	
	constructor(ownerId,macros,name,description) {
		this.ownerId = ownerId;
		this.macros = macros;
		this.name = name;
		this.description = description;
	}
	
	addMacro(macro) {
		this.macros.push(macro);
	}
	
	removeMacro(index) {
		this.macros.splice(index,1);
	}
	
	getMacro(index) {
		return this.macros[index];
	}
	
	updateMacro(index,macro) {
		this.macros[index] = macro;
	}
}

/**
 * Display a macro and allow edit and debug.
 */

class MacroConsole extends LitElement {
	static properties = {
		enabled: {},
		_macro: {state:true},
	};
	
	constructor() {
		super();
		this.nameRef = createRef();
		this.descriptionRef = createRef();
		this.sourceRef = createRef();
		this.enabled = 'false';
		this._macro = new Macro();
	}
	
	firstUpdated() {
		this.nameRef.value.disabled = true;
	}
	
	setMacro(macro) {
		this._macro = macro;
		this.enable();
	}
	
	disable() {
		this.nameRef.value.disabled = true;
		this.descriptionRef.value.setAttribute('enabled','false');
		this.sourceRef.value.setAttribute('enabled','false');
	}

	enable() {
		this.nameRef.value.disabled = false;
		this.descriptionRef.value.setAttribute('enabled','true');
		this.sourceRef.value.setAttribute('enabled','true');
	}

	onInput() {
		this._macro.name = this.nameRef.value.value;
		this._macro.description = this.descriptionRef.value.value;
		this._macro.source = this.sourceRef.value.value;
	}
	
	render() {
		return html`<div class='macroConsole'>
			<h2>Edit Macro</h2>
			<label for='macroname'>Macro Name:</label><input id='macroname' type='text' value=${this._macro.name} ${ref(this.nameRef)} @input=${this.onInput}></input>
			<h3>Description</h3>
			<big-input value=${this._macro.description} enabled=${this.enabled} ${ref(this.descriptionRef)} @input=${this.onInput}></big-input>
			<h3>Source</h3>
			<big-input value=${this._macro.source} enabled=${this.enabled} ${ref(this.sourceRef)} @input=${this.onInput}></big-input>
		</div>`;
	}
}
window.customElements.define('macro-console',MacroConsole);

class MacroSetManager extends LitElement {
	static properties = {
		_macroset: {state:true}
	};
	
	constructor() {
		super();
		this.editing = -1;
		this.editEnabled = 'false';
		this.macroConsoleRef = createRef();
		this.macrosetNameRef = createRef();
		this.macrosetDescriptionRef = createRef();
		this._macroset = new MacroSet(
			0,
			[],
			'player macros',
			'player macros');
	}

	setMacroSet(macroset) {
		this._macroset = macroset;
	}
	
	addMacroClicked() {
		const macro = new Macro(
			'brand new macro',
			'new',
			'//');
		this.addMacro(macro);
	}
	
	addMacro(macro) {
		this._macroset.addMacro(macro);
		this.requestUpdate();
	}
	
	deleteMacroClicked(e) {
		const index = e.target.dataset.index;
		this.deleteMacro(index);
	}
	
	editMacroClicked(e) {
		const index = e.target.dataset.index;
		this.editMacro(index);
	}
	
	editMacro(index) {
		const macro = this._macroset.getMacro(index);
		this.editing = index;
		this.macroConsoleRef.value.setMacro(macro);
		this.editEnabled = 'true';
	}
	
	deleteMacro(index) {
		this._macroset.removeMacro(index);
		if(this.editing === index) {
			this.editing = -1;
			this.editEnabled = 'false';
			this.macroConsoleRef.value.disable();
		}
		this.requestUpdate();
	}
	
	onInput() {
		this._macroset.name = this.macrosetNameRef.value.value;
		this._macroset.description = this.macrosetDescriptionRef.value.value;
	}
	
	render() {
		return html`<div class='macroSetMgr'>
			<h1>Player Macros</h1>
			<label for='macrosetname'>Macro Set Name:</label>
			<input type='text' id='macrosetname' value=${this._macroset.name} @input=${this.onInput} ${ref(this.macrosetNameRef)}></input>
			<h2>Description</h2>
			<big-input value=${this._macroset.description} @input=${this.onInput} ${ref(this.macrosetDescriptionRef)}></big-input>
			<table>
				<caption>Macros</caption>
				<thead>
					<tr><th>Macro Name</th><th>Description</th><th>Edit</th><th>Delete</th></tr>
				</thead>
				<tbody>
					${repeat(this._macroset.macros,(item,index) => html`<tr>
						<td>${item.name}</td>
						<td>${item.description}</td>
						<td><button data-index=${index} @click=${this.editMacroClicked}>Edit</button></td>
						<td><button data-index=${index} @click=${this.deleteMacroClicked}>X</button></td>
					</tr>`)}
				</tbody>
			</table>
			<button @click=${this.addMacroClicked}>Add Macro</button>
			<macro-console ${ref(this.macroConsoleRef)} enabled=${this.editEnabled}></macro-console>
		</div>`;
	}
}

window.customElements.define('macroset-manager',MacroSetManager);