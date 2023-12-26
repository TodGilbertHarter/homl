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
import { getReference, getDb, schema } from './schema.js';

/**
 * Passes search criteria into a repository search, and provides
 * a mechanism for identifying a specific search.
 */
class SearchParam {
	fieldValue;
	fieldName;
	op;

	constructor(fieldName,fieldValue,op) {
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
		this.op = op;
	}
}

class Search {
	parameters;
	listener;
	id;
	
	constructor(parameters,collectionName,listener) {
		this.parameters = parameters;
		this.listener = listener;
		this.id = schema[collectionName].createEntityId(schema,this.hash(collectionName));
	}
	
	/**
	 * Construct a fairly decent cheap hash of the parameters.
	 */
	hash(collectionName) {
		const strvals = this.parameters.map((parameter) => { return `${parameter.fieldValue}/${parameter.fieldName}/${parameter.op}` })
		const str = collectionName + strvals.join();
		const seed = 0;
	    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	    for(let i = 0, ch; i < str.length; i++) {
	        ch = str.charCodeAt(i);
	        h1 = Math.imul(h1 ^ ch, 2654435761);
	        h2 = Math.imul(h2 ^ ch, 1597334677);
	    }
	    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	  
	    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
	}
}

/**
 * Represents the identifier within the data store of a given entity.
 * This allows us to do ID comparisons, convert ids back and forth from
 * strings, and to and from Firestore references.
 */
class EntityId {
	collection;
	idValue;

	/**
	 * Build a new Entity Id. WARNING, do not call this
	 * constructor! Call the factory method EntityId.create()
	 * instead! This will insure that every instance of an id
	 * referring to the same entity will always be the same
	 * object. Failure to obey this rule WILL create problems!
	 */	
	constructor(collection,idValue) {
		this.collection = collection;
		if(idValue)
			this.idValue = idValue;
		else
			this.idValue = crypto.randomUUID();
	}

	static create(collection,idValue) {
		return schema[collection].createEntityId(collection,idValue);
	}

	/**
	 * Return the FireStore reference pointing to this entity in the data store.
	 */	
	getReference() {
		return getReference(this.collection,this.idValue);
	}

	/**
	 * Construct the string representation of this id, useful for passing
	 * around in HTML attributes. In this form it can be easily remade as an object.
	 */	
	toString() {
		return `${this.collection}/${this.idValue}`
	}
	
	/**
	 * Factory method to create a new EntityId object from its
	 * string representation.
	 */
	static EntityIdFromString(refString) {
		var parts = refString.split('/');
		return EntityId.create(parts[0],parts[1]);
	}
	
	/**
	 * Construct an EntityId from a Firestore reference.
	 */
	static EntityIdFromReference(reference) {
		var parts = reference.path.split('/');
		return EntityId.create(parts[0],parts[1]);
	}
}

/** Used by Lit to allow us to automagically convert to/from attributes. */
const IdConverter = {
	fromAttribute: (value, type) => {
		return EntityId.EntityIdFromString(value);
	},
	toAttribute: (value, type) => {
		return value.ToString();
	}
}

/**
 * A usable set of Entity Ids, since the built-in ES6 Set is basically worthless...
 * Note that, aside from the equality comparison this should closely emulate native Set
 * in most respects, though I'm sure it is a bit less performant.
 */
class IdSet {
	contents;
	
	constructor(ids) {
		ids ? this.contents = new Map(ids.map(eid => [eid.toString(), eid])) : new Map();
	}
	
	add(eid) {
		return this.contents.add(eid.toString(), eid);
	}
	
	delete(eid) {
		return this.contents.delete(eid.toString());
	}
	
	get(idStr) {
		return this.contents.get(idStr);
	}
	
	has(eid) {
		return this.contents.has(eid.toString());
	}
	
	clear() {
		return this.contents.clear();
	}
	
	get size() {
		return this.contents.size;
	}
	
	forEach(lambda) {
		this.contents.forEach((key,value) => lambda(value,value));
	}
	
	keys() {
		return this.contents.values();
	}
	
	entries() {
		return this.contents.map((key,value) => [value, value]);
	}
	
	values() {
		return this.contents.values();
	}
}

/**
 * Base class for all HoML entities.
 */
class Entity {
	id;
	
	constructor(id) {
		if(!id) throw new Error("Every entity must have an id");
		this.id = id;
	}
	
	getReference() {
		return this.id.getReference();
	}
	
	toString() {
		return this.id.toString();
	}
	
