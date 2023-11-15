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
import { collection, doc, setDoc, addDoc, query, where, getDocs, getDoc, DocumentReference } from 'firebase-firestore';
import { Player } from './player.js';
import { BaseRepository } from './baserepository.js';
import { schema, getDb, getReference } from './schema.js';

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
		return {
			id: player.id,
			uid: player.uid,
			loggedin: player.loggedIn,
			characters: player.characters,
			handle: player.handle
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Player(id,data.uid,data.loggedin,data.characters,data.handle);
	}
};

/**
 * Player repository. Manages player objects in FireStore.
 */
class PlayerRepository extends BaseRepository {

    constructor() {
		super(playerConverter,schema.players);
    }

	static GetPlayerReference(id) {
		return getReference(schema.players,id);
	};
	
	/**
	 * Given a player reference, call the onSuccess callback when the corresponding player is available
	 * If the playerRef is really a player, then simply call onSuccess immediately.
	 */
	getReferencedPlayer(playerRef,onSuccess) {
		this.dtoFromReference(playerRef,onSuccess);
	}
	
	getReferencedPlayers(playerRefs,onSuccess) {
		this.dtosFromReferences(playerRefs,onSuccess);
	}
	
    getPlayerByEmail(email,onDataAvailable, onFailure) {
//		this.findDto("email",email,"==",onDataAvailable,onFailure);
		throw new Error("player's don't have email anymore");
    }

    getPlayerByUid(uid,onDataAvailable, onFailure) {
		this.findDto("uid",uid,"==",onDataAvailable,onFailure);
    }
    
    savePlayer(player) {
		this.saveDto(player);
    }
    
    getPlayerById(playerId,onDataAvailable) {
		var docRef = this.getReference(playerId);
		this.dtoFromReference(docRef,onDataAvailable);
	}

}

export { PlayerRepository };

