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
import { Species } from './species.js';
import { collections } from './schema.js';
import { BaseRepository, EntityId } from './baserepository.js';

const speciesConverter = {
	toFirestore(species) {
		throw new Error("cannot write species to datastore");
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.species,id);
		const data = snapshot.data(options);
		return new Species(eid,data.name,data.size,data.speed,data.vision,data.height,data.weight,data.boons);
	}
}

class SpeciesRepository extends BaseRepository {

    constructor() {
		super(speciesConverter,collections.species);
    }
}

export { SpeciesRepository };