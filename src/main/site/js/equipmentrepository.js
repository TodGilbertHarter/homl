/**
 * This software is Copyright (C) 2022 Tod G. Harter. All rights reserved.
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
import { Implement, Weapon, Armor, Equipment, Tool } from './equipment.js';
import { schema } from './schema.js';

const EquipmentConverter = {
	toFirestore(calling) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting equipment and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		if(data.type === 'implement') {
			return new Implement(id,data.name,
				data.cost,data.load, data.hands
				, data.damage,data.ability,data.description);
		} else if(data.type === 'weapon') {
			return new Weapon(id,data.name,data.cost,data.load,data.description,
				data.hands,data.damage,data.ability,data.range,data.category,
				data.weapontype,data.tags);
		} else if(data.type === 'armor') {
			return new Armor(id,data.name,data.cost,data.load,data.description,
				data.dr,data.DEX,data.CON);
		} else if(data.type === 'gear' ) {
			return new Equipment(id,data.name,data.type,data.cost,data.load
				,data.description);
		} else if(data.type === 'tool') {
			return new Tool(id,data.name,data.ability,data.cost,data.load,data.description);
		} else {
			throw new Error("cannot instantiate equipment of type "+data.type);
		}
	}
}

class EquipmentRepository {
	/*
	Equipment repo, this fetches equipment for us from Firebase.
	*/
	/** @private */ gebApp;
    /** @private */ db;

    constructor(gebApp,firestore) {
		this.gebApp = gebApp;
        this.db = firestore;
    }

	/**
	 * Convert a collection of equipment document references into Equipment objects by looking them
	 * up in firestore. This is intended to handle converting lists of callings into Calling objects.
	 *
	 * @param {[docs]} characters an array of character docrefs.
	 * @param {function([Character])} onDataAvailable callback to handle the results.
	 */
/* 	getReferencedCharacters(characters,onDataAvailable) {
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
	} */

	/**
	 * Get equipment by name. Technically multiple equipment with the same name could exist, 
	 * onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */ 
    getEquipmentByName(name,onDataAvailable) {
		const cRef = collection(this.db,schema.equipment);
		var q = query(cRef,where("name", "==", name));
		q = q.withConverter(EquipmentConverter);
		getDocs(q).then((doc) => { 
				console.log("GOT SOME DATA "+doc);
				const results = [];
				doc.forEach((gdata) => {
					results.push(gdata.data());
				});
				onDataAvailable(results); 
			});
	}
    
    getReferencedEquipment(equipmentRef,onDataAvailable) {
		const dr = equipmentRef.withConverter(EquipmentConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such equipment as "+equipmentRef);
			}
		}).catch(e => console.log("Failed to get equipment data "+e.message));
	}
	
	/**
	 * Preload a copy of all the equipment. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allEquipment;
	loadAllEquipment() {
		this.getAllEquipment((docs) => { this.allEquipment = docs; });
		this.notifyListeners(this.allEquipment);
	}
	
	reloadAllEquipment() {
		this.allEquipment = undefined;
		loadAllEquipment();
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allEquipment));
	}
	
	addListener(listener) {
		this.listeners.push(listener);
	}
	
	removeListener(listener) {
		const lidx = this.listeners.indexOf(listener);
		if(lidx > -1) {
			this.listeners.splice(lidx,1);
		}
	}

    /**
     * Gets all available equipment as a list and invokes the given callback when the data is available.
     */
    getAllEquipment(onDataAvailable) {
		if(this.allEquipment !== undefined) {
			onDataAvailable(this.allEquipment);
		}
		var equipmentRef = collection(this.db,schema.equipment);
		equipmentRef = equipmentRef.withConverter(EquipmentConverter);
		getDocs(equipmentRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all equipment "+e.message);
		});
	}
	
	filterByType(type,data) {
		return data.filter((item) => item.type === type).sort(
			(a, b) => {
				const nameA = a.name.toUpperCase(); // ignore upper and lowercase
				const nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
	}
	
    getEquipmentByType(type, onDataAvailable) {
		if(this.allEquipment !== undefined) {
			onDataAvailable(this.filterByType(type,this.allEquipment));
		}
		var equipmentRef = collection(this.db,schema.equipment);
		equipmentRef = equipmentRef.withConverter(EquipmentConverter);
		const q = query(equipmentRef, where("type", "==", type))
		getDocs(q).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all equipment "+e.message);
		});
	}
	
	
    /**
     * Get equipment given its id.
     *
     * @param {string} id Document id of the equipment to get.
     * @Param {function([Equipment])} onDataAvailable data available callback.
     */
	getEquipmentById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,schema.equipment,id);
		getReferencedEquipment(docRef,onDataAvailable);
	}
	
    saveEquipment(equipment) {
        throw new Error("not supported");
    }
}

export { EquipmentRepository };

