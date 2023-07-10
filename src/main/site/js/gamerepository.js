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
import { collection, doc, setDoc, query, where, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { Game } from './game.js';

const gameConverter = {
	toFirestore(game) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
//		const owner = data.owner.get().data();
		return new Game(id,data.name,data.owner,data.characters,data.players,data.description);
	}
}

class GameRepository {
	/*
	Game repo, this fetches games for us from Firebase.
	*/
    /** @private */ db;
    /** @private */ gebApp;
    
    constructor(gebApp,firestore) {
		this.gebApp = gebApp;
        this.db = firestore;
    }

	getGameById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"games",id);
		docRef = docRef.withConverter(gameConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
/*				doc.forEach((gdata) => {
					results.push(gdata.data());
				}); */
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    getGamesByName(name,onDataAvailable) {
		const gamesRef = collection(this.db,"games");
		var q = query(gamesRef,where("name", "==", name));
		q = q.withConverter(gameConverter);
		getDocs(q).then((doc) => { 
				console.log("GOT SOME DATA "+doc);
				const results = [];
				doc.forEach((gdata) => {
					results.push(gdata.data());
				});
				onDataAvailable(results); 
			});
	}
    
    saveGame(game) {
        const data = game.gameData;
        console.log("Saving data of "+JSON.stringify(data));
        if(data.hasOwnProperty('id') && data.id !== undefined) {
            console.log("UPDATING, ID IS:"+data.id);
            var id = data.id;
            delete data.id;
            this.db.collection("games").doc(id).set(data);
            data.id = id;
        } else {
            console.log("CREATING, data is "+JSON.stringify(data));
            this.db.collection("games").add(data);
        }
    }

	getGamesByOwner(playerId,onDataAvailable,onFailure) {
		const playerDocRef = doc(this.db,'players',playerId);
		var docRef = collection(this.db,'games');
		docRef = docRef.withConverter(gameConverter);
		const q = query(docRef,where('owner','==',playerDocRef));
		getDocs(q).then((doc) => {
				const results = [];
				doc.forEach((gdata) => {
					results.push(gdata.data());
				});
			onDataAvailable(results);
			}).catch((e) => { 
				onFailure(e.message);
			});
	}
	
	getPlayerGames(player,onDataAvailable,onFailure) {
		const playerDocRef = doc(this.db,'players',player.id);
		var docRef = collection(this.db,'games');
		docRef = docRef.withConverter(gameConverter);
		const q = query(docRef,where('players','contains',playerDocRef));
		getDocs(q).then((doc) => {
				const results = [];
				doc.forEach((gdata) => {
					results.push(gdata.data());
				});
			onDataAvailable(results);
			}).catch((e) => { 
				onFailure(e.message);
			});
	}
}

export { GameRepository };

