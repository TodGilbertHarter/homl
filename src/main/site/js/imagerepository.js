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
import { BaseRepository } from './baserepository.js';
import { schema, getDb, getReference } from './schema.js';

/**
 * Repository for holding references to images and related meta-data.
 */
const imageConverter = {
	toFirestore(image) {
		return {
			id: image.id,
			owner: image.owner,
			description: image.description,
			uri: image.uri
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Image(id,data.owner,data.description,data.uri);
	}
};

/**
 * Image repository. Manages image reference objects in FireStore.
 */
class ImageRepository extends BaseRepository {

    constructor() {
		super(imageConverter,schema.images);
    }

	static GetImageReference(id) {
		return getReference(schema.images,id);
	};
	
	/**
	 * Given aa image reference, call the onSuccess callback when the corresponding image is available
	 * If the imageRef is really an image, then simply call onSuccess immediately.
	 */
	getReferencedImage(imageRef,onSuccess) {
		this.dtoFromReference(imageRef,onSuccess);
	}
	
	getReferencedImages(imageRefs,onSuccess) {
		this.dtosFromReferences(imageRefs,onSuccess);
	}
	
    saveImage(image) {
		this.saveDto(image);
    }
    
    getImageById(imageId,onDataAvailable) {
		var docRef = this.getReference(imageId);
		this.dtoFromReference(docRef,onDataAvailable);
	}

}

export { ImageRepository };

