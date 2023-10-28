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
import { Rules } from './rules.js';
import { Background } from './background.js';
import { Character } from './character.js';
import { GetPlayerReference } from './playerrepository.js'
import {ref, createRef} from 'https://unpkg.com/lit@2/directives/ref.js?module';
import {repeat} from 'https://unpkg.com/lit@2/directives/repeat.js?module';

/** @private */ const CharacterSheettemplate = document.getElementById('charactersheettemplate');

class CharacterSheet extends HTMLElement {
	/** @private */static template = CharacterSheettemplate;
	model;
	rules;
	species;
	callings;
	origins;
	backgrounds;
	controller;
	_dirty;
	_refreshed;
	/** @type {string} @private */ characterId;
	
	constructor() {
		super();
		const content = CharacterSheet.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
        this.controller = window.gebApp.characterController;
        this._dirty = false;
        this._refreshed = true;
 	}

	connectedCallback() {
		this.characterId = this.getAttribute('characterid');
		const savebutton = this.shadowRoot.getElementById('savebutton');
		const refreshbutton = this.shadowRoot.getElementById('refreshbutton');
		const copybutton = this.shadowRoot.getElementById('copybutton');
		const sbh = this.saveButtonHandler.bind(this);
		savebutton.addEventListener('click',sbh);
		const rbh = this.refreshButtonHandler.bind(this);
		refreshbutton.addEventListener('click',rbh);
		const cbh = this.copyButtonHandler.bind(this);
		copybutton.addEventListener('click',cbh);
		this.shadowRoot.getElementById('characterview').addEventListener('change',this.onChange.bind(this));
		this.dirty = false;
		this.refreshed = true;
	}

	get dirty() {
		return this._dirty;
	}
	
	get refreshed() {
		return this._refreshed;
	}
	
	set dirty(dirty) {
		this.shadowRoot.getElementById('savebutton').disabled = !dirty;
		this._dirty = dirty;
	}
	
	set refreshed(refreshed) {
		this.shadowRoot.getElementById('refreshbutton').disabled = refreshed;
		this._refreshed = refreshed;
	}
	
	onChange() {
		this.dirty = true;
		this.refreshed = false;
	}
	
	setSelections(species, callings,backgrounds,origins) {
		this.species = species;
		this.callings = callings;
		this.backgrounds = backgrounds;
		this.origins = origins;
		const callingSelector = this.shadowRoot.getElementById('charactercalling');
		callingSelector.setSelections(this.callings);
		const speciesSelector = this.shadowRoot.getElementById('characterspecies');
		speciesSelector.setSelections(this.species);
		const originSelector = this.shadowRoot.getElementById('characterorigin');
		originSelector.setSelections(this.origins);
		const fateSelector = this.shadowRoot.getElementById('characterfate');
		fateSelector.setSelections([
			{ id: 'positive', name: 'postive'},
			{ id: 'neutral', name: 'neutral'}
		]);
		const wealthSelector = this.shadowRoot.getElementById('characterwealth');
		wealthSelector.setSelections([
			{ id: '-1', name: 'Destitute'},
			{ id: '0', name: 'Poor'},
			{ id: '1', name: 'Ordinary'},
			{ id: '2', name: 'Adequate'},
			{ id: '3', name: 'Well Off'},
			{ id: '4', name: 'Rich'},
			{ id: '5', name: 'Vast Wealth'},
			{ id: '6', name: 'Infinite Wealth'}
		]);
		this.setPersonalityList();
		this.setBackgroundList();
		this.setProficiencyList();
	}
	
	/**
	 * This sets up the characterproficiencies list component of the sheet with the correct
	 * handlers to allow management of proficiency elements.
	 */
	setProficiencyList() {
		const proficiencyList = this.shadowRoot.getElementById('characterproficiencies');
		proficiencyList.innerHTML = '';
		proficiencyList.newButtonHandler = (e) => {
			const nitem = '<proficiency-field></proficiency-field>';
			proficiencyList.addItem(nitem);
		};
	}
	
	/**
	 * This sets up the characterpersonality list component of the sheet with the correct
	 * handlers to allow management of personality elements.
	 */
	setPersonalityList() {
		const personalityList = this.shadowRoot.getElementById('characterpersonality');
		personalityList.innerHTML = '';
		personalityList.newButtonHandler = (e) => {
			const nitem = '<personality-field name="trait name" value="new description"></personality-field>';
			personalityList.addItem(nitem);
		};
	}

