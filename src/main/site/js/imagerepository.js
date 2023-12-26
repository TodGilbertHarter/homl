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
import { Image } from './image.js';
import { BaseRepository, EntityId } from './baserepository.js';
import { collections } from './schema.js';

/**
 * Repository for holding references to images and related meta-data.
 */
const imageConverter = {
	toFirestore(image) {
		return {
			owner: image.owner,
			description: image.description,
			uri: image.uri,
			version: 1.0
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.images,id);
		const data = snapshot.data(options);
		return new Image(eid,data.owner,data.description,data.uri);
	}
};

/**
 * Image repository. Manages image reference objects in FireStore.
 */
class ImageRepository extends BaseRepository {

    constructor() {
		super(imageConverter,collections.images);
    }

}

export { ImageRepository };

