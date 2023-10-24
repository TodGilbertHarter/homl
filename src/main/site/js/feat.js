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
  * Model for feats.
  */
class Feat {
	id;
	name;
	source;
	level;
	origin;
	tags;
	tier;
	effects;
	costs;
	components;
	action;
	attack;
	completesuccess;
	enhancedsuccess;
	success;
	failure;
	flavortext;
	special;
	success;
	typetarget;
	trigger;
	check;
	defense;
	duration;
	requirements;
		
	constructor(id,name,source,level,origin,tags,tier,effects,costs,components,action,attack,completesuccess,enhancedsuccess,success,failure,
	flavortext,special,typetarget,trigger,check,defense,duration,requirements) {
		this.id = id;
		this.name = name;
		this.source = source;
		this.level = level;
		this.origin = origin;
		this.tags = tags;
		this.tier = tier;
		this.effects = effects;
		this.costs = costs;
		this.components = components;
		this.action = action;
		this.attack = attack;
		this.completesuccess = completesuccess;
		this.enhancedsuccess = enhancedsuccess;
		this.success = success;
		this.failure = failure;
		this.flavortext = flavortext;
		this.special = special;
		this.typetarget = typetarget;
		this.trigger = trigger;
		this.check = check;
		this.defense = defense;
		this.duration = duration;
		this.requirements = requirements;
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
export { Feat };