	/**
	 * This sets up the characterbackground list component of the sheet with the correct
	 * handlers to allow management of backgrounds.
	 */
	setBackgroundList() {
		const backgroundList = this.shadowRoot.getElementById('characterbackground');
		backgroundList.innerHTML = '';
		backgroundList.newButtonHandler = (e) => {
			const currentDialog = e.target.ownerDocument.createElement('dialog-widget');
			const cancelHandler = (e) => { 
				console.log('clicked cancel');
				e.cancelBubble = true;
				currentDialog.dismiss();
			};
			const addHandler = (e) => {
				console.log('clicked add');
				e.cancelBubble = true;
				const type = currentDialog.querySelector('#backgrounddialogtype').value;
				const name = currentDialog.querySelector('#backgrounddialogname').value;
				const text = currentDialog.querySelector('#backgrounddialogtext').value;
//				const bgTemplate = html`<background-field type='${type}' name='${name}'>${text}</background-field>`;
//				render(bgTemplate,backgroundList);
				const bgItem = new BackgroundField();
				backgroundList.addItem(bgItem);
				bgItem.type = type;
				bgItem.name = name;
				bgItem.innerHTML = text;
				currentDialog.dismiss();
			};
			const types = Object.keys(this.backgrounds);
			var names = Object.keys(this.backgrounds[types[0]]);
			const bg = new Background(null,types[0],names[0],'fix me',null,null);
			const onTypeChange = (e) => {
				var v = e.target.value;
				bg.type = v;
				names = Object.keys(this.backgrounds[v]);
				bg.name = names[0];
				render(template(bg),currentDialog);
				// workaround for bug
				var p = e.target.parentElement;
				var q = p.querySelector('#backgrounddialogname');
				q.value = bg.name;
			}
			const onNameChange = (e) => {
				var v = e.target.value;
				bg.name = v;
				render(template(bg),currentDialog);
			}
			const onTextChange = (e) => {
				var v = e.target.value;
				bg.text = v;
//				render(template(bg),currentDialog);
			}
			const template = (myBg) => html`<div slot='content' style='width: 350px;'>
				<h1 class='dialogtitle'>Add New Background</h1>
      			<div style='clear: both;'>
	      			<label>type</label><select id='backgrounddialogtype' @change=${onTypeChange}>
	      				${types.map((type) => html`<option ?selected=${bg.type === type}>${type}</option>`)}
	      			</select>
	      			<input type='text' id='backgrounddialogtypetext' value=${myBg.type}/><br>
	      			<label>name</label>
	      			<select id='backgrounddialogname' @change=${onNameChange}>
	      				${names.map((name) => html`<option ?selected=${bg.name === name}>${name}</option>`)}
	      			</select>
	      			<input type='text' id='backgrounddialogname' value=${myBg.name}/><br>
	      			<label>text</label><input type='text' id='backgrounddialogtext' value=${myBg.text} @change=${onTextChange}/>
      			</div>
			</div>
			<div slot='buttonbar'>
				<button type='button' class='dialogbutton' id='add' @click=${addHandler}>Add</button>
				<button type='button' class='dialogbutton' id='cancel' @click=${cancelHandler}>cancel</button>
			</div>`;
			render(template(bg),currentDialog);
			document.getElementsByTagName('body')[0].appendChild(currentDialog);
		};
	}
	
	/* get the values for personality */
	getPersonalityList() {
		const id = 'characterpersonality';
		const elem = this.getElement(id);
		const list = [];
		for(const item of elem.children) {
			list.push({ name: item.name, value: item.value });
		}
		return list;
	}
	
	/* get the values for background */
	getBackgroundList() {
		const id = 'characterbackground';
		const elem = this.getElement(id);
		const list = [];
		for(const item of elem.children) {
			list.push({
				name: item.name,
				type: item.attributes[0].value,
				description: item.innerHTML
			});
		}
		return list;
	}
	
	/* get the values for proficiencies */
	getProficiencyList() {
		const id = 'characterproficiencies';
		const elem = this.getElement(id);
		const list = [];
		for(const item of elem.children) {
			list.push({
				type: item.type,
				equipmentId: item.eid,
				name: item.name
			});
		}
		return list;
	}
	
	disconnectedCallback() {
		
	}
	
	saveButtonHandler(e) {
		this.controller.saveCharacter(this,this.model);
	}
	
	refreshButtonHandler(e) {
		this.controller.refreshCharacter(this,this.model);
	}
	
	copyButtonHandler(e) {
		this.controller.copyCharacter(this);
	}
	
	getElement(id) {
		return this.shadowRoot.getElementById(id);
	}
	
	/**
	 * Get data from a field with the given id. This just simplifies moving data around.
	 *
	 * @param {string} elementId the id of the field to get.
	 * @returns {string} the value of the field.
	 */
    getCharacterData(elementId) {
        return this.shadowRoot.getElementById(elementId).value;
    }
    
    /**
     * Set the value of one of the fields of the character sheet.
     *
     * @param {string} elementId field to set
     * @param {string} value new value for the field.
     */
    setCharacterData(elementId,value) {
        this.shadowRoot.getElementById(elementId).value = value;
    }
    
    setCharacterListItems(elementId,items) {
		const listElement = this.shadowRoot.getElementById(elementId);
		listElement.innerHTML = '';
		items.forEach((item) => {
			listElement.addItem(item, () => {});
		});
	}
}

window.customElements.define('character-sheet',CharacterSheet);

class BoonSelector extends LitElement {
	static properties = {
		label: {}
	}

	constructor() {
		super();
	}
	
	render() {
		return html`<span class='boxlabel' part='label'>${this.label}</span><button @click=${this.addClicked}>Add</button>`;
	}
	
	changed() {
		this.dispatchEvent(new Event('changed',{bubbles: true}));
	}
	
