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
import { getDoc, doc, collection, where } from 'firebase-firestore';
import { Character } from './character.js';
import { schema, getReference, getDb } from './schema.js';
import { BaseRepository } from './baserepository.js';

const characterConverter = {
	toFirestore(character) {
		const c = {};
		const cd = character.characterData;
		c.id = character.id;
		for(const [key, value] of Object.entries(cd)) {
			if(key === "background") {
				for(const [bgkey, bg] of Object.entries(value)) {
					const docRef = getReference(schema.backgrounds,bg.background.id);
					const nb = {
						bgref: docRef,
						description: bg.description,
						name: bg.name
					};
					if(c[key] === undefined) { c[key] = {};}
					c[key][bgkey] = nb;
				};
			} else if(key === "equipment") {
				c[key] = {};
				for(const [ekey,equiplist] of Object.entries(value)) {
					c[key][ekey] = [];
					for(var i = 0; i < equiplist.length; i++) {
						const nequip = {
							name: equiplist[i].name,
							eqref: getReference(schema.equipment,equiplist[i].id)
						}
						c[key][ekey].push(nequip);
					}
				}
			} else if(key === "boons") {
				c[key] = {};
				Object.keys(value).forEach((bkey) =>{
					const blist = value[bkey];
					for(var i = 0; i < blist.length; i++) {
						const boonRecord = value[bkey][i];
						if(boonRecord.boon) {
							const docRef = getReference(schema.boons,boonRecord.boon.id);
							const nbr = {
								bref: docRef,
								name: boonRecord.boon.name,
							}
							if(!c[key][bkey]) {
								c[key][bkey] = [];
							}
							c[key][bkey].push(nbr);
						}
					}
				});
			} else if(key === "species") {
				if(value.species !== undefined && value.species !== null) {
					const docRef = getReference(schema.species,value.species.id);
					c[key] = { name: value.species.name, speciesref: docRef};
				} else {
					throw new Error("bad species when trying to save character");
				}
			} else if(key === "origin") {
				if(value.origin !== undefined && value.origin !== null) {
					const docRef = getReference(schema.origins,value.origin.id);
					c[key] = { name: value.origin.name, originref: docRef};
				} else {
					throw new Error("bad origin when trying to save character");
				}
			} else if(key === "calling") {
				if(value.calling !== undefined && value.calling !== null) {
					const docRef = getReference(schema.callings,value.calling.id);
					c[key] = { name: value.calling.name, callingref: docRef};
				} else {
					throw new Error("bad calling when trying to save character");
				}
			} else if(key === "proficiencies") {
				c[key] = {tools: [], implements: [], weapons: []};
				const profs = value;
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

/**
 * Character repository, manages all character objects in repository
 */
class CharacterRepository extends BaseRepository {

    constructor() {
		super(characterConverter,schema.characters);
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
		this.findDto("name",name,"==",onDataAvailable,(message) => { throw new Error(message)});
    }
    
    getCharactersByName(name,onDataAvailable) {
		this.findDtos("name",name,"==",onDataAvailable,(message) => { throw new Error(message)});
	}

    /**
     * Get a character given its id.
     *
     * @param {string} id Document id of the character to get.
     * @Param {function([Character])} onDataAvailable data available callback.
     */
	getCharacterById(id,onDataAvailable) {
		var docRef = this.getReference(id);
		this.dtoFromReference(docRef,onDataAvailable);
	}
	
    async saveCharacter(character) {
		await this.saveDto(character);
    }
    
   	async searchCharacters(params) {
		return this.searchDtos(params);
		   
/*		const cRef = collection(getDb(),this.collectionName);
		const qc = params.map((param) => where(param.fieldName,param.op,param.fieldValue));
        const q = query(cRef,...qc).withConverter(this.converter);
		const doc = await getDocs(q);
		const results = [];
		doc.forEach((gdata) => {
			results.push(gdata.data());
		});
		return results; */
	}

}

export { CharacterRepository };

