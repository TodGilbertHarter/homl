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
import { collection, doc, setDoc, addDoc, query, where, getDocs, getDoc, DocumentReference } from 'firebase-firestore';
import { Player } from './player.js';
import { BaseRepository } from './baserepository.js';
import { schema, getDb, getReference } from './schema.js';
import { Npc } from './npc.js';

const npcConverter = {
	toFirestore(npc) {
		return {
			id: npc.id,
			name: npc.name,
			statblock: npc.statblock,
			Major: npc.major,
			Move: npc.move,
			Stats: npc.stats,
			fort: npc.fort,
			hitpoints: npc.hitpoints,
			immunity: npc.immunity,
			initiative: npc.initiative,
			level: npc.level,
			power: npc.power,
			protection: npc.protection,
			ref: npc.ref,
			role: npc.role,
			size: npc.size,
			tags: npc.tags,
			vulnerability: npc.vulnerability,
			will: npc.will
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Npc(id, data.name, data.statblock, data.Major, data.Move, data.Stats, data.fort, 	
			data.hitpoints, data.immunity, data.initiative, data.level, data.power, data.protection, 
			data.ref, data.role, data.size, data.tags, data.vulnerability, data.will);
	}
};

/**
 * NPC repository. Manages Npc objects in FireStore.
 */
class NpcRepository extends BaseRepository {

    constructor() {
		super(npcConverter,schema.npcs);
    }

	static GetNpcReference(id) {
		return getReference(schema.npcs,id);
	};
	
	/**
	 * Given an npc reference, call the onSuccess callback when the corresponding npc is available
	 * If the npcRef is really an npc, then simply call onSuccess immediately.
	 */
	getReferencedNpc(npcRef,onSuccess) {
		this.dtoFromReference(npcRef,onSuccess);
	}
	
	getReferencedNpcs(npcRefs,onSuccess) {
		this.dtosFromReferences(npcRefs,onSuccess);
	}
	
    getNpcByName(name,onDataAvailable, onFailure) {
		this.findDto("name",name,"==",onDataAvailable,onFailure);
    }
    
    saveNpc(npc) {
		this.saveDto(npc);
    }
    
    getNpcById(npcId,onDataAvailable) {
		var docRef = this.getReference(npcId);
		this.dtoFromReference(docRef,onDataAvailable);
	}

}

export { NpcRepository };
