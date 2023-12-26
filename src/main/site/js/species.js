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
import { Entity, EntityId } from './baserepository.js';
import { collections } from './schema.js';

class Species extends Entity {
	name;
	size;
	speed;
	vision;
	averageHeight;
	averageWeight;
	boons;
	
	constructor(id,name,size,speed,vision,height,weight,boons) {
		super(id ? id : EntityId.create(collections.species));
		this.name = name;
		this.size = size;
		this.speed = speed;
		this.vision = vision;
		this.height = height;
		this.weight = weight;
		if(typeof boons !== 'undefined') {
			this.boons = {};
		}
	}
	
	/**
	 * Construct and return all the species-associated calculators related to this species.
	 */
	get calculators() {
		const calculators = [];
		calculators.push(new Calculation(
			'size',
			['species'],
			(character) => {
				character.derivedData.size = this.size;
			}
		));
		calculators.push(new Calculation('vision',['species'],
			(character) => {
				character.derivedData.vision = this.vision;
		}));
		calculators.push(new Calculation('speed',['species'],(character) => {
			character.derivedData.speed = this.speed;	
		}));
		return calculators;
	}
 }

export { Species };
