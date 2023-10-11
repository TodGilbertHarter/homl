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

/* base class for all types of HoML equipment */
class Equipment {
	id;
	name;
	type;
	cost;
	load;
	description;
	
	constructor(id,name,type,cost,load,description) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.cost = cost;
		this.load = load;
		this.description = description;
	}
}

class Implement extends Equipment {
	hands;
	damage;
	ability;
	
	constructor(id,name,cost,load,hands,damage,ability,description) {
		super(id,name,'implement',cost,load,description);
		this.hands = hands;
		this.damage = damage;
		this.ability = ability;
	}
}

class Weapon extends Equipment {
	hands;
	damage;
	ability;
	range;
	category;
	weapontype;
	tags;
	
	constructor(id,name,cost,load,description,hands,damage,ability,range
		,category,weapontype,tags) {
		super(id,name,'weapon',cost,load,description);
		this.hands = hands;
		this.damage = damage;
		this.ability = ability;
		this.range = range;
		this.category = category;
		this.weapontype = weapontype;
		this.tags = tags;
	}
}

export { Implement, Weapon };