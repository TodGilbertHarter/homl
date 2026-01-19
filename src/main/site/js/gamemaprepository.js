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
import { GameMap } from './gamemap.js';
import { BaseRepository, EntityId } from './baserepository.js';
import { collections } from './schema.js';

/**
 * Repository for holding references to game maps and related meta-data.
 */
const gameMapConverter = {
	toFirestore(gmap) {
		return {
			owner: gmap.owner,
			description: gmap.description,
			components: gmap.components,
			version: 1.0
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.maps,id);
		const data = snapshot.data(options);
		return new GameMap(eid,data.owner,data.description,data.components);
	}
};

/**
 * Image repository. Manages image reference objects in FireStore.
 */
class GameMapRepository extends BaseRepository {

    constructor() {
		super(gameMapConverter,collections.maps);
    }

}

export { GameMapRepository };

