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
  * Model for boons.
  */
class Boon {
	id;
	name;
	source;
	level;
	type;
	association;
	description;
	benefits;
	disadvantages;
	restrictions;
		
	constructor(id,name,source,level,type,association,description,benefits,disadvantages,restrictions,manifestation) {
		this.id = id;
		this.name = name;
		this.source = source;
		this.level = level;
		this.type = type;
		this.association = association;
		this.description = description;
		this.benefits = benefits;
		this.disadvantages = disadvantages;
		this.restrictions = restrictions;
		this.manifestation = manifestation;
	}
	
	/**
	 * Construct and return all the boon-associated calculators related to this boon.
	 */
	get calculators() {
		const calculators = [];
		//TODO: make some calculators for boons
		return calculators;
	}
}
export { Boon };