	addClicked() {
		const dialog = document.createElement('dialog-widget');
		dialog.setAttribute('closewidget',true);
		dialog.setAttribute('class','boonselector');
		dialog.setAttribute('maxheight','600px');
		dialog.setAttribute('maxwidth','1000px');
		const template = html`<div slot='content'><boon-viewer></boon-viewer></div></dialog-widget>`;
		render(template,dialog);
		document.getElementsByTagName('body')[0].appendChild(dialog);
	}
}

window.customElements.define('boon-selector',BoonSelector);

class BackgroundField extends LitElement {
	static properties = {
		type: {reflect: true},
		name: {reflect: true},
		text: {reflect: true}
	};

	/** @private */ bgValues;
	deleteButtonHandler;
	
	constructor() {
		super();
		this.bgValues = [];
	}
	
	render() {
		return html`
		<style>
			.attribute { display: flex; flex-wrap: wrap; flex-direction: row; }
		</style>
		<div class="attribute">
			<div style='flex-grow: 0'><span style='padding-left: 4px; padding-right: 4px'>${this.type}</span></div>
			<div style='flex-grow: 0'><span style='padding-left: 4px; padding-right: 4px'>${this.name}</span></div>
			<div style='flex-grow: 10' id="textplace"><span style='padding-left: 4px'>${this.text}</span></div>
			<div style='flex-grow: 0'><button type="button">Edit</button></div>
			<div style='flex-grow: 0'><button part="delete" name="delete" id='delete' @click="${this.deleteButtonHandler}">x</button></div>
		</div>`;
	}
	
	firstUpdated() {
		const text = this.innerHTML;
		const textplace = this.shadowRoot.getElementById('textplace');
		textplace.innerHTML = text;
	}
	
	set backgroundType(bgtype) {
		this.type = bgtype;
	}
	
	set backgroundValues(values) {
		this.bgValues = values;
		const selector = this.shadowRoot.getElementById('valueselect');
		var valueText = '';
		values.forEach((value) => {
			valueText = valueText + `<option>${value}</option>`;
		});
		selector.innerHTML = valueText;
	}
	
	get backgroundValues() {
		return this.bgValues;
	}
	
	get backgroundType() {
		return this.type;
	}
}

window.customElements.define('background-field',BackgroundField);

class PersonalityField extends LitElement {
	static properties = {
		name: { reflect: true},
		value: { reflect: true}
	};
	
	deleteButtonHandler;
	
	constructor() {
		super();
		this.nameis = createRef();
		this.valueis = createRef();
	}
	
	onChange(e) {
		this.name = this.nameis.value.value;
		this.value = this.valueis.value.value;
		this.dispatchEvent(new Event('change',{bubbles: true}));
	}
	
	render() {
		return html`<div class="attribute">
			<input part="name" class="name" id="name" value="${this.name}" ${ref(this.nameis)} @change=${this.onChange}>
			<input part="value" class='value' value="${this.value}" id='value' ${ref(this.valueis)} @change=${this.onChange}>
			<button part="delete" name="delete" id='delete' @click="${this.deleteButtonHandler}">x</button>
		</div>`;
	}

}

window.customElements.define('personality-field',PersonalityField);

class ProficiencyField extends LitElement {
	static properties = {
		type: { reflect: true},
		equipmentId: {reflect: true},
		name: {reflect: true},
		eid: { reflect: true}
	};
	
	deleteButtonHandler;
	
	constructor() {
		super();
		this.typeRef = createRef();
		this.eqidRef = createRef();
	}
	
	onChange() {
		this.type = this.typeRef.value.value;
		const v = this.eqidRef.value.value;
		const x = v.split(':');
//		this.equipmentId = x[1];
		this.name = x[0];
		this.eid = x[1];
		this.dispatchEvent(new Event('change',{bubbles: true}));
	}
	
	setNamesByType(t) {
		window.gebApp.controller.getProficienciesByType(t, (profs) => { 
			const nprofs = [];
			for(var i = 0; i < profs.length; i++) {
				const p = {
					id: profs[i].name + ':' + profs[i].id,
					name: profs[i].name
				};
				nprofs.push(p);
			}
			this.eqidRef.value.setSelections(nprofs)
		});
	}
	
	onTypeChange() {
		this.onChange();
		this.setNamesByType(this.type);
	}
	
	onNameChange() {
		this.onChange();
	}
	
	firstUpdated() {
		var types = [
			{id: 'tool', name: 'tool'},
			{id: 'weapon', name: 'weapon'},
			{id: 'implement', name: 'implement'}
		];
		this.typeRef.value.setSelections(types);
		if(this.type !== undefined) {
			this.setNamesByType(this.type);
			this.eqidRef.value.value = this.name + ":" + this.equipmentId;
			this.eid = this.equipmentId;
		}
	}
	
	render() {
		return html`<div class='attribute'>
		<select-field label='type' name='type' @change=${this.onTypeChange} ${ref(this.typeRef)} value=${this.type}>
		</select-field>
		<select-field label='name' name='name' @change=${this.onNameChange} ${ref(this.eqidRef)} value=${this.equipmentId}>
		</select-field>
		<button @click=${this.deleteButtonHandler}>X</button>
		</div>`;
	}
}

window.customElements.define('proficiency-field',ProficiencyField);

class ItemList extends LitElement {
	static properties = {
		label: {},
		newButtonHandler: {}
	};
//	newButtonHandler = () => alert('no handler installed');
	items;
	itemSlot;
	
