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
class Player {
	id;
	email;
	loggedIn;
	characters;
	handle;
	
	constructor(id, email, loggedIn, characters, handle) {
		this.id = id;
		this.email = email;
		this.loggedIn = loggedIn;
		this.characters = characters === undefined ? [] : characters;
		this.handle = handle;
	}
	
	toString() {
		return this.email;
	}
	
	/**
	 * Get a list of characters
	 * @param {function([Character])} onDataAvailable handler to process the data when it is returned.
	 */
	getCharacters(onDataAvailable) {
		return window.gebApp.characterRepo.getReferencedCharacters(this.characters,onDataAvailable);
	}
}

export { Player };