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
import { Origin } from './origin.js';
import { collections } from './schema.js';
import { BaseRepository, EntityId } from './baserepository.js';

const originConverter = {
	toFirestore(origin) {
		throw new Error("cannot save an origin to repository");
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.origins,id);
		const data = snapshot.data(options);
		const features = data.features.map((feature) => EntityId.EntityIdFromReference(feature));
		return new Origin(eid,data.backgrounds,data.name,data.description,data.boons,features,data.implements,data.knacks,data.weapons);
	}
}

class OriginRepository extends BaseRepository {

    constructor() {
		super(originConverter,collections.origins);
    }
}

export { OriginRepository };