	constructor() {
		super();
	}
	
	onChange() {
		this.dispatchEvent('change',{bubbles: true});
	}
	
	firstUpdated() {
		const container = this.shadowRoot.getElementById('content');
		const slot = container.firstChild;
		slot.addEventListener('slotchange', (e) => {
			this.itemSlot = e.target;
			this.items = this.itemSlot.assignedElements();
		});
	}
	
	render() {
		return html`<div>
			<span class="boxlabel">${this.label}</span>
			<div id='content'><slot></slot></div>
			<div><button name='new' id='newbutton' @click="${this.newButtonHandler}">New</button></div>
		</div>`;
	}
	
	addItem(item,inserted) {
		var realItem;
		if(typeof item === 'string' || item instanceof String) {
			this.insertAdjacentHTML('beforeend',item);
			realItem = this.lastElementChild;
		} else {
			this.insertAdjacentElement('beforeend',item);
			realItem = item;
		}
		realItem.deleteButtonHandler = (e) => {
			this.removeItem(realItem);
			this.dispatchEvent(new Event('change',{bubbles: true}));
		};
		if(this.items !== undefined) {
			this.items.push(realItem);
		}
		if(inserted !== undefined) { inserted(this.lastChild); }
	}
	
	removeItem(item,removed) {
		this.removeChild(item);
		this.items = this.itemSlot.assignedElements();
		if(removed !== undefined) { removed(item); }
	}
}

window.customElements.define('item-list',ItemList);

/*
Sheetfield implements a web component which will bind to a field in a character object. This allows us to map a character
into a character sheet, and do two-way updates.
*/

class SheetField extends HTMLElement {
    constructor(template) {
        super();
        const content = template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
    }
    
    set value(value) {
        this.shadowRoot.getElementById('input').value = value;
    }
    
    get value() {
        return this.shadowRoot.getElementById('input').value;
    }
}

const template_AttributeField = document.createElement('template');
template_AttributeField.innerHTML = `<label id='label' part='label'></label><input id='input' type='text'>`;

class AttributeField extends SheetField {
    constructor() {
        super(template_AttributeField);
    }
    
    connectedCallback() {
        const value = this.getAttribute('value');
        const n = this.getAttribute('name');
        const style = this.getAttribute('style');
        const input = this.shadowRoot.getElementById('input');
        input.setAttribute('style',style);
        input.setAttribute('value',value);
        input.setAttribute('name',n);
        input.addEventListener('change',this.onChange.bind(this));
        const ltext = this.getAttribute('label');
        const label = this.shadowRoot.getElementById('label');
        label.innerHTML = ltext;
        this.parentNode.addEventListener('change',() => { console.log("got event at parent of attribute field.")});
        this.parentNode.parentNode.addEventListener('change',() => { console.log("got event at grandparent")});
        this.parentNode.parentNode.parentNode.addEventListener('change',() => { console.log("got event at great grandparent")});
        this.parentNode.parentNode.parentNode.parentNode.addEventListener('change',() => { console.log("got event at great great grandparent")});
    }
    
    onChange(e) {
		const event = new Event('change',{ value: e.target.value, bubbles: true});
		this.dispatchEvent(event);
	}
}

class SelectField extends LitElement {
	static properties = {
		label: {},
		value: {reflect: true}
	};
	
	onChange() {
		this.value = this.selectRef.value.value;
		this.dispatchEvent(new Event('change', { value: this.value, bubbles: true}));
	}
	
    constructor() {
        super();
        this.selectRef = createRef();
        this._selections = [{id: 'None', name: 'None'}];
    }
    
    render() {
		return html`<label id='label' part='label'>${this.label}</label><select id='input' value=${this.value} ${ref(this.selectRef)} @change=${this.onChange}>
			${repeat(this._selections,(item,index) => html`<option value=${item.id}>${item.name}</option>`)}
		</select></span>`;
	}
    
    updated() {
		this.selectRef.value.value = this.value;
	}
    
    setSelections(options) {
		this._selections = options;
		this.requestUpdate();
	}
}

const template_CalculatedField = document.createElement('template');
template_CalculatedField.innerHTML = `<label id='label' part='label'></label><span part='text' id='input' type='text'>`;

class CalculatedField extends SheetField {
    constructor() {
        super(template_CalculatedField);
    }
    
    connectedCallback() {
        const value = this.getAttribute('value');
        const n = this.getAttribute('name');
        const style = this.getAttribute('style');
        const id = this.getAttribute('id');
        const input = this.shadowRoot.getElementById('input');
        input.setAttribute('style',style);
        input.innerHTML = value;
        const ltext = this.getAttribute('label');
        const label = this.shadowRoot.getElementById('label');
        label.innerHTML = ltext;
    }

    set value(value) {
        const input = this.shadowRoot.getElementById('input').innerText = value;
    }
    
    get value() {
        return this.shadowRoot.getElementById('input').innerText;
    }

}



