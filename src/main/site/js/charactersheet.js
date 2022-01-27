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

/** @private */ const CharacterSheettemplate = document.getElementById('charactersheettemplate');

class CharacterSheet extends HTMLElement {
	/** @private */static template = CharacterSheettemplate;
	model;
	rules;
	speciesRepo;
	callingsRepo;
	/** @type {string} @private */ characterId;
	
	constructor() {
		super();
		this.speciesRepo = window.gebApp.speciesRepo;
		this.coallingsRepo = window.gebApp.callingsRepo;
		
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
    
}

window.customElements.define('character-sheet',CharacterSheet);

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
    
    /**
     * Display all the attributes of a character on a sheet.
     *
	 * @param {CharacterSheet} sheet the sheet to display the character on.
	 * @param {Character} character the character to get the data from.
     */
    display(sheet,character) {
        sheet.setCharacterData('charactername',character.name);
        sheet.setCharacterData('characterlevel',character.level);
        sheet.setCharacterData('charactercalling',character.calling.name); //TODO: create picklist fields
        sheet.setCharacterData('characterspecies',character.species);
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
//TODO: fix this        character.calling = sheet.getCharacterData('charactercalling');
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

export { CharacterController };

