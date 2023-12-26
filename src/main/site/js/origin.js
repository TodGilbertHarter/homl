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

import { Entity, EntityId } from './baserepository.js';
import { collections } from './schema.js';

/**
  * Model for a heroic origin.
  */
class Origin extends Entity {
	backgrounds;
	name;
	description;
	boons;
	features;
	implements;
	knacks;
	weapons;
		
	constructor(id,backgrounds,name,description,boons,features,implementProfs,knacks,weaponProfs) {
		super(id ? id : EntityId.create(collections.origins));
		this.backgrounds = backgrounds;
		this.name = name;
		this.description = description;
		this.boons = boons;
		this.features = features;
		this.implementProfs = implementProfs;
		this.knacks = knacks;
		this.weaponProfs = weaponProfs;
	}
	
	/**
	 * Construct and return all the origin-associated calculators related to this origin.
	 */
	get calculators() {
		const calculators = [];
		//TODO: make some calculators for origin
		return calculators;
	}
}
export { Origin };
