/*
This acts as the API for the character sheet UI itself. 
*/
class CharacterSheet {
    
    getElement(elementId) {
        return document.getElementById(elementId);
    }
    
    getCharacterData(elementId) {
        return document.getElementById(elementId).value;
    }
    
    setCharacterData(elementId,value) {
        document.getElementById(elementId).value = value;
    }
}

/*
Represents a 'rule' to be applied to a character in order to calculate one of the derived values.
Every Calculation has a TARGET, a piece of the derived character which it updates. It also has
sources, other pieces of the character which it pulls data from.
*/
class Calculation {
    #targetname;
    #sourceslist = [];
    calculate;
    
    constructor(target,sources,calculation) {
        this.#targetname = target;
        this.#sourceslist = sources.concat(this.sources);
        this.calculate = calculation;
    }
    
    get target() {
        return this.#targetname;
    }
    
    get sources() {
        return this.#sourceslist;
    }
}

const proficiencyBonus = 5;

/*
This is the rules container. Every rule which can be applied to perform the calculations for the character
sheet is embodied here.
*/
class Rules {
    #rulesList;
    
    constructor() {
        this.#rulesList = [];
        
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
        this.#rulesList.push(calculation);
        this.sortRules();
    }
    
    sortRules() {
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

        this.#rulesList.forEach((calculation) => {
            calculation.calculate(character);
        });
    }
}

/*
Character sheet class. This represents the model.
*/
class HoMLCharacter {
    #chardata;
    #dData;
    
    /* Create a new empty character */
    constructor() {
        this.#chardata = {
            personality: {},
            background: {},
            proficiencies: { knacks: {}, tools: [], other: []},
            boons: {},
            equipment: {},
            level: 1,
            hitpoints: 0,
            power: 0,
            wealth: 0,
            strength: 0,
            constitution: 0,
            dexterity: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        };
        this.#dData = {
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
    
    get derivedData() {
        return this.#dData;
    }
    
    set derivedData(data) {
        this.#dData = data;
    }
    
    set characterData(data) {
        this.#chardata = data;
    }
    
    get characterData() {
        return this.#chardata;
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


/*
Character repo, this fetches characters for us from Firebase.
*/
class CharacterRepository {
    #app;
    #db;
    #firebaseConfig;

    constructor(firebase) {
        this.#firebaseConfig = {
	    apiKey: "AIzaSyBUvzyIX-YQSEcQXdBdrHNgyOWTS5hVwx4",
	    authDomain: "heroes-of-myth-and-legend.firebaseapp.com",
	    projectId: "heroes-of-myth-and-legend",
	    storageBucket: "heroes-of-myth-and-legend.appspot.com",
	    messagingSenderId: "670305006733",
	    appId: "1:670305006733:web:4086a48931a752cbf85ec4",
	    measurementId: "G-PY517GF9BS"
        };
        this.#app = firebase.initializeApp(this.#firebaseConfig);
        this.#db = firebase.firestore();
    }

    getCharacterByName(name,onDataAvailable) {
        this.#db.collection("characters").where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Character data is:"+JSON.stringify(data));
                onDataAvailable(data) 
                
            } ) });
    }
    
    saveCharacter(character) {
        const data = character.characterData;
        console.log("Saving data of "+JSON.stringify(data));
        if(data.hasOwnProperty('id') && data.id !== undefined) {
            console.log("UPDATING, ID IS:"+data.id);
            var id = data.id;
//            data.id = null;
            delete data.id;
            this.#db.collection("characters").doc(id).set(data);
            data.id = id;
        } else {
            console.log("CREATING, data is "+JSON.stringify(data));
            this.#db.collection("characters").add(data);
        }
    }
}

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
window.customElements.define('ability-field',AbilityField);
window.customElements.define('knack-field',KnackField);

/*
CharacterController is the controller, responsible for carrying out all the character sheet logical operations.
*/      
class CharacterController {
    #repo;
    #character;
    #sheet;
    #rules;
    
