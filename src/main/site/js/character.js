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
class Character {
	id;
	chardata;
	dData;
		
	constructor(id,data) {
		this.id = id;
		this.chardata = data;
		if(typeof this.proficiencies === 'undefined') {
			this.proficiencies = { knacks: {}, tools: [], other: []};
		}
		if(typeof this.boons === 'undefined') {
			this.boons = {};
		}
		if(typeof this.equipment === 'undefined') {
			this.equipment = {};
		}
        this.dData = {
            levelbonus: 0,
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
    }
    
    get characterData() {
        return this.chardata;
    }
    
    calculate(rules) {
        rules.calculate(this);
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
}

export { Character };
