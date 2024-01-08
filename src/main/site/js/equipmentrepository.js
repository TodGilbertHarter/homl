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
import { Implement, Weapon, Armor, Equipment, Tool } from './equipment.js';
import { collections } from './schema.js';
import { EntityId, BaseRepository } from './baserepository.js';

const EquipmentConverter = {
	toFirestore(equipment) {
		throw Error("Uploading equipment is not supported")
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.equipment,id);
		const data = snapshot.data(options);
		if(data.type === 'implement') {
			return new Implement(eid,data.name,
				data.cost,data.load, data.hands
				, data.damage,data.ability,data.description);
		} else if(data.type === 'weapon') {
			return new Weapon(eid,data.name,data.cost,data.load,data.description,
				data.hands,data.damage,data.ability,data.range,data.category,
				data.weapontype,data.tags);
		} else if(data.type === 'armor') {
			return new Armor(eid,data.name,data.cost,data.load,data.description,
				data.dr,data.DEX,data.CON);
		} else if(data.type === 'gear' ) {
			return new Equipment(eid,data.name,data.type,data.cost,data.load
				,data.description);
		} else if(data.type === 'tool') {
			return new Tool(eid,data.name,data.ability,data.cost,data.load,data.description);
		} else {
			throw new Error("cannot instantiate equipment of type "+data.type);
		}
	}
}

/**
* Equipment repo, this fetches equipment for us from Firebase.
*/
class EquipmentRepository extends BaseRepository {

    constructor() {
		super(EquipmentConverter,collections.equipment);
    }

	/**
	 * Get equipment by name. Technically multiple equipment with the same name could exist, 
	 * onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */ 
    async getEquipmentByName(name) {
		return this.findEntity("name",name,"==");
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
	
    async getEquipmentByType(type) {
		return this.findEntities("type",type,"==");
	}
}

export { EquipmentRepository };