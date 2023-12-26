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

/**
  * Model for a background.
  */
import { Entity, EntityId } from "./baserepository.js";
import { schema } from './schema.js';

class Background extends Entity {
	type;
	name;
	text;
	boons;
	knacks;
		
	constructor(id,type,name,text,boons,knacks) {
		super(id ? id : EntityId.create(collection.backgrounds));
		this.type = type;
		this.name = name;
		this.text = text;
		this.boons = boons;
		this.knacks = knacks;
	}
	
	/**
	 * Construct and return all the background-associated calculators related to this background.
	 */
	get calculators() {
		const calculators = [];
		//TODO: make some calculators for background
		return calculators;
	}
}
export { Background };
