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

/*
Represents a 'rule' to be applied to a character in order to calculate one of the derived values.
Every Calculation has a TARGET, a piece of the derived character which it updates. It also has
sources, other pieces of the character which it pulls data from.
*/
class Calculation {
    targetname;
    sources = [];
    calculate;
    
    constructor(target,sources,calculation) {
        this.targetname = target;
        this.sources = sources.concat(this.sources);
        this.calculate = calculation;
    }
    
}

const proficiencyBonus = 5;
const baseDifficultyValue = 16;

/*
This is the rules container. Every rule which can be applied to perform the calculations for the character
sheet is embodied here.
*/
class Rules {
	callingRepo;
    rulesList;
    
    constructor(callingRepo) {
		this.callingRepo = callingRepo;
        this.rulesList = [];
        
        const ltarget = 'levelbonus';
        const lsources = ['level'];
        const lcalc = function(character) {
            const levelbonuses = [0,1,1,2,3,3,4,5,5,6,7,7,8,9,9,10,11,11,12,13,13,14,15,15,16];
            const levelbonus = levelbonuses[character.level-1];
            character.derivedData.levelbonus = levelbonus;
        }
        const levelbonuscalculator = new Calculation(ltarget,lsources,lcalc);
        this.addRule(levelbonuscalculator);

//		this.getCallings();
        
        const calcProficiency = function(name,proficiencies,knacks,levelbonus,abilitybonus) {
            const knack = {};
            knacks[name] = knack;
            knack.proficient = proficiencies[name];
            knack.proficiencybonus = proficiencies[name] ? proficiencyBonus : 0;
            knack.levelbonus = levelbonus;
            knack.permanentbonus = 0; //others will no doubt figure this out
            knack.abilitybonus = abilitybonus;
            knack.totalbonus = knack.proficiencybonus + knack.levelbonus + knack.permanentbonus
                + knack.abilitybonus;
        };
        
        const ktarget = 'knacks';
        const ksources = [ 'abilities' ];
        const kcalc = function(character) {
            const knacks = {};
            const proficiencies = character.proficiencies.knacks;
            const levelbonus = character.derivedData.levelbonus;
            calcProficiency('acrobatics',proficiencies,knacks,levelbonus,character.dexterity);
            calcProficiency('arcana',proficiencies,knacks,levelbonus,character.intelligence);
            calcProficiency('athletics',proficiencies,knacks,levelbonus,character.strength);
            calcProficiency('bluff',proficiencies,knacks,levelbonus,character.charisma);
            calcProficiency('diplomacy',proficiencies,knacks,levelbonus,character.charisma);
            calcProficiency('engineering',proficiencies,knacks,levelbonus,character.intelligence);
            calcProficiency('healing',proficiencies,knacks,levelbonus,character.wisdom);
            calcProficiency('history',proficiencies,knacks,levelbonus,character.intelligence);
            calcProficiency('insight',proficiencies,knacks,levelbonus,character.wisdom);
            calcProficiency('intimidation',proficiencies,knacks,levelbonus,character.charisma);
            calcProficiency('leadership',proficiencies,knacks,levelbonus,character.charisma);
            calcProficiency('nature',proficiencies,knacks,levelbonus,character.wisdom);
            calcProficiency('perception',proficiencies,knacks,levelbonus,character.wisdom);
            calcProficiency('religion',proficiencies,knacks,levelbonus,character.wisdom);
            calcProficiency('stealth',proficiencies,knacks,levelbonus,character.dexterity);
            calcProficiency('streetwise',proficiencies,knacks,levelbonus,character.wisdom);
            calcProficiency('survival',proficiencies,knacks,levelbonus,character.constitution);
            calcProficiency('thievery',proficiencies,knacks,levelbonus,character.dexterity);
            if(character.derivedData.proficiencies === undefined) { 
                character.derivedData.proficiencies = {};
            }
            character.derivedData.proficiencies.knacks = knacks;
        };
        const knackCalculator = new Calculation(ktarget,ksources,kcalc);
        this.addRule(knackCalculator);
    }
    
    /**
     * Get callings from the database. This will just get ALL of the callings, no doubt we will
     * likely use them all, and there shouldn't be too many anyway. calls createCallingCalculators
     * when the data is available.
     */
    getCalling(character) {
		this.callingRepo.getReferencedCalling(character.calling,(calling) => {
			this.createCallingCalculators(calling);
			this.calculate(character);
		});
	}
	
	/**
	 * Callback which sets up the calling calculations once we get data back.
	 */
    createCallingCalculators(calling) {
		this.addRules(calling.calculators);
	}
	
	addRules(calculations) {
		calculations.forEach((calculation) => {
			this.rulesList.push(calculation);
		});
		this.sortRules();
	}
	
    addRule(calculation) {
        this.rulesList.push(calculation);
        this.sortRules();
    }
    
    sortRules() {
	//TODO: figure out how to sort the rules in dependency order...
    }
    
    calculate(character) {
        character.derivedData = {
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

        this.rulesList.forEach((calculation) => {
            calculation.calculate(character);
        });
    }
}

export { Rules, Calculation };
