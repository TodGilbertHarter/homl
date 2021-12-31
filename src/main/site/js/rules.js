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

/*
This is the rules container. Every rule which can be applied to perform the calculations for the character
sheet is embodied here.
*/
class Rules {
    rulesList;
    
    constructor() {
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

export { Rules };
