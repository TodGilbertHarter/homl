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
import { doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const schema = {
	backgrounds: 'backgrounds',
	callings: 'callings',
	characters: 'characters',
	games: 'games',
	origins: 'origins',
	players: 'players',
	species: 'species',
	equipment: 'equipment'
};

const getReference = (schema,id) => {
	return doc(getDb(),schema,id);
}

const getDb = () => { return window.gebApp.firestore }

export { schema, getReference, getDb };
