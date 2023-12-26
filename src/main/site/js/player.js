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
import { MacroSet } from './macros.js';
import { Entity, EntityId } from './baserepository.js';
import { collections } from './schema.js';
import { immerable } from 'immer';

class Player extends Entity {
	[immerable] = true;
	uid;
	loggedIn;
	owned;
	handle;
	bookMarks;
	macroset;
	
	constructor(id, uid, loggedIn, owned, handle, bookMarks, macroset) {
		super(id ? id : EntityId.create(collections.players));
		this.uid = uid;
		this.loggedIn = loggedIn;
		this.owned = owned === undefined ? [] : owned;
		this.handle = handle;
		this.bookMarks = bookMarks === undefined ? [] : bookMarks;
		this.macroset = macroset === undefined ? new MacroSet(null,id,[],`${this.handle} macros`,`player macros for ${this.handle}`) : macroset;
	}
	
	toString() {
		return this.handle;
	}

	/**
	 * Add a new owned item to the player while insuring that no duplicates are added.
	 */
	addOwned(newItem) {
		const filtered =  this.owned.filter(item => !(item.id === newItem.id && item.schema === newItem.schema));
		filtered.push(newItem);
		this.owned = filtered;
	}
	
	/**
	 * Remove the bookmark with the given title from the player's bookmarks.
	 */	
	deleteBookMark(title) {
		this.bookMarks = this.bookMarks.filter((bookmark) => {
			return bookmark.title !== title;
		});
	}
}

export { Player };