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

import { doc, getDoc, getDocs, setDoc, DocumentReference, collection, query, where, onSnapshot } from 'firebase-firestore';
import { getReference, getDb, schema, eMap } from './schema.js';

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
		const hash = this.hash(collectionName);
		const dm = schema[collectionName];
		this.id = dm.createEntityId(collectionName,hash);
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

	/**
	 * Actually create an entity id, or get an existing
	 * one from the map if it already exists. This insures
	 * that every eid is the same instance for objects
	 * which are themselves the same. Even if 2 copies
	 * of an entity exist in memory, they will share
	 * an EntityId object.
	 */
	static create(collection,idValue) {
		if(!idValue) idValue = crypto.randomUUID();
		const key = `${collection}/${idValue}`;
		let eentry = eMap.get(key);
		let eid = eentry?.id;
		if(!eid) {
			eid = new EntityId(collection,idValue);
			eMap.set(key,{id: eid, count: 1});
		} else {
			eentry.count += 1;
		}
		return eid;
	}

	/**
	 * Deregister use of an EntityId. If the id's refcount becomes zero
	 * then remove the entry. In theory this should result in the dataManager
	 * cleaning up it's reference to the id as well, though this is not
	 * really guaranteed...
	 */	
	static destroy(entityId) {
		const key = entityId.toString();
		let eentry = eMap.get(key);
		if(eentry) {
			if(eentry.count <= 1) {
				eMap.delete(key);
			} else {
				eentry.count += -1;
			}
		}
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

/** 
 * Adapter methods which replicate the data access API of DataManager. This allows us to put readonly repos directly in the
 * schema map since there is no advantage to putting those queries through dataManager.
 */

	/**
	 * Same as searchEntities but conforming to the API of dataManager.
	 */
	async search(search) {
		return this.searchEntities(search.parameters);
	}
	
	async fetchAll() {
		return this.getAllAsync();
	}
	
	async fetchMany(entityIds) {
		return this.entitiesFromIds(entityIds);
	}
	
	async fetch(entityId) {
		return this.entityFromId(entityId);
	}
}

/**
 * This version allows both read and write access. It also allows 
 * for the ability to subscribe a search to a firestore listener.
 */
class WriteRepository extends BaseRepository {
	_subscriptions;
	
	constructor(converter,collectionName) {
		super(converter,collectionName);
		this._subscriptions = {};
	}
	
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

/**
 * The rest of these methods support Firestore snapshot subscriptions, which allow highly efficient
 * registering to watch specific search results in Firestore. This is primarily useful for implementing
 * chat, but potentially has additional uses for collaboration, presence, etc.
 */
	/**
	 * Add a subscription to a particular Firestore result. The search's listener will be invoked
	 * whenever Firestore updates the snapshot.
	 */
	subscribe(search) {
		const shash = search.hash();
		let sub = this._subscriptions[shash];
		if(!sub) {
			sub = {search: search, listeners: [search.listener]};
			this._subscriptions[shash] = sub;
			const cRef = collection(getDb(),this.collectionName);
			const qc = search.parameters.map((param) => where(param.fieldName,param.op,param.fieldValue));
	        const q = query(cRef,...qc).withConverter(this.converter);
	        const unsub = onSnapshot(q, (querySnapshot) => this._onUpdate(querySnapshot,shash));
	        sub.unsub = unsub;
		} else {
			sub.listeners.push(search.listener);
		}
	}
	
	_onUpdate(querySnapshot,searchHash) {
		const messages = [];
		querySnapshot.forEach((doc) => {
			messages.push(doc.data());
		});
		this._notifyListeners(messages,searchHash);
	}

	/**
	 * Remove the specific listener from a subscription to the given search, if it
	 * was subscribed, and unsub() the snapshot if no more listeners remain. 
	 */
	unsubscribe(search) {
		const shash = search.hash();
		const sub = this._subscriptions[shash];
		if(sub) {
			const listeners = sub.listeners.filter((listener) => search.listener !== listener);
			if(listeners.length < 1) {
				sub.unsub();
				delete this._subscriptions[shash];
			}
		}
	}
	
	_notifyListeners(messages,searchHash) {
		const listeners = this._subscriptions[searchHash].listeners;
		listeners.forEach((listener) => { listener(messages); });
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
