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
import { collection, doc, setDoc, addDoc, query, where, getDocs, getDoc } from 'firebase-firestore';
import { Player } from './player.js';

const playerConverter = {
	toFirestore(player) {
		return {
			email: player.email,
			loggedin: player.loggedIn,
			characters: player.characters
		}
	},
	fromFirestore(snapshot,options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Player(id,data.email,data.loggedin,data.characters);
	}
};

const GetPlayerReference = (id) => {
	const db = window.gebApp.firestore;
	return doc(db,"players",id);
};

class PlayerRepository {
	/*
	Game repo, this fetches players for us from Firebase.
	*/
    /** @private */ db;
    /** @private */ gebApp;

    constructor(gebApp,firestore) {
		this.gebApp = gebApp;
        this.db = firestore;
    }

	/**
	 * Given a player reference, call the onSuccess callback when the corresponding player is available
	 * If the playerRef is really a player, then simply call onSuccess immediately.
	 */
	getReferencedPlayer(playerRef,onSuccess) {
		if(playerRef instanceof Player) {
			onSuccess(playerRef); // Because it is actually a player, not a ref!
		} else {
			playerRef.withConverter(playerConverter);
			getDoc(playerRef).then((player) => { 
				onSuccess(player);
			});
		}
	}
	
    getPlayerByEmail(email,onDataAvailable, onFailure) {
		console.log("GOT to getPLayerByEmail");
        const playersRef = collection(this.db,"players");
        const q = query(playersRef,where("email", "==", email)).withConverter(playerConverter);
        getDocs(q).then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var player = r.data();
                onDataAvailable(player);
            } ) }).catch((e) => {
				console.trace(e);
				onFailure(e.message);
			});
    }
    
    savePlayer(player) {
        console.log("Saving data of "+JSON.stringify(player));
        if(player.hasOwnProperty('id') && player.id !== undefined) {
            console.log("UPDATING, ID IS:"+player.id);
            var id = player.id;
            delete player.id;
            setDoc(doc(this.db,'players',id).withConverter(playerConverter),player);
            player.id = id;
        } else {
            console.log("CREATING, data is "+JSON.stringify(player));
            addDoc(collection(this.db,'players').withConverter(playerConverter),player);
        }
    }

}

export { PlayerRepository, GetPlayerReference };

