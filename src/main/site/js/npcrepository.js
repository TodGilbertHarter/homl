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
import { BaseRepository, EntityId } from './baserepository.js';
import { collections } from './schema.js';
import { Npc } from './npc.js';

const npcConverter = {
	toFirestore(npc) {
		return {
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
			will: npc.will,
			version: 1.0
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.npcs,id);
		const data = snapshot.data(options);
		return new Npc(eid, data.name, data.statblock, data.Major, data.Move, data.Stats, data.fort, 	
			data.hitpoints, data.immunity, data.initiative, data.level, data.power, data.protection, 
			data.ref, data.role, data.size, data.tags, data.vulnerability, data.will);
	}
};

/**
 * NPC repository. Manages Npc objects in FireStore.
 */
class NpcRepository extends BaseRepository {

    constructor() {
		super(npcConverter,collections.npcs);
    }

    async getNpcByName(name) {
		return this.findDto("name",name,"==");
    }
    
}

export { NpcRepository };