	get collection() {
		return this.id.collection;
	}
}

/**
 * Base repository class for FireStore repositories. This gives us just
 * the ability to read data and handle the converter specific to the
 * entity class stored here.
 */
class BaseRepository {
	converter;
	collectionName;
	
	constructor(converter,collectionName) {
		this.converter = converter;
		this.collectionName = collectionName;
	}

	async entityFromId(eid) {
		const ref = eid.getReference();
		return this._entityFromReferenceAsync(ref);
	}

	/**
	 * Return a group of entities given a list of ids.
	 */
	async entitiesFromIds(ids) {
		const refs = ids.map((id) => id.getReference());
		return new Promise((resolve) => {
			this._entitiesFromReferences(refs,resolve);
		});
	}
	
	/**
	 * Do a simple search for a DTO on the named field, compared with the named value, using the named op
	 * and call the given callbacks on success or failure. This should cover a large percentage of all 
	 * basic database queries.
	 */
	async findEntity(fieldName,fieldValue,op) {
        const ref = collection(getDb(),this.collectionName);
        const q = query(ref,where(fieldName, op, fieldValue)).withConverter(this.converter);
        return await getDocs(q);
	}
	
	/**
	 * Find entities based on a single simple where condition.  
	 */				
	async findEntities(fieldName,fieldValue,op) {
		const cRef = collection(getDb(),this.collectionName);
        const q = query(cRef,where(fieldName, op, fieldValue)).withConverter(this.converter);
		const doc = await getDocs(q);
		const results = [];
		doc.forEach((gdata) => {
			results.push(gdata.data());
		});
		return results;
	}
	
	/**
	 * Do a search for entities using a complex where clause.
	 */
	async searchEntities(params) {
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
	 * This will return every entity in the entire Firestore collection. It
	 * is pretty useful for smaller collections containing a limited number
	 * of objects, like callings, but open-ended collections like players will
	 * override this with a 'not implemented' to prevent catastrophic bad
	 * things from happening.
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
	 * This is a better version, it includes a (possibly blank) search
	 * criteria, a field to order by, a (again possibly blank) starting record,
	 * and a page size.
	 */
	
	async getPaged(params,sort,start,size) {
		const cRef = collection(getDb(),this.collectionName);
		const qc = params.map((param) => where(param.fieldName,param.op,param.fieldValue));
		let q = undefined;
		if(start) {
			const startDao = toDao(start);
	        q = query(cRef,...qc,orderBy(sort),limit(size),startAfter(startDao)).withConverter(this.converter);
	    } else {
	        q = query(cRef,...qc,orderBy(sort),limit(size)).withConverter(this.converter);
	    }
		const doc = await getDocs(q);
		const results = [];
		doc.forEach((gdata) => {
			results.push(gdata.data());
		});
	}
	
	/**
	 * Given an array of references, get the associated
	 * dtos and call onSuccess when they are all available.
	 */
	_entitiesFromReferences(refs,onSuccess) {
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
	
	/**
	 * Async version of getting a DTO from a reference.
	 */
	async _entityFromReferenceAsync(ref) {
		if(!(ref instanceof DocumentReference)) {
			return ref; // it is already a DTO or something else, just return it.
		}
		var dr = ref.withConverter(this.converter);
		var entity = await getDoc(dr);
		return entity.data();
	}
	
	/**
	 * Use the repository's converter to convert an entity into
	 * a Firestore DAO.
	 */	
	toDao(entity) {
		return this.converter.toFirestore(entity);
	}

	/**
	 * Convert from a FireStore DAO into an entity using the
	 * repository's converter.
	 */	
	toEntity(dao) {
		return this.converter.fromFirestore(dao);
	}
}

/**
 * This version allows both read and write access.
 */
class WriteRepository extends BaseRepository {
	
	/**
	 * Save an Entity into the repository async.
	 */
    async saveEntity(entity) {
        console.log("Saving data of "+JSON.stringify(entity));
        if(entity.id === undefined || entity.id === null) {
			entity.id = crypto.randomUUID();
		}
		const idStr = entity.id.idValue;
        await setDoc(doc(getDb(),this.collectionName,idStr).withConverter(this.converter),entity);
        return entity.id;
    }
}

/**
 * Given a list of EntityIds, return a list of references.
 */
function ToReferences(list) {
	const drs = list.map(idable => idable.getReference());
	return drs;
}

export { BaseRepository, ToReferences, EntityId, IdConverter, Entity, IdSet, WriteRepository, SearchParam, Search };
