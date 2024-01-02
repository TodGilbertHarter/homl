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
import { Rules } from './rules.js';
import { Entity, EntityId } from './baserepository.js';
import { collections } from './schema.js';
import { immerable } from 'immer';

class Character extends Entity {
	[immerable] = true;
	chardata;
	dData;
	rules;
		
	constructor(id,data) {
		super(id ? id : EntityId.create(collections.characters));
		if(data === null || data === undefined) { 
			data = {
				level: 1,
				background: {},
				personality: {},
				strength: 0,
				constitution: 0,
				dexterity: 0,
				intelligence: 0,
				wisdom: 0,
				charisma: 0,
				fate: 'positive',
				hitpoints: 0,
				power: 0,
				proficiencies: {
					knacks: {},
					tools: [],
					weapons: [],
					implements: []
				},
				species: {},
				origin: {},
				calling: {},
				notes: [],
				name: '',
				description: '',
				wealth: 0,
			}
		}
		this.characterData = data;
		if(typeof this.proficiencies === 'undefined') {
			this.proficiencies = { knacks: {}, tools: [], weapons: [], implements: []};
		}
		if(typeof this.boons === 'undefined') {
			this.boons = {};
		}
		if(typeof this.equipment === 'undefined') {
			this.equipment = {};
		}
		if(typeof this.background === 'undefined') {
			this.background = {};
		}
		if(typeof this.notes === 'undefined') {
			this.notes = [];
		}
		this.clearDerivedData();
	}
	
	/**
	 * Reset all the derived values for this character to an initial empty state.
	 * Once this is called then the calculate() method must be used to rebuild 
	 * the entire derived state from the rules.
	 */
	clearDerivedData() {
        this.dData = {
            levelbonus: 0,
			size: 'medium',
			vision: 'standard',
			healingValue: 0,
			speed: 0,
			maxHitPoints: 0,
			encumbrance: 'unencumbered',
			load: 0,
			maxload: 0,
            proficiencies: {
                knacks: {
                    acrobatics: { },
                    arcana: { },
                    athletics: {},
                    bluff: {},
                    diplomacy: {},
                    engineering: {},
                    healing: {},
                    history: {},
                    insight: {},
                    intimidation: {},
                    leadership: {},
                    nature: {},
                    perception: {},
                    religion: {},
                    stealth: {},
                    streetwise: {},
                    survival: {},
                    thievery: {}
                }
            }
        };
	}
	
    calculate() {
        this.rules.calculate(this);
    }
    
   get background() {
	return this.characterData.background;
   }
   
   set background(value) {
	this.characterData.background = value;
}
   get owner() {
	return this.characterData.owner;
   }
   
   set owner(value) {
	this.characterData.owner = value;
	}
	
   get proficiencies() {
        return this.characterData.proficiencies;
    }
    
    set proficiencies(value) {
        this.characterData.proficiencies = value;
    }
    
    get equipment() {
		return this.characterData.equipment;
	}
	
	set equipment(value) {
		this.characterData.equipment = value;
	}
	
	get boons() {
		return this.characterData.boons;
	}
	
	set boons(value) {
		this.characterData.boons = value;
	}
    
    get derivedData() {
        return this.dData;
    }
    
    set derivedData(data) {
        this.dData = data;
    }
    
    set characterData(data) {
        this.chardata = data;
/*		this.rules = new Rules(window.gebApp.callingRepo);
		this.rules.getCalling(this); */
    }
    
    get characterData() {
        return this.chardata;
    }
    
    get name() {
        return this.characterData.name;
    }
    
    set name(value) {
        this.characterData.name = value;
    }
    
    get level() {
        return this.characterData.level;
    }
    
    set level(value) {
        this.characterData.level = value;
    }

    get calling() {
        return this.characterData.calling;
    }
    
    set calling(value) {
        this.characterData.calling = value;
    }
    
    get species() {
        return this.characterData.species;
    }
    
    set species(value) {
        this.characterData.species = value;
    }
    
    get origin() {
		return this.characterData.origin;
	}
	
	set origin(value) {
		this.characterData.origin = value;
	}

    get fate() {
        return this.characterData.fate;
    }
    
    set fate(value) {
        this.characterData.fate = value;
    }
    
    get description() {
        return this.characterData.description;
    }
    
    set description(value) {
        this.characterData.description = value;
    }

    get hitpoints() {
        return this.characterData.hitpoints;
    }
    
    set hitpoints(value) {
        this.characterData.hitpoints = value;
    }
    
    get power() {
        return this.characterData.power;
    }
    
    set power(value) {
        this.characterData.power = value;
    }

    get wealth() {
        return this.characterData.wealth;
    }
    
    set wealth(value) {
        this.characterData.wealth = value;
    }
    
    get strength() {
        return this.characterData.strength;
    }
    
    set strength(value) {
        this.characterData.strength = value;
    }

    get constitution() {
        return this.characterData.constitution;
    }
    
    set constitution(value) {
        this.characterData.constitution = value;
    }
    
    get dexterity() {
        return this.characterData.dexterity;
    }
    
    set dexterity(value) {
        this.characterData.dexterity = value;
    }

    get intelligence() {
        return this.characterData.intelligence;
    }
    
    set intelligence(value) {
        this.characterData.intelligence = value;
    }

    get wisdom() {
        return this.characterData.wisdom;
    }
    
    set wisdom(value) {
        this.characterData.wisdom = value;
    }

    get charisma() {
        return this.characterData.charisma;
    }
    
    set charisma(value) {
        this.characterData.charisma = value;
    }

    get vision() {
        return this.derivedData.vision;
    }
    
    set vision(value) {
        this.derivedData.vision = value;
    }
    
    get personality() {
		return this.characterData.personality;
	}
	
	set personality(value) {
		this.characterData.personality = value;
	}
}

export { Character };
