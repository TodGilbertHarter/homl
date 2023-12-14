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
		return {
			id: player.id,
			uid: player.uid,
			loggedin: player.loggedIn,
			owned: player.owned,
			handle: player.handle,
			bookMarks: player.bookMarks,
			macroset: macroConverter.toFirestore(player.macroset)
		}
	},
	
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Player(id,data.uid,data.loggedin,data.owned,data.handle,data.bookMarks,macroConverter.fromFirestore(data.id,data.macroset));
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

	/**
	 * Get a group of players given their references.
	 */	
	getReferencedPlayers(playerRefs,onSuccess) {
		this.dtosFromReferences(playerRefs,onSuccess);
	}
	
	/**
	 * Given a user id, get the corresponding player record.
	 */
    getPlayerByUid(uid,onDataAvailable, onFailure) {
		this.findDto("uid",uid,"==",onDataAvailable,onFailure);
    }
    
    /**
	 * Save the player.
	 */
    savePlayer(player) {
		this.saveDto(player);
    }

	/**
	 * Get a player by their id and call the given callback when
	 * the data is available. Use the async version in prefference
	 * wherever possible.
	 */    
    getPlayerById(playerId,onDataAvailable) {
		var docRef = this.getReference(playerId);
		this.dtoFromReference(docRef,onDataAvailable);
	}

	/**
	 * Async version of getting a player from a reference.
	 * Use this in preference to the callback version.
	 */	
	async getReferencedPlayerAsync(playerRef) {
		return this.dtoFromReferenceAsync(playerRef);
	}

	/**
	 * Async version of getting a player by their id. This is the
	 * preferred method.
	 */	
	async getPlayerByIdAsync(playerId) {
		var docRef = this.getReference(playerId);
		return this.dtoFromReferenceAsync(docRef);
	}

}

export { PlayerRepository };