    constructor(firebase) {
        this.#repo = new CharacterRepository(firebase);
        this.#rules = new Rules();
        const urlParams = new URLSearchParams(window.location.search);
        const charName = urlParams.get('characterName');
        this.#character = new HoMLCharacter();
        this.#sheet = new CharacterSheet();
        if(charName !== null) {
            this.#repo.getCharacterByName(charName,(data) => {
                this.#character.characterData = data;
                this.calculate();
                this.display();
            });
        }
        
    }

    displayKnack(name,elementId) {
        const element = this.#sheet.getElement(elementId);
        const data = this.#character.derivedData.proficiencies.knacks[name];
        element.value = data.proficient;
        element.totalbonus = data.totalbonus;
        element.permanentbonus = data.permanentbonus;
        element.abilitybonus = data.abilitybonus;
        element.proficiencybonus = data.proficiencybonus;
        element.levelbonus = data.levelbonus;
    }
    
    display() {
        this.#sheet.setCharacterData('charactername',this.#character.name);
        this.#sheet.setCharacterData('characterlevel',this.#character.level);
        this.#sheet.setCharacterData('charactercalling',this.#character.calling);
        this.#sheet.setCharacterData('characterspecies',this.#character.species);
        this.#sheet.setCharacterData('characterfate',this.#character.fate);
        this.#sheet.setCharacterData('characterdescription',this.#character.description);
        this.#sheet.setCharacterData('characterhitpoints',this.#character.hitpoints);
        this.#sheet.setCharacterData('characterpower',this.#character.power);
        this.#sheet.setCharacterData('characterwealth',this.#character.wealth);
        this.#sheet.setCharacterData('characterstrength',this.#character.strength);
        this.#sheet.setCharacterData('characterconstitution',this.#character.constitution);
        this.#sheet.setCharacterData('characterdexterity',this.#character.dexterity);
        this.#sheet.setCharacterData('characterintelligence',this.#character.intelligence);
        this.#sheet.setCharacterData('characterwisdom',this.#character.wisdom);
        this.#sheet.setCharacterData('charactercharisma',this.#character.charisma);
        // derived values
        this.displayKnack('acrobatics','characteracrobatics');
        this.displayKnack('arcana','characterarcana');
        this.displayKnack('athletics','characterathletics');
        this.displayKnack('bluff','characterbluff');
        this.displayKnack('diplomacy','characterdiplomacy');
        this.displayKnack('engineering','characterengineering');
        this.displayKnack('healing','characterhealing');
        this.displayKnack('history','characterhistory');
        this.displayKnack('insight','characterinsight');
        this.displayKnack('intimidation','characterintimidation');
        this.displayKnack('leadership','characterleadership');
        this.displayKnack('nature','characternature');
        this.displayKnack('perception','characterperception');
        this.displayKnack('religion','characterreligion');
        this.displayKnack('stealth','characterstealth');
        this.displayKnack('streetwise','characterstreetwise');
        this.displayKnack('survival','charactersurvival');
        this.displayKnack('thievery','characterthievery');
    }

    readForm() {
        this.#character.name = this.#sheet.getCharacterData('charactername');
        this.#character.level = parseInt(this.#sheet.getCharacterData('characterlevel'),10);
        this.#character.calling = this.#sheet.getCharacterData('charactercalling');
        this.#character.species = this.#sheet.getCharacterData('characterspecies');
        this.#character.fate = this.#sheet.getCharacterData('characterfate');
        this.#character.description = this.#sheet.getCharacterData('characterdescription');
        this.#character.hitpoints = parseInt(this.#sheet.getCharacterData('characterhitpoints'),10);
        this.#character.power = this.#sheet.getCharacterData('characterpower');
        this.#character.wealth = this.#sheet.getCharacterData('characterwealth');
        this.#character.strength = parseInt(this.#sheet.getCharacterData('characterstrength'),10);
        this.#character.constitution = parseInt(this.#sheet.getCharacterData('characterconstitution'),10);
        this.#character.dexterity = parseInt(this.#sheet.getCharacterData('characterdexterity'),10);
        this.#character.intelligence = parseInt(this.#sheet.getCharacterData('characterintelligence'),10);
        this.#character.wisdom = parseInt(this.#sheet.getCharacterData('characterwisdom'),10);
        this.#character.charisma = parseInt(this.#sheet.getCharacterData('charactercharisma'),10);
        
        const knacks = this.#character.proficiencies.knacks;
        knacks.acrobatics = this.#sheet.getCharacterData('characteracrobatics');
        knacks.arcana = this.#sheet.getCharacterData('characterarcana');
        knacks.athletics = this.#sheet.getCharacterData('characterathletics');
        knacks.bluff = this.#sheet.getCharacterData('characterbluff');
        knacks.diplomacy = this.#sheet.getCharacterData('characterdiplomacy');
        knacks.engineering = this.#sheet.getCharacterData('characterengineering');
        knacks.healing = this.#sheet.getCharacterData('characterhealing');
        knacks.history = this.#sheet.getCharacterData('characterhistory');
        knacks.insight = this.#sheet.getCharacterData('characterinsight');
        knacks.intimidation = this.#sheet.getCharacterData('characterintimidation');
        knacks.leadership = this.#sheet.getCharacterData('characterleadership');
        knacks.nature = this.#sheet.getCharacterData('characternature');
        knacks.perception = this.#sheet.getCharacterData('characterperception');
        knacks.religion = this.#sheet.getCharacterData('characterreligion');
        knacks.stealth = this.#sheet.getCharacterData('characterstealth');
        knacks.streetwise = this.#sheet.getCharacterData('characterstreetwise');
        knacks.survival = this.#sheet.getCharacterData('charactersurvival');
        knacks.thievery = this.#sheet.getCharacterData('characterthievery');
    }
    
    calculate() {
       this.#character.calculate(this.#rules);
    }
    
    save() {
        this.#repo.saveCharacter(this.#character);
    }
    
    // the rest of these functions are meant to be called from action functions at the UI layer.
    
    refresh() {
       this.readForm();
       this.calculate();
    }
    
    saveCharacter() {
        this.refresh();
        this.save();
    }
    
    refreshCharacter() {
        this.refresh();
        this.display();
    }

    recalculateCharacter() {
        this.calculate();
    }
}
