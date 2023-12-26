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
import { getReference, collections } from './schema.js';
import { Entity, EntityId } from './baserepository.js';
import { immerable } from 'immer';

class Game extends Entity {
	[immerable] = true;
	name;
	owner;
	characters;
	players;
	npcs;
	description;
	threads;
	
	constructor(id, name, owner, characters, players, npcs, description, threads, images) {
		super(id ? id : EntityId.create(collections.games));
		this.name = name;
		this.owner = owner;
		this.characters = characters;
		this.players = players;
		this.npcs = npcs;
		this.description = description;
		this.threads = threads;
		this.images = images;
		if(this.characters === undefined || this.characters === null) { this.characters = []; }
		if(this.players === undefined || this.players === null) { this.players = []; }
		if(this.npcs === undefined || this.npcs === null) { this.npcs = []; }
		if(this.threads === undefined || this.threads === null) {this.threads = []}
		if(this.images === undefined || this.images === null) {this.images = []}
	}
	
	toString() {
		return this.name + ", owner "+ this.owner;
	}
	
	/**
	 * Get a list of characters
	 * @param {function([Character])} onDataAvailable handler to process the data when it is returned.
	 */
	getCharacters(onDataAvailable) {
		window.gebApp.controller.getCharactersByIds(this.characters,onDataAvailable);
	}
	
	/**
	 * Add a character, insuring that no character is added more than once.
	 */
	addCharacter(id) {
		this.characters = this.characters.filter((c) => c.id !== id);
		const cref = getReference(schema.characters,id);
		this.characters.push(cref);
	}
	
	addImage(id) {
		this.images = this.images.filter((c) => c.id !== id);
		const cref = getReference(schema.images,id);
		this.images.push(cref);
	}
}

export { Game };