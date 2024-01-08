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
import { Boon } from './boon.js';
import { collections } from './schema.js';
import { BaseRepository, EntityId } from './baserepository.js';

const boonConverter = {
	toFirestore(boon) {
		throw new Error("writing boons to the datastore is not supported")
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.boons,id);
		const data = snapshot.data(options);
		const benefits = data.benefits.map((benefit) => { return typeof benefit === 'string' ? benefit : EntityId.EntityIdFromReference(benefit)});
		return new Boon(eid,data.name,data.source,data.level,data.type,data.association,data.description,benefits
			,data.disadvantages,data.restrictions,data.manifestation);
	}
}

class BoonRepository extends BaseRepository {

    constructor() {
		super(boonConverter,collections.boons);
    }

	/**
	 * Get a boon by name. Technically multiple boons with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getBoonByName(name) {
		return this.findEntity("name",name,"==");
    }
	
}

export { BoonRepository };

