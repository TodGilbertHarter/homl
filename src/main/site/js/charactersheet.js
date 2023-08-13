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
	/** @type {string} @private */ characterId;
	
	constructor() {
		super();
		const content = CharacterSheet.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
 	}

	connectedCallback() {
		this.characterId = this.getAttribute('characterid');
		const savebutton = this.shadowRoot.getElementById('savebutton');
		const refreshbutton = this.shadowRoot.getElementById('refreshbutton');
		const sbh = this.saveButtonHandler.bind(this);
		savebutton.addEventListener('click',sbh);
		const rbh = this.refreshButtonHandler.bind(this);
		refreshbutton.addEventListener('click',rbh);
//		const characterview = this.shadowRoot.getElementById('characterview');
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
		const personalityList = this.shadowRoot.getElementById('characterpersonality');
		personalityList.newButtonHandler = (e) => {
			const nitem = '<personality-field name="trait name" value="new description"></personality-field>';
			personalityList.addItem(nitem);
		};
		
		const backgroundList = this.shadowRoot.getElementById('characterbackground');
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
				const bgTemplate = html`<background-field type='${type}' name='${name}'>${text}</background-field>`;
				render(bgTemplate,backgroundList);
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
			const template = (myBg) => html`<div slot='contents' style='width: 350px;'>
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
	
	disconnectedCallback() {
		
	}
	
	saveButtonHandler(e) {
		window.gebApp.characterController.save(this.model);
	}
	
	refreshButtonHandler(e) {
		window.gebApp.characterController.refreshCharacter(this,this.model);
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
		items.forEach((item) => {
			listElement.addItem(item, () => {});
		});
	}
}

window.customElements.define('character-sheet',CharacterSheet);

class BackgroundField extends LitElement {
	static properties = {
		type: {},
		name: {},
		text: {}
	};

	/** @private */ bgValues;
	deleteButtonHandler = (e) => {
		const pf = e.target.parentNode.parentNode;
		pf.parentNode.removeChild(pf);
	};
	
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
		name: {},
		value: {}
	};
	deleteButtonHandler = (e) => {
		const pf = e.target.parentNode;
		pf.parentNode.removeChild(pf);
	};
	
	constructor() {
		super();
	}
	
	render() {
		return html`<div class="attribute">
			<input part="name" class="name" id="name" value="${this.name}">
			<input part="value" class='value' value="${this.value}" id='value'>
			<button part="delete" name="delete" id='delete' @click="${this.deleteButtonHandler}">x</button>
		</div>`;
	}

}

window.customElements.define('personality-field',PersonalityField);

class ItemList extends LitElement {
	static properties = {
		label: {}	
	};
	newButtonHandler = () => alert('no handler installed');
	items;
	itemSlot;
	
	constructor() {
		super();
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
		this.insertAdjacentHTML('beforeend',item);
		if(inserted !== 'undefined') { inserted(this.lastChild); }
	}
}

window.customElements.define('item-list',ItemList);

/* class PersonalityList extends ItemList {
	
}

window.customElements.define('personality-list',PersonalityList); */

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
        const input = this.shadowRoot.getElementById('input').value = value;
    }
    
    get value() {
        return this.shadowRoot.getElementById('input').value;
    }
}

const template_AttributeField = document.createElement('template');
template_AttributeField.innerHTML = `<label id='label'></label><input id='input' type='text'>`;

class AttributeField extends SheetField {
    constructor() {
        super(template_AttributeField);
    }
    
    connectedCallback() {
        const value = this.getAttribute('value');
        const n = this.getAttribute('name');
        const style = this.getAttribute('style');
        const id = this.getAttribute('id');
        const input = this.shadowRoot.getElementById('input');
//        input.setAttribute('data-bind','value: '+id);
        input.setAttribute('style',style);
        input.setAttribute('value',value);
        input.setAttribute('name',n);
        const ltext = this.getAttribute('label');
        const label = this.shadowRoot.getElementById('label');
        label.innerHTML = ltext;
    }
}

const template_SelectField = document.createElement('template');
// template_SelectField.innerHTML = `<label id='label'></label><select id='input'></select>`;
template_SelectField.innerHTML = `<label id='label'></label><select id='input'><slot name='option'>foo</slot></select></span>`;

class SelectField extends SheetField {
    constructor() {
        super(template_SelectField);
    }
    
    connectedCallback() {
        const value = this.getAttribute('value');
        const n = this.getAttribute('name');
        const style = this.getAttribute('style');
        const id = this.getAttribute('id');
        const input = this.shadowRoot.getElementById('input');
        input.setAttribute('style',style);
        input.setAttribute('value',value);
        input.setAttribute('name',n);
        const ltext = this.getAttribute('label');
        const label = this.shadowRoot.getElementById('label');
        label.innerHTML = ltext;
    }
    
    setSelections(options) {
        const input = this.shadowRoot.getElementById('input');
		options.forEach((option) => {
			const optElement = document.createElement('option');
			optElement.innerText = option.name;
			optElement.value = option.id;
			input.appendChild(optElement);
		});
	}
}

const template_CalculatedField = document.createElement('template');
template_CalculatedField.innerHTML = `<label id='label'></label><span part='text' id='input' type='text'>`;

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
//        input.setAttribute('data-bind','value: '+id);
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
    
    constructor() {
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
		const calling = this.getCalling(sheet,character.calling.id);
		const specie = this.getSpecies(sheet,character.species.id);
		const origin = this.getOrigin(sheet,character.origin.id);
        sheet.setCharacterData('charactername',character.name);
        sheet.setCharacterData('characterlevel',character.level);
        sheet.setCharacterData('charactercalling',calling.id);
        sheet.setCharacterData('characterspecies',specie.id);
        sheet.setCharacterData('characterorigin',origin.id);
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
		character.calling = sheet.getCharacterData('charactercalling');
		character.species = sheet.getCharacterData('characterspecies');
        character.fate = sheet.getCharacterData('characterfate');
        character.description = sheet.getCharacterData('characterdescription');
        character.hitpoints = parseInt(sheet.getCharacterData('characterhitpoints'),10);
        character.power = sheet.getCharacterData('characterpower');
        character.wealth = sheet.getCharacterData('characterwealth');
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
    }
    
    calculate(character) {
       character.calculate();
    }
    
    save(character) {
        this.repo.saveCharacter(character);
    }
    
    // the rest of these functions are meant to be called from action functions at the UI layer.
    
    refresh(sheet,character) {
		console.log("refresh called");
    	this.readForm(sheet,character);
    	this.calculate(character);
    }
    
    saveCharacter(sheet,character) {
        this.refresh(sheet,character);
        this.save(character);
    }
    
    refreshCharacter(sheet,character) {
        this.refresh(sheet,character);
        this.display(sheet,character);
    }

    recalculateCharacter(character) {
        this.calculate(character);
    }
    
    render(sheet,character) {
		this.calculate(character);
		this.display(sheet,character);
	}
}

var characterSheetFactory = function(element,characterId,speciesRepo,callingRepo,characterRepo,backgroundRepo,originRepo,created) {
	speciesRepo.getAllSpecies((speciesList) => {
		callingRepo.getAllCallings((callingsList) => {
			backgroundRepo.getCategorizedBackgrounds((backgroundsMap) => {
				originRepo.getAllOrigins((originsList) => {
					try {
						element.innerHTML = `<character-sheet characterid='${characterId}' id='cv${characterId}'></character-sheet>`;
						const charSheet = document.getElementById(`cv${characterId}`);
						charSheet.setSelections(speciesList,callingsList,backgroundsMap,originsList);
						charSheet.controller = window.gebApp.characterController;
						created(charSheet);
						if(characterId !== null) {
							characterRepo.getCharacterById(characterId, (character) => {
								setSpeciesFromList(character,speciesList);
								setCallingFromList(character,callingsList);
								setOriginFromList(character,originsList);
								setBackgroundsFromList(character,backgroundsMap);
								const theRules =  new Rules(character.calling,character.species,character.backgrounds,character.origin);
								charSheet.rules = theRules;
								character.rules = theRules;
								charSheet.controller.render(charSheet,character);
							});
						}
					} catch (e) {
						console.log("cannot create character sheet "+e.message+" at "+e.lineNumber);
					}
				});
			});
		});
	});	
}

/**
 * Replace reference to character species in character object with the corresponding entity.
 */
function setSpeciesFromList(character,speciesList) {
	const id = character.species.id;
	for(var i = 0; i < speciesList.length; i++) {
		if(id === speciesList[i].id) {
			character.species = speciesList[i];
		}
	}
}

/**
 * Replace reference to character calling in character object with the corresponding entity.
 */
function setCallingFromList(character,callingsList)	{
	const id = character.calling.id;
	for(var i = 0; i < callingsList.length; i++) {
		if(id === callingsList[i].id) {
			character.calling = callingsList[i];
		}
	}
}

/**
 * Replace reference to character origin in character object with the corresponding entity.
 */
function setOriginFromList(character,originsList) {
	const id = character.origin.id;
	for(var i = 0; i < originsList.length; i++) {
		if(id === originsList[i].id) {
			character.origin = originsList[i];
		}
	}
}

/**
 * Replace references to backgrounds in the character object with the corresponding entities.
 */
function setBackgroundsFromList(character,backgrounds) {
	Object.keys(character.background).forEach((cbKey) => {
		var bgref = character.background[cbKey].bgref;
		Object.keys(backgrounds[cbKey]).forEach((bgKey) => {
			var bg = backgrounds[cbKey][bgKey];
			if(bg.id === bgref.id) {
				character.background[cbKey].bgref = bg;
			}
		});
	});
}

export { CharacterController, characterSheetFactory };