const template_AbilityField = document.createElement('template');
template_AbilityField.innerHTML = `<div class='abilityfield' part='wrapper'>
<label id='label' part='label' style="display: inline-block;"></label>
<!-- <input id="input" type="text" part='input'> -->
<select id="input" part='input'>
    <option value='0'>Poor</option>
    <option value='1'>Average</option>
    <option value='2'>Above Average</option>
    <option value='3'>Strong</option>
    <option value='4'>Exceptional</option>
    <option value='5'>Mighty</option>
</select>
<span id="modifier" part='modifier'></span>
</div>`;

class AbilityField extends SheetField {
    constructor() {
        super(template_AbilityField);
    }
    
    connectedCallback() {
        const value = this.getAttribute('value');
        const n = this.getAttribute('name');
        const style = this.getAttribute('style');
//        const id = this.getAttribute('id');
        const input = this.shadowRoot.getElementById('input');
//        input.setAttribute('data-bind','value: '+id);
        input.setAttribute('style',style);
        input.setAttribute('value',value);
        input.setAttribute('name',n);
        const ltext = this.getAttribute('label');
        const label = this.shadowRoot.getElementById('label');
        label.innerHTML = ltext;
        const modifier = this.getAttribute('modifier');
        const mspan = this.shadowRoot.getElementById('modifier');
        mspan.innerHTML = modifier;
        input.onchange = this.onChange.bind(this);
    }
    
    set value(value) {
        const input = this.shadowRoot.getElementById('input').value = value;
        this._setModifier(value);
    }
    
    get value() {
        return this.shadowRoot.getElementById('input').value;
    }

    _setModifier(value) {
        const mspan = this.shadowRoot.getElementById('modifier');
        mspan.innerHTML = '+'+value;
    }
    
    onChange() {
        this._setModifier(this.shadowRoot.getElementById('input').value);
        this.dispatchEvent(new Event('change', {value: this.value, bubbles: true}));
    }

    setSelections(options) { /* currently just used by wealth */
        const input = this.shadowRoot.getElementById('input');
        input.innerHTML = '';
		options.forEach((option) => {
			const optElement = document.createElement('option');
			optElement.innerText = option.name;
			optElement.value = option.id;
			input.appendChild(optElement);
		});
	}

}

const template_KnackField = document.createElement('template');
template_KnackField.innerHTML = `<div class='knackfield' part='wrapper'>
<span id='label' part='label'></span>
<span id='abilitybonus' part='abilitybonus'></span>
<input type='checkbox' part='check' id='check'>
<span id='levelbonus' part='levelbonus'></span>
<span id='permanentbonus' part='permanentbonus'></span>
<span id='totalbonus' part='totalbonus'></span>
</div>
`

class KnackField extends SheetField {
    constructor() {
        super(template_KnackField);
    }

    connectedCallback() {
        const value = this.getAttribute('value');
        const ability = this.getAttribute('ability');
        const label = this.getAttribute('label');
        const perm = this.getAttribute('permanent');
        const total = this.getAttribute('total');
        const level = this.getAttribute('level');
        
        this.value = value;
        this.abilitybonus = ability;
        this.shadowRoot.getElementById('label').innerHTML = label;
        this.permanentbonus = perm;
        this.totalbonus = total;
        this.levelbonus = level;
        const check = this.shadowRoot.getElementById('check');
        check.addEventListener('click',this.onChange.bind(this));
    }
    
    onChange() {
		this.dispatchEvent(new Event('change',{value: this.value, bubbles: true}));
	}
	
    set value(value) {
        this.shadowRoot.getElementById('check').checked = value;
    }
    
    get value() {
        return this.shadowRoot.getElementById('check').checked;
    }
    
    set totalbonus(value) {
        this.shadowRoot.getElementById('totalbonus').innerHTML = value;
    }
    
    get totalbonus() {
        return this.shadowRoot.getElementById('totalbonus').innerHTML;
    }

    set abilitybonus(value) {
        this.shadowRoot.getElementById('abilitybonus').innerHTML = value;
    }
    
    get abilitybonus() {
        return this.shadowRoot.getElementById('abilitybonus').innerHTML;
    }

    set permanentbonus(value) {
        this.shadowRoot.getElementById('permanentbonus').innerHTML = value;
    }
    
    get permanentbonus() {
        return this.shadowRoot.getElementById('permanentbonus').innerHTML;
    }
    
    set levelbonus(value) {
        this.shadowRoot.getElementById('levelbonus').innerHTML = value;
    }
    
    get levelbonus() {
        return this.shadowRoot.getElementById('levelbonus').innerHTML;
    }    
}

window.customElements.define('attribute-field',AttributeField);
window.customElements.define('calculated-field',CalculatedField);
window.customElements.define('select-field',SelectField);
window.customElements.define('ability-field',AbilityField);
window.customElements.define('knack-field',KnackField);

/*
CharacterController is the controller, responsible for carrying out all the character sheet logical operations.
*/      
class CharacterController {
   	speciesRepo;
	callingRepo;
	backgroundRepo;
	originRepo;
	characterRepo;

    constructor(speciesRepo,callingRepo,backgroundRepo,originRepo,characterRepo) {
		this.speciesRepo = speciesRepo;
		this.callingRepo = callingRepo;
		this.backgroundRepo = backgroundRepo;
		this.originRepo = originRepo;
		this.characterRepo = characterRepo;
    }

