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
import { getReference, schema } from './schema.js';

class Game {
	id;
	name;
	owner;
	characters;
	players;
	description;
	
	constructor(id, name, owner, characters, players, description) {
		this.id = id;
		this.name = name;
		this.owner = owner;
		this.characters = characters;
		this.players = players;
		this.description = description;
		if(this.characters === undefined || this.characters === null) { this.characters = []; }
		if(this.players === undefined || this.players === null) { this.players = []; }
	}
	
	toString() {
		return this.name + ", owner "+ this.owner;
	}
	
	/**
	 * Get a list of characters
	 * @param {function([Character])} onDataAvailable handler to process the data when it is returned.
	 */
	getCharacters(onDataAvailable) {
		return window.gebApp.characterRepo.getReferencedCharacters(this.characters,onDataAvailable);
	}
	
	/**
	 * Add a character, insuring that no character is added more than once.
	 */
	addCharacter(id) {
		this.characters = this.characters.filter((c) => c.id !== id);
		const cref = getReference(schema.characters,id);
		this.characters.push(cref);
	}
}

export { Game };