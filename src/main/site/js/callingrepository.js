/**
 * This software is Copyright (C) 2023 Tod G. Harter. All rights reserved.
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
import { Calling } from './calling.js';
import { collections } from './schema.js';
import { BaseRepository, EntityId } from './baserepository.js';

const callingConverter = {
	toFirestore(calling) {
		throw new Error("Callings do not support writing");
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.callings,id);
		const data = snapshot.data(options);
		return new Calling(eid,data.name,
			data.features,data.hitPoints,data.damageDie, data.role
			, data.powerSource,data.weaponProfs,data.implementProfs 
			, data.proficiencies
			, data.startingHitPoints,data.boons);
	}
}

/**
 * Calling repo, this fetches callings for us from Firebase.
 */
class CallingRepository extends BaseRepository {

    constructor() {
		super(callingConverter,'callings');
    }
}

export { CallingRepository };

