/**
 * This software is Copyright (C) 2022 Tod G. Harter. All rights reserved.
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

/*
 * Represents a HoML calling. It contains the rules calculator(s) for doing basic character calculations
 * related to the calling itself, along with things like choosers which allow for selecting of calling-related
 * options during chargen, etc.
 */
import { Calculation } from "./rules.js";

class Calling {
	id;
	name;
	features = [];
	hitPoints;
	damageDie;
	role;
	powerSource;
	weaponProfs = [];
	implementProfs = [];
	proficiencies = { knacks: {}, tools: [], other: []};
	startingHitPoints;
	boons = [];
	
	constructor(id,name,features,hitPoints,damageDie,role,powerSource,weaponProfs
			,implementProfs,proficiencies,startingHitPoints,boons) {
		this.id = id;
		this.name = name;
		if(features !== 'undefined') {
			this.features = features; 
		}
		this.hitPoints = hitPoints;
		this.damageDie = damageDie;
		this.role = role;
		this.powerSource = powerSource;
		if(weaponProfs !== 'undefined') {
			this.weaponProfs = weaponProfs
		}
		if(implementProfs !== 'undefined') {
			this.implementProfs = implementProfs;
		}
		if(typeof proficiencies !== 'undefined') {
			this.proficiencies = proficiencies;
		}
		this.startingHitPoints = startingHitPoints;
		if(typeof boons !== 'undefined') {
			this.boons = {};
		}
	}
	
	/**
	 * Construct and return all the calling-associated calculators related to this calling.
	 */
	get calculators() {
		const calculators = [];
		calculators.push(new Calculation(
			'hitpoints',
			['calling','level','constitutionbonus'],
			(character) => {
				character.derivedData.maxHitPoints = character.level * this.hitPoints + this.startingHitPoints + character.constitution;
			}
		));
		return calculators;
	}
 }

export { Calling };
