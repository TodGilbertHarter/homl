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
import { collection, doc, setDoc, query, where, getDocs, getDoc } from 'firebase-firestore';
import { Game } from './game.js';

const gameConverter = {
	toFirestore(game) {
		const g = {};
		for(const [key,value] of Object.entries(game)) {
			if(key === 'owner') {
					const db = window.gebApp.firestore;
				const playerDocRef = doc(db,'players',value.id);
				g[key] = playerDocRef;
			} else {
				g[key] = value;
			}
		}
		return g;
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
//		const owner = data.owner.get().data();
		return new Game(id,data.name,data.owner,data.characters,data.players,data.description);
	}
}

const GetGameReference = (id) => {
	const db = window.gebApp.firestore;
	return doc(db,"games",id);
};

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
    
    async saveGame(game) {
        console.log("Saving data of "+JSON.stringify(game));
        if(game.hasOwnProperty('id') && game.id !== undefined && game.id !== null) {
            console.log("UPDATING, ID IS:"+game.id);
            var id = game.id;
            const ref = doc(this.db,"games",id).withConverter(gameConverter);
            await setDoc(ref.game);
        } else {
            console.log("CREATING, data is "+JSON.stringify(game));
            const ref = doc(collection(this.db,'games')).withConverter(gameConverter);
            await setDoc(ref,game);
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

export { GameRepository, GetGameReference };

