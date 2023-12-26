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
import { Character } from './character.js';
import { collections } from './schema.js';
import { WriteRepository, EntityId } from './baserepository.js';

const characterConverter = {
	toFirestore(character) {
		const c = { version: 1.0 };
		const cd = character.characterData;
//		c.id = character.id;
		for(const [key, value] of Object.entries(cd)) {
			if(key === "background") {
				for(const [bgkey, bg] of Object.entries(value)) {
					const docRef = bg.background.id.getReference();
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
							eqref: equiplist[i].id.getReference()
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
							const docRef = boonRecord.boon.id.getReference();
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
					const docRef = value.species.id.getReference();
					c[key] = { name: value.species.name, speciesref: docRef};
				} else {
					throw new Error("bad species when trying to save character");
				}
			} else if(key === "origin") {
				if(value.origin !== undefined && value.origin !== null) {
					const docRef = value.origin.id.getReference();
					c[key] = { name: value.origin.name, originref: docRef};
				} else {
					throw new Error("bad origin when trying to save character");
				}
			} else if(key === "calling") {
				if(value.calling !== undefined && value.calling !== null) {
					const docRef = value.calling.id.getReference();
					c[key] = { name: value.calling.name, callingref: docRef};
				} else {
					throw new Error("bad calling when trying to save character");
				}
			} else if(key === "proficiencies") {
				c[key] = {tools: [], implements: [], weapons: []};
				const profs = value;
				c[key]['knacks'] = profs['knacks'];
				const fixProfLink = (id) => { return id.getReference(); };
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
			} else if (key === 'id') {
				//DO NOTHING, stop storing an extra redundant id field!
			} else {
				c[key] = value;
			}
		}
		return c;
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting character and id is "+snapshot.id);
		const id = snapshot.id;
		const eid = EntityId.create(collections.characters,id);
		const data = snapshot.data(options);
		for(const [key, value] of Object.entries(data)) {
			if(key === 'species') {
				data[key].speciesref = EntityId.EntityIdFromReference(value.speciesref);
			}
			if(key === 'calling') {
				data[key].callingref = EntityId.EntityIdFromReference(value.callingref);
			}
			if(key === 'origin') {
				data[key].originref = EntityId.EntityIdFromReference(value.originref);
			}
			if(key === 'boons') {
				for(const [bkey,bvalue] of Object.entries(value)) {
					for(var i = 0; i < bvalue.length; i++) {
						bvalue[i].bref = EntityId.EntityIdFromReference(bvalue[i].bref);
					}
				}
			}
			if(key === 'equipment') {
				for(const [ekey,evalue] of Object.entries(value)) {
					for(var i = 0; i < evalue.length; i++) {
						evalue[i].eqref = EntityId.EntityIdFromReference(evalue[i].eqref);
					}
				}
			}
			if(key === 'owner') {
				data[key] = EntityId.EntityIdFromReference(value);
			}
			if(key === 'proficiencies') {
				const subst = (type) => {
					for(var i = 0; i < value[type].length; i++) {
						 value[type][i].id = EntityId.EntityIdFromReference(value[type][i].id); 
					}
				}
				subst('implements');
				subst('weapons');
				subst('tools');
			}
			if(key === 'background') {
				for(const [ekey,evalue] of Object.entries(value)) {
					value[ekey].bgref = EntityId.EntityIdFromReference(value[ekey].bgref);
				}
			}
		}
		return new Character(eid,data);
	}
}

/**
 * Character repository, manages all character objects in repository
 */
class CharacterRepository extends WriteRepository {

    constructor() {
		super(characterConverter,collections.characters);
    }

	async getCharacterByName(name) {
		return this.findEntity("name",name,"==");
    }
    
    async getCharactersByName(name) {
		return this.findDtos("name",name,"==");
	}
}

export { CharacterRepository };

