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
const gameConverter = {
	toFirestore(game) {
		
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
//		const owner = data.owner.get().data();
		return new Game(id,data.name,data.owner,data.characters,data.players);
	}
}

class GameRepository {
	/*
	Game repo, this fetches games for us from Firebase.
	*/
    /** @private */ db;
//    static #converter = new GameConverter();

    constructor(firebase) {
        this.db = firebase.firestore();
    }

	getGameById(id,onDataAvailable) {
		this.db.collection("games")
		.withConverter(gameConverter).get(id)
		.then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				doc.forEach((gdata) => {
					results.push(gdata.data());
				});
				onDataAvailable(results[0]); 
		});
	}
	
    getGameByName(name,onDataAvailable) {
        this.db.collection("games")
        .where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Game data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getGamesByName(name,onDataAvailable) {
		this.db.collection("games")
			.where("name", "==", name)
			.withConverter(gameConverter).get()
			.then((doc) => { 
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

	getPlayerGames(player,onDataAvailable,onFailure) {
//		const categoryDocRef = this.#db.collection('games').doc('players');
		this.db.collection('games').where('players.id','==',player.id).get().then(doc => onDataAvailable(doc))
			.catch((e) => { onFailure(e.message)});
	}
}