	/**
	 * Create a brand new empty character which can be displayed on a character sheet.
	 * It will be owned by the current player.
	 */
	createCharacter(sheet) {
		const char = new Character(null,null);
		char.owner = GetPlayerReference(window.gebApp.controller.getCurrentPlayer().id);
		this.populateCharacter(sheet,char,() => {});
	}
	
	/**
	 * Update the display of the given knack of the provided character on the
	 * given sheet.
	 *
	 * @param {string} name the name of the knack to display
	 * @param {string} elementId the id of the element on 
	 * the sheet to display the information in.
	 * @param {CharacterSheet} sheet the sheet to display the knack on.
	 * @param {Character} character the character to get the data from.
	 */
    displayKnack(name,elementId,sheet,character) {
        const element = sheet.getElement(elementId);
        const data = character.derivedData.proficiencies.knacks[name];
        element.value = data.proficient;
        element.totalbonus = data.totalbonus;
        element.permanentbonus = data.permanentbonus;
        element.abilitybonus = data.abilitybonus;
        element.proficiencybonus = data.proficiencybonus;
        element.levelbonus = data.levelbonus;
    }
    
    getSpecies(sheet,speciesId) {
		var result = null;
		sheet.species.every((specie) => {
			if(specie.id === speciesId) {
				result = specie;
				return false;
			}
			return true;
		});
		return result;
	}
	
	getCalling(sheet,callingId) {
		var result = null;
		sheet.callings.every((calling) => {
			if(calling.id === callingId) {
				result = calling;
				return false;
			}
			return true;
		});
		return result;
	}
	
	getOrigin(sheet,originId) {
		var result = null;
		sheet.origins.every((origin) => {
			if(origin.id === originId) {
				result = origin;
				return false;
			}
			return true;
		});
		return result;
	}
	
    /**
     * Display all the attributes of a character on a sheet.
     *
	 * @param {CharacterSheet} sheet the sheet to display the character on.
	 * @param {Character} character the character to get the data from.
     */
    display(sheet,character) {
		const calling = this.getCalling(sheet,character.calling?.calling?.id);
		const specie = this.getSpecies(sheet,character.species?.species?.id);
		const origin = this.getOrigin(sheet,character.origin?.origin?.id);
        sheet.setCharacterData('charactername',character.name);
        sheet.setCharacterData('characterlevel',character.level);
        sheet.setCharacterData('charactercalling',calling?.id);
        sheet.setCharacterData('characterspecies',specie?.id);
        sheet.setCharacterData('characterorigin',origin?.id);
        sheet.setCharacterData('characterfate',character.fate);
        sheet.setCharacterData('characterdescription',character.description);
        sheet.setCharacterData('characterhitpoints',character.hitpoints);
        sheet.setCharacterData('characterpower',character.power);
        sheet.setCharacterData('characterwealth',character.wealth);
        sheet.setCharacterData('characterstrength',character.strength);
        sheet.setCharacterData('characterconstitution',character.constitution);
        sheet.setCharacterData('characterdexterity',character.dexterity);
        sheet.setCharacterData('characterintelligence',character.intelligence);
        sheet.setCharacterData('characterwisdom',character.wisdom);
        sheet.setCharacterData('charactercharisma',character.charisma);
        // derived values
        this.displayKnack('acrobatics','characteracrobatics',sheet,character);
        this.displayKnack('arcana','characterarcana',sheet,character);
        this.displayKnack('athletics','characterathletics',sheet,character);
        this.displayKnack('bluff','characterbluff',sheet,character);
        this.displayKnack('diplomacy','characterdiplomacy',sheet,character);
        this.displayKnack('engineering','characterengineering',sheet,character);
        this.displayKnack('healing','characterhealing',sheet,character);
        this.displayKnack('history','characterhistory',sheet,character);
        this.displayKnack('insight','characterinsight',sheet,character);
        this.displayKnack('intimidation','characterintimidation',sheet,character);
        this.displayKnack('leadership','characterleadership',sheet,character);
        this.displayKnack('nature','characternature',sheet,character);
        this.displayKnack('perception','characterperception',sheet,character);
        this.displayKnack('religion','characterreligion',sheet,character);
        this.displayKnack('stealth','characterstealth',sheet,character);
        this.displayKnack('streetwise','characterstreetwise',sheet,character);
        this.displayKnack('survival','charactersurvival',sheet,character);
        this.displayKnack('thievery','characterthievery',sheet,character);
        // other calculated values
        sheet.setCharacterData('charactermaxhitpoints',character.derivedData.maxHitPoints);
        sheet.setCharacterData('charactervision',character.derivedData.vision);
        sheet.setCharacterData('charactersize',character.derivedData.size);
        sheet.setCharacterData('characterspeed',character.derivedData.speed);
        sheet.setCharacterData('characterinitiative',character.derivedData.initiative);
        sheet.setCharacterData('characterdr',character.derivedData.damageReduction);
        sheet.setCharacterData('characterhealingvalue',character.derivedData.healingValue);
        sheet.setCharacterData('charactermaxpower',character.derivedData.maxPower);
        this.setPersonality(sheet,character.personality);
        this.setBackground(sheet,character.background);
        this.setProficiencies(sheet,character.characterData.proficiencies);
    }

