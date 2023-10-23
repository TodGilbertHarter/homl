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
import { collection, doc, setDoc, query, where, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { Character } from './character.js';
import { schema, getReference, getDb } from './schema.js';

const characterConverter = {
	toFirestore(character) {
		const c = {};
		const cd = character.characterData;
		c.id = character.id;
		for(const [key, value] of Object.entries(character.characterData)) {
			if(key === "background") {
				for(const [bgkey, bg] of Object.entries(character.characterData[key])) {
					const docRef = getReference(schema.backgrounds,bg.background.id);
					const nb = {
						bgref: docRef,
						description: bg.description,
						name: bg.name
					};
					if(c[key] === undefined) { c[key] = {};}
					c[key][bgkey] = nb;
				};
			} else if(key === "species") {
				if(character.characterData.species.species !== undefined && character.characterData.species.species !== null) {
					const docRef = getReference(schema.species,character.characterData.species.species.id);
					c[key] = { name: character.characterData.species.species.name, speciesref: docRef};
				} else {
					throw new Error("bad species when trying to save character");
				}
			} else if(key === "origin") {
				if(character.characterData.origin.origin !== undefined && character.characterData.origin.origin !== null) {
					const docRef = getReference(schema.origins,character.characterData.origin.origin.id);
					c[key] = { name: character.characterData.origin.origin.name, originref: docRef};
				} else {
					throw new Error("bad origin when trying to save character");
				}
			} else if(key === "calling") {
				if(character.characterData.calling.calling !== undefined && character.characterData.calling.calling !== null) {
					const docRef = getReference(schema.callings,character.characterData.calling.calling.id);
					c[key] = { name: character.characterData.calling.calling.name, callingref: docRef};
				} else {
					throw new Error("bad calling when trying to save character");
				}
			} else if(key === "proficiencies") {
				c[key] = {tools: [], implements: [], weapons: []};
				const profs = cd[key];
				c[key]['knacks'] = profs['knacks'];
				const fixProfLink = (id) => { return getReference(schema.equipment,id); };
				for(var i = 0; i < profs['weapons'].length; i++) {
					const p = profs['weapons'][i];
					const link = fixProfLink(p.id);
					c[key]['weapons'][i] = { id: link, name: p.name};
				}
				for(var i = 0; i < profs['tools'].length; i++) {
					const p = profs['tools'][i];
					const link = fixProfLink(p.id);
					c[key]['tools'][i] = { id: link, name: p.name};
				}
				for(var i = 0; i < profs['implements'].length; i++) {
					const p = profs['implements'][i];
					const link = fixProfLink(p.id);
					c[key]['implements'][i] = { id: link, name: p.name};
				}				
			} else {
				c[key] = value;
			}
		}
		return c;
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting character and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Character(id,data);
	}
}

class CharacterRepository {
	/*
	Character repo, this fetches characters for us from Firebase.
	*/
	/** @private */ gebApp;
    /** @private */ db;

    constructor(gebApp,firestore) {
		this.gebApp = gebApp;
        this.db = firestore;
    }

	/**
	 * Convert a collection of character document references into Character objects by looking them
	 * up in firestore. This is intended to handle converting lists of characters from a game or a
	 * player into Character objects.
	 *
	 * @param {[docs]} characters an array of character docrefs.
	 * @param {function([Character])} onDataAvailable callback to handle the results.
	 */
 	getReferencedCharacters(characters,onDataAvailable) {
		const results = [];
		characters.forEach((docRef) => {
			const dr = docRef.withConverter(characterConverter);
			const cp = getDoc(dr);
			results.push(cp);
		});
		Promise.all(results).then((carry) => {
			const res = [];
			carry.forEach((doc) => { 
				res.push(doc.data()); 
			});
			onDataAvailable(res); 
		});
	}
	
   getCharacterByName(name,onDataAvailable) {
        this.db.collection("characters").where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Character data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getCharactersByName(name,onDataAvailable) {
		const cRef = collection(this.db,"characters");
		var q = query(cRef,where("name", "==", name));
		q = q.withConverter(characterConverter);
		getDocs(q).then((doc) => { 
				console.log("GOT SOME DATA "+doc);
				const results = [];
				doc.forEach((gdata) => {
					results.push(gdata.data());
				});
				onDataAvailable(results); 
			});
	}

    /**
     * Get a character given its id.
     *
     * @param {string} id Document id of the character to get.
     * @Param {function([Character])} onDataAvailable data available callback.
     */
	getCharacterById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"characters",id);
		docRef = docRef.withConverter(characterConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    async saveCharacter(character) {
        console.log("Saving data of "+JSON.stringify(character));
        if(character.hasOwnProperty('id') && character.id !== undefined && character.id !== null) {
            console.log("UPDATING, ID IS:"+character.id);
            const id = character.id;
            const ref = doc(this.db,"characters",id).withConverter(characterConverter);
            await setDoc(ref,character);
        } else {
            console.log("CREATING, data is "+JSON.stringify(character));
            const ref = doc(collection(this.db,"characters")).withConverter(characterConverter);
            await setDoc(ref,character);
        }
    }
}

export { CharacterRepository };

