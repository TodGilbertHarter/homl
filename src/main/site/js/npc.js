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

import { EntityId, Entity } from './baserepository.js';
import { collections } from './schema.js';

/**
 * Non-player character (monster, etc.) DTO definition.
 */
class Npc extends Entity {
	name;
	statblock;
	major;
	move;
	stats;
	fort;
	hitpoints;
	immunity;
	initiative;
	level;
	power;
	protection;
	ref;
	role;
	size;
	tags;
	vulnerability;
	will;
	
	constructor(id, name, statblock,major,move,stats,fort,hitpoints,immunity,initiative,level,power,protection,ref,role,size,tags,vulnerability,will) {
		super(id ? id : EntityId.create(collections.npcs));
		this.name = name;
		this.statblock = statblock;
		this.major = major;
		this.move = move;
		this.stats = stats;
		this.fort = fort;
		this.hitpoints = hitpoints;
		this.immunity = immunity;
		this.initiative = initiative;
		this.level = level;
		this.power = power;
		this.protection = protection;
		this.ref = ref;
		this.role = role;
		this.size = size;
		this.tags = tags;
		this.vulnerability = vulnerability;
		this.will = will;
	}
	
}

export { Npc };