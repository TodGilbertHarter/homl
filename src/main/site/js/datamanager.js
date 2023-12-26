/**
 * This software is Copyright (C) 2021 Tod G. Harter. All rights reserved.
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
import { produce, enableMapSet, enablePatches } from 'immer';
import { schema } from './schema.js';
import { EntityId } from './baserepository.js';
import { ConversationRepository } from './chat.js';
import { FeatRepository } from './featrepository.js';
import { BoonRepository } from './boonrepository.js';
import { EquipmentRepository } from './equipmentrepository.js';
import { CallingRepository } from './callingrepository.js';
import { SpeciesRepository } from './speciesrepository.js';
import { BackgroundRepository } from './backgroundrepository.js';
import { OriginRepository } from './originrepository.js';
import { PlayerRepository } from './playerrepository.js';
import { GameRepository } from './gamerepository.js';
import { CharacterRepository } from './characterrepository.js';
import { NpcRepository } from './npcrepository.js';
import { ImageRepository } from './imagerepository.js';

enableMapSet();
enablePatches();

const _idMap = new WeakMap();
const _eMap = new Map();


/**
 * Manage the state of all data within a running HoML instance. This
 * also issues all EntityId objects, insuring that every instance of a
 * given entity has the exact same key object. All entity mutating operations
 * are performed within the datamanager, and it is in control of persistence as
 * well.
 * 
 * In order to mutate an entity, a client sends a mutation request. This is a function
 * which can be applied to the entity via Immer, producing a new instance of the
 * object. This new instance will then be reported back as an update to all registered
 * listeners on that instance. 
 * 
 * Only the DataManager talks directly to repositories. When persistence of a given updated
 * state of an entity is required, this will be signalled along with the mutation request. A
 * client can also request registration for updates, or deregistration from updates at the 
 * same time. If a client wants only a static transitory instance of an Entity which does not
 * update, then that can be requested as well. It is still possible to mutate such an entity
 * but the manager might respond with a 'too late to modify' due to the receipt of updates
 * after this detached entity was created.
 * 
 * It is also possible to perform 'rollback' operations on Entities and this allows transactional
 * entity management, but you can only roll back your own changes, and again if something else updated
 * the entity in the meantime, then your transaction will fail. This is oriented entirely towards
 * UI scenarios where you want to prevent conflicting edits and inconsistent state.
 */
class DataManager {
	collectionName;
	repository;
	
	constructor(collectionName,repository) {
		this.collectionName = collectionName;
		this.repository = repository;
		schema[collectionName] = this;
	}
	
	/**
	 * Actually create an entity id, or get an existing
	 * one from the map if it already exists. This insures
	 * that every eid is the same instance for objects
	 * which are themselves the same. Even if 2 copies
	 * of an entity exist in memory, they will share
	 * an EntityId object.
	 */
	createEntityId(collection,idValue) {
		const key = `${collection}/${idValue}`;
		let eid = _eMap.get(key);
		if(!eid) {
			eid = new EntityId(collection,idValue);
			_eMap.set(key,eid);
		}
		return eid;
	}
	
	/**
	 * Apply an update to an entity. all registered listeners will
	 * receive notification of the new entity state, and if the store
	 * flag is true, the entity will be pushed to Firestore.
	 * 
	 * In some cases it may be desirable to register for updates when
	 * updating an entity (generally when the entity is brand new). Passing
	 * a listener as the 4th argument will cause update to perform a
	 * register operation before doing the update.
	 */
	async update(entity,mutator,store,listener) {
		if(listener) {
			this.register(entity,listener);
		}
		const newEntity = produce(entity,mutator);
		const eid = entity.id;
		if(newEntity.id !== eid)
			throw new Error("You cannot mutate an entity id");
		const entry = _idMap.get(eid);
		if(entry) {
			entry.listeners.forEach((listener) => listener(newEntity));
		}
		if(store) {
			await this.repository.saveEntity(newEntity);
		}
		return newEntity;
	}

	/**
	 * Given an entityid fetch the entity from Firestore. If
	 * a listener is provided, and the entity exists, then
	 * register the listener for updates to this entity.
	 * Return the fetched entity.
	 */	
	async fetch(entityId,listener) {
		const entity = _idMap.get(entityId);
		if(!entity) {
			entity = this.repository.entityFromId(entityId);
		}
		if(listener && entity) {
			this.register(entity,listener);
		}
		return entity;
	}
	
	/**
	 * Fetch a number of entities by ids. Note that these need
	 * to be of the same type! You can't just jam random entities
	 * of different kinds in here and get sane results.
	 */
	async fetchMany(entityIds,listener) {
		if(entityIds.length > 0) {
			const entities = await this.repository.entitiesFromIds(entityIds);
			this.registerMany(entities,listener);
			return entities;
		}
		return [];
	}

	async fetchAll(listener) {
		const entities = await this.repository.getAllAsync();
		this.registerMany(entities,listener);
		return entities;
	}
	
	/**
	 * Apply search parameters to the given schema and return
	 * the resulting entities, registering them all with the
	 * listener if it is present. Additionally the search
	 * itself will be registered such that the listener field
	 * within the search object will be called if new results
	 * are produced for the same search hash value. This allows
	 * registration of entire search results.
	 */
	async search(search,listener) {
		const entities = await this.repository.searchEntities(search.parameters);
		this.registerMany(entities,listener);
		this.registerSearch(search);
		return entities;
	}
	
	/**
	 * Register the search itself as a kind of 'entity'.
	 */
	registerSearch(search) {
		if(search.listener)
			this.register(search,search.listener);
	}
	
	/**
	 * Bulk version of register.
	 */
	registerMany(entities,listener) {
		if(listener && entities.length > 0) {
			entities.forEach((entity) => this.register(entity,listener));
		}
	}
	
	/**
	 * Unregister a listener from an entity, or a search. No more notifications will
	 * be sent to the listener.
	 */
	unregister(entityId, listener) {
		const mapEntry = _idMap.get(entityId);
		if(mapEntry) {
			mapEntry.listeners.delete(listener);
			if(mapEntry.listeners.size === 0) {
				_idMap.delete(entityId);
				_eMap.delete(entityId.toString());
			}
		}
	}
	
	/**
	 * Register a listener to listen for updates to an
	 * entity or a search result.
	 */
	register(entity,listener) {
		const eid = entity.id;
		let mapEntry = _idMap.get(eid);
		if(mapEntry) {
			mapEntry.listeners.add(listener);
			return entity;
		} else {
			mapEntry = { entity: entity, listeners: new Set()};
			_idMap.set(entity.id,mapEntry);
			return entity;
		}
	}
}

schema.conversations = new DataManager('conversations',new ConversationRepository());
schema.feats = new DataManager('feats',new FeatRepository());
schema.boons = new DataManager('boons',new BoonRepository());
schema.equipment = new DataManager('equipment', new EquipmentRepository());
schema.callings = new DataManager('callings', new CallingRepository());
schema.species = new DataManager('species',new SpeciesRepository());
schema.backgrounds = new DataManager('backgrounds',new BackgroundRepository());
schema.origins = new DataManager('origins', new OriginRepository());
schema.players = new DataManager('players', new PlayerRepository());
schema.games = new DataManager('games',new GameRepository());
schema.characters = new DataManager('characters', new CharacterRepository());
schema.npcs = new DataManager('npcs', new NpcRepository());
schema.images = new DataManager('images',new ImageRepository());

export { EntityId, DataManager };