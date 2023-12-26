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
import { Background } from './background.js';
import { BaseRepository } from './baserepository.js';
import { collections } from './schema.js';

const backgroundConverter = {
	toFirestore(background) {
		throw new Error("operation not supported");
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.backgrounds,id);
		const data = snapshot.data(options);
		return new Background(eid,data.type,
			data.name,data.description,data.boons,data.knacks);
	}
}

class BackgroundRepository extends BaseRepository {

    constructor() {
		super(backgroundConverter,collections.backgrounds);
    }

	/**
	 * Get a background by name. Technically multiple backgrounds with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getBackgroundByName(name,onDataAvailable) {
		this.findDto("name",name,"==",onDataAvailable,(e) => {`Failed to get background ${name}: ${e.message}`});
    }
    
	/**
	 * Call onDataAvailable passing a structure where each type is a key and all the backgrounds of that type are contained in a hash
	 * keyed on the name of each background.
	 */
	async getCategorizedBackgrounds() {
		const backgrounds = await this.getAllAsync()
		var result = {};
		backgrounds.forEach((background) => {
			if(typeof result[background.type] === 'undefined') {
				result[background.type] = {};
			}
			result[background.type][background.name] = background;
		});
		return result;
	}
}

export { BackgroundRepository };

