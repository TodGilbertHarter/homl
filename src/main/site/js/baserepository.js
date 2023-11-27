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

import { doc, getDoc, getDocs, setDoc, DocumentReference, collection, query, where } from 'firebase-firestore';
import { getReference, getDb } from './schema.js';

/**
 * Base repository class for FireStore repositories.
 */
class BaseRepository {
	converter;
	collectionName;
	
	constructor(converter,collectionName) {
		this.converter = converter;
		this.collectionName = collectionName;
	}

	/**
	 * Given an object id, return a document reference to
	 * the object.
	 */
	getReference(id) {
		return getReference(this.collectionName,id);
	}

	/**
	 * Given an entity return a reference to it.
	 */
	getReferenceFromEntity(entity) {
		return this.getReference(entity.id);
	}
	
	/**
	 * Look up a FireStore document entity given a FireStore document reference.
	 */
	entityFromReference(ref,onSuccess) {
		if(!(ref instanceof DocumentReference)) {
			onSuccess(ref); // Because it is actually an entity, not a ref!
		} else {
			getDoc(ref).then((dto) => { 
				onSuccess(dto);
			});
		}
	}

	/**
	 * Look up an entity based on a reference and use this repo's converter
	 * to convert it into a dto, and call back to onSuccess.
	 */	
	dtoFromReference(ref,onSuccess) {
		if(!(ref instanceof DocumentReference)) {
			onSuccess(ref); // Because it is actually an entity, not a ref!
		} else {
			var dr = ref.withConverter(this.converter);
			getDoc(dr).then((dto) => { 
				onSuccess(dto.data()); 
			});
		}
	}

	/**
	 * Async version of getting a DTO from a reference.
	 */
	async dtoFromReferenceAsync(ref) {
		if(!(ref instanceof DocumentReference)) {
			return ref; // it is already a DTO or something else, just return it.
		}
		var dr = ref.withConverter(this.converter);
		var entity = await getDoc(dr);
		return entity.data();
	}
	
	/**
	 * Given an array of references, get the associated
	 * dtos and call onSuccess when they are all available.
	 */
	dtosFromReferences(refs,onSuccess) {
		const results = [];
		refs.forEach((docRef) => {
			const dr = docRef.withConverter(this.converter);
			const cp = getDoc(dr);
			results.push(cp);
		});
		Promise.all(results).then((carry) => {
			const res = [];
			carry.forEach((doc) => { 
				res.push(doc.data()); 
			});
			console.debug("Returning DTOs: count is: "+res.length);
			onSuccess(res); 
		});
		
	}

    async saveDto(dto) {
        console.log("Saving data of "+JSON.stringify(dto));
        if(dto.id === undefined || dto.id === null) {
			dto.id = crypto.randomUUID();
		}
        await setDoc(doc(getDb(),this.collectionName,dto.id).withConverter(this.converter),dto);
        return dto.id;
    }

	/**
	 * Do a simple search for a DTO on the named field, compared with the named value, using the named op
	 * and call the given callbacks on success or failure. This should cover a large percentage of all 
	 * basic database queries. onDataAvailable will be called once for each result if there are more than
	 * one matches.
	 */
	findDto(fieldName,fieldValue,op,onDataAvailable,onFailure) {
        const ref = collection(getDb(),this.collectionName);
        const q = query(ref,where(fieldName, op, fieldValue)).withConverter(this.converter);
        getDocs(q).then((doc) => { 
            doc.forEach(r => { 
                var data = r.data();
                onDataAvailable(data);
            } ) }).catch((e) => {
				console.trace(e);
				onFailure(e.message);
			});
	}
	
	/**
	 * This is similar to findDto but calls onDataAvailable once with an
	 * array of results.
	 */
	findDtos(fieldName,fieldValue,op,onDataAvailable,onFailure) {
		const cRef = collection(getDb(),this.collectionName);
        const q = query(cRef,where(fieldName, op, fieldValue)).withConverter(this.converter);
		getDocs(q).then((doc) => { 
			const results = [];
			doc.forEach((gdata) => {
				results.push(gdata.data());
			});
			onDataAvailable(results); 
		}).catch((e) => {
			console.trace(e);
			onFailure(e.message);
		});
	}
				
	async findDtosAsync(fieldName,fieldValue,op) {
		const cRef = collection(getDb(),this.collectionName);
        const q = query(cRef,where(fieldName, op, fieldValue)).withConverter(this.converter);
		const doc = await getDocs(q);
		const results = [];
		doc.forEach((gdata) => {
			results.push(gdata.data());
		});
		return results;
	}
	
	async searchDtos(params) {
		const cRef = collection(getDb(),this.collectionName);
		const qc = params.map((param) => where(param.fieldName,param.op,param.fieldValue));
        const q = query(cRef,...qc).withConverter(this.converter);
		const doc = await getDocs(q);
		const results = [];
		doc.forEach((gdata) => {
			results.push(gdata.data());
		});
		return results;
	}
	
	/**
	 * Careful with this! It will do a full table scan of the collection.
	 */
	async getAllAsync() {
		var coll = collection(getDb(),this.collectionName);
		coll = coll.withConverter(this.converter);
		const docs = [];
		const results = await getDocs(coll);
		results.forEach(r => docs.push(r.data()));
		return docs;
	}
	
	/**
	 * Use the repository's converter to convert a DTO back into
	 * a FireStore entity.
	 */	
	toEntity(dto) {
		return this.converter.toFirestore(dto);
	}

	/**
	 * Convert from a FireStore entity into a DTO using the
	 * repository's converter.
	 */	
	fromEntity(entity) {
		return this.converter.fromFirestore(entity);
	}
}

/**
 * Utility to take an array which contains any set of objects
 * which have an id property referencing the id of a FireStore
 * object in the given schema and return a corresponding array
 * of only docRefs.
 */
function ToReferences(schema,list) {
	const drs = list.map(idable => getReference(schema,idable.id));
	return drs;
}

export { BaseRepository, ToReferences };
