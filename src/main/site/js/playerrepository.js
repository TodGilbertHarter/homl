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
import { Player } from './player.js';
import { WriteRepository, EntityId } from './baserepository.js';
import { collections } from './schema.js';
import { macroConverter } from './macros.js';

const random = (length = 8) => {
    // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
};

const playerConverter = {
	toFirestore(player) {
		if(!player.handle) player.handle = random(20);
		const p = {
			uid: player.uid,
			loggedin: player.loggedIn,
			owned: player.owned,
			handle: player.handle,
			bookMarks: player.bookMarks,
			macroset: macroConverter.toFirestore(player.macroset),
			version: 1.0
		}
		p.owned = p.owned.map((owned) => { return { name: owned.name, ref: owned.ref.getReference()}})
		return p;
	},
	
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.players,id);
		const data = snapshot.data(options);
		const owned = data.owned.map((owned) => { return {
			name: owned.name,
			ref: EntityId.EntityIdFromReference(owned.ref)
			}
		});
		return new Player(eid,data.uid,data.loggedin,owned,data.handle,data.bookMarks,macroConverter.fromFirestore(eid,data.macroset));
	}
};

/**
 * Player repository. Manages player objects in FireStore.
 */
class PlayerRepository extends WriteRepository {

    constructor() {
		super(playerConverter,collections.players);
    }

	/**
	 * Given a user id, get the corresponding player record.
	 */
    async getPlayerByUid(uid) {
		return this.findEntity("uid",uid,"==");
    }

}

export { PlayerRepository };