	setProficiencies(sheet,proficiencies) {
		const toolProfs = proficiencies['tools'];
		const weaponProfs = proficiencies['weapons'];
		const implementProfs = proficiencies['implements'];
		const pis = [];
		toolProfs.forEach((toolProf) => { 
					const newItem = document.createElement('proficiency-field');
					newItem.setAttribute('type','tool');
					newItem.setAttribute('equipmentId',typeof toolProf.id === 'string' ? toolProf.id : toolProf.id.id);
					newItem.setAttribute('name',toolProf.name);
					pis.push(newItem);
				} 
			);
		weaponProfs.forEach((weaponProf) => { 
					const newItem = document.createElement('proficiency-field');
					newItem.setAttribute('type','weapon');
					newItem.setAttribute('equipmentId',typeof weaponProf.id === 'string' ? weaponProf.id : weaponProf.id.id);
					newItem.setAttribute('name',weaponProf.name);
					pis.push(newItem);
				} 
			);
		implementProfs.forEach((implementProf) => { 
					const newItem = document.createElement('proficiency-field');
					newItem.setAttribute('type','implement');
					newItem.setAttribute('equipmentId',typeof implementProf.id === 'string' ? implementProf.id : implementProf.id.id);
					newItem.setAttribute('name',implementProf.name);
					pis.push(newItem);
				} 
			);
		sheet.setCharacterListItems('characterproficiencies',pis);
	}
	
	setPersonality(sheet,personality) {
		const items = [];
		const keys = Object.keys(personality);
		keys.forEach((key) => {
			const value = personality[key];
			items.push(`<personality-field name="${key}" value="${value}"></personality-field>`);
		});
		sheet.setCharacterListItems('characterpersonality',items);
	}
	
	setBackground(sheet,background) {
		const items = [];
		const typeKeys = Object.keys(background);
		typeKeys.forEach((typeKey) => {
			const value = background[typeKey];
			items.push(`<background-field type="${typeKey}" name="${value.name}">${value.description}</background-field>`);
		});
		sheet.setCharacterListItems('characterbackground',items);
	}
	
	/**
	 * Update a character with data entered on a sheet.
     *
	 * @param {CharacterSheet} sheet the sheet to get data from.
	 * @param {Character} character the character to update.
	 */
    readForm(sheet,character) {
        character.name = sheet.getCharacterData('charactername');
        character.level = parseInt(sheet.getCharacterData('characterlevel'),10);
		character.calling.calling = this.getCalling(sheet,sheet.getCharacterData('charactercalling'));
		character.calling.name = character.calling.calling.name;
		character.calling.callingref = null;
		character.species.species = this.getSpecies(sheet,sheet.getCharacterData('characterspecies'));
		character.species.name = character.species.species.name;
		character.species.speciesref = null;
		character.origin.origin = this.getOrigin(sheet,sheet.getCharacterData('characterorigin'));
		character.origin.name = character.origin.origin.name;
		character.origin.originref = null;
        character.fate = sheet.getCharacterData('characterfate');
        character.description = sheet.getCharacterData('characterdescription');
        character.hitpoints = parseInt(sheet.getCharacterData('characterhitpoints'),10);
        character.power = parseInt(sheet.getCharacterData('characterpower'),10);
        character.wealth = parseInt(sheet.getCharacterData('characterwealth'),10);
        character.strength = parseInt(sheet.getCharacterData('characterstrength'),10);
        character.constitution = parseInt(sheet.getCharacterData('characterconstitution'),10);
        character.dexterity = parseInt(sheet.getCharacterData('characterdexterity'),10);
        character.intelligence = parseInt(sheet.getCharacterData('characterintelligence'),10);
        character.wisdom = parseInt(sheet.getCharacterData('characterwisdom'),10);
        character.charisma = parseInt(sheet.getCharacterData('charactercharisma'),10);
        
        const knacks = character.proficiencies.knacks;
        knacks.acrobatics = sheet.getCharacterData('characteracrobatics');
        knacks.arcana = sheet.getCharacterData('characterarcana');
        knacks.athletics = sheet.getCharacterData('characterathletics');
        knacks.bluff = sheet.getCharacterData('characterbluff');
        knacks.diplomacy = sheet.getCharacterData('characterdiplomacy');
        knacks.engineering = sheet.getCharacterData('characterengineering');
        knacks.healing = sheet.getCharacterData('characterhealing');
        knacks.history = sheet.getCharacterData('characterhistory');
        knacks.insight = sheet.getCharacterData('characterinsight');
        knacks.intimidation = sheet.getCharacterData('characterintimidation');
        knacks.leadership = sheet.getCharacterData('characterleadership');
        knacks.nature = sheet.getCharacterData('characternature');
        knacks.perception = sheet.getCharacterData('characterperception');
        knacks.religion = sheet.getCharacterData('characterreligion');
        knacks.stealth = sheet.getCharacterData('characterstealth');
        knacks.streetwise = sheet.getCharacterData('characterstreetwise');
        knacks.survival = sheet.getCharacterData('charactersurvival');
        knacks.thievery = sheet.getCharacterData('characterthievery');
        character.personality = {};
        const plist = sheet.getPersonalityList();
        plist.forEach((item) => character.personality[item.name] = item.value);
//        character.background = {};
        const blist = sheet.getBackgroundList();
        console.log("fork munch "+blist);
        const cbg = {};
        const bglist = sheet.backgrounds;
        blist.forEach((item) => {
			const bgitem = bglist[item.type][item.name];
			const bg = {
				background: bgitem,
				bgref: item.bgref,
				description: item.description,
				name: item.name,
				type: item.type
			};
			cbg[item.type] = bg;
		});
		character.background = cbg;
		const cprofs = character.characterData.proficiencies;
		cprofs.tools = []; cprofs.weapons = []; cprofs.implements = [];
		const cplist = sheet.getProficiencyList();
		for(var i = 0; i < cplist.length; i++) {
			const p = {id: cplist[i].equipmentId, name: cplist[i].name};
			cprofs[cplist[i].type+'s'].push(p);
		};
    }
    
    calculate(character) {
       character.calculate();
    }
    
    save(character) {
        this.characterRepo.saveCharacter(character);
    }
    
    // the rest of these functions are meant to be called from action functions at the UI layer.
    
    refresh(sheet,character,action) {
		console.log("refresh called");
    	this.readForm(sheet,character);
    	this.populateCharacter(sheet,character, (charSheet) => { 
				this.calculate(character);
				action(charSheet,character);
			});
    }
    
    saveCharacter(sheet,character) {
        this.refresh(sheet,character, (sheet,character) => {
	        this.save(character);
	        sheet.dirty = false;
		});
    }
    
    refreshCharacter(sheet,character) {
        this.refresh(sheet,character, (sheet,character) => {
	        this.display(sheet,character);
	        sheet.refreshed = true;
		});
    }

    recalculateCharacter(character) {
        this.calculate(character);
    }
    
    render(sheet,character) {
		sheet.model = character;
		this.calculate(character);
		this.display(sheet,character);
	}
	
	setSpeciesFromList(character,speciesList) {
		if(character.species.name === undefined || character.species.name === null) { return false; }
		const id = character.species.speciesref?.id;
		for(var i = 0; i < speciesList.length; i++) {
			if(id === speciesList[i].id) {
				character.species.name = speciesList[i].name;
				character.species.species = speciesList[i];
				return true;
			}
		}
	}
	
	setCallingFromList(character,callingsList)	{
		if(character.calling.name === undefined || character.calling.name === null) { return false; }
		const id = character.calling.callingref?.id;
		for(var i = 0; i < callingsList.length; i++) {
			if(id === callingsList[i].id) {
				character.calling.name = callingsList[i].name;
				character.calling.calling = callingsList[i];
				return true;
			}
		}
	}
	
	setOriginFromList(character,originsList) {
		if(character.origin.name === undefined || character.origin.name === null) { return false; }
		const id = character.origin.originref?.id;
		for(var i = 0; i < originsList.length; i++) {
			if(id === originsList[i].id) {
				character.origin.name = originsList[i].name;
				character.origin.origin = originsList[i];
				return true;
			}
		}
	}
	
	/**
	 * Replace references to backgrounds in the character object with the corresponding entities.
	 */
	setBackgroundsFromList(character,backgrounds) {
		Object.keys(character.background).forEach((cbKey) => {
			var bgref = character.background[cbKey].bgref;
			if(bgref === undefined) { bgref = character.background[cbKey].background; }
			Object.keys(backgrounds[cbKey]).forEach((bgKey) => {
				var bg = backgrounds[cbKey][bgKey];
				if(bg.id === bgref.id) {
					character.background[cbKey].background = bg;
				}
			});
		});
	}
	
	populateCharacter(sheet,character,created) {
		this.speciesRepo.getAllSpecies((speciesList) => {
			this.callingRepo.getAllCallings((callingsList) => {
				this.backgroundRepo.getCategorizedBackgrounds((backgroundsMap) => {
					this.originRepo.getAllOrigins((originsList) => {
						try {
//							const charSheet = document.getElementById(`cv${character.id}`);
							sheet.setSelections(speciesList,callingsList,backgroundsMap,originsList);
							sheet.controller = window.gebApp.characterController;
							this.setSpeciesFromList(character,speciesList);
							this.setCallingFromList(character,callingsList);
							this.setOriginFromList(character,originsList);
							this.setBackgroundsFromList(character,backgroundsMap);
							const theRules =  new Rules(character.calling.calling,character.species.species,character.backgrounds,character.origin.origin);
							sheet.rules = theRules;
							character.rules = theRules;
							created(sheet);
							sheet.controller.render(sheet,character);
						} catch (e) {
							console.log(e.stack);
							console.log("cannot create character sheet "+e.message+" at "+e.lineNumber);
						}
					});
				});
			});
		});	
	}
}

var characterSheetFactory = function(element,characterId,characterRepo,created) {
	element.innerHTML = `<character-sheet characterid='${characterId}' id='cv${characterId}'></character-sheet>`;
	const charSheet = document.getElementById(`cv${characterId}`);
	const sctrlr = window.gebApp.characterController;
	characterRepo.getCharacterById(characterId,(character) => {
		sctrlr.populateCharacter(charSheet,character,created);
	});
}


export { CharacterController, characterSheetFactory };

