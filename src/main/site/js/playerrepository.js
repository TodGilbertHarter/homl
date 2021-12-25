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
class PlayerRepository {
	/*
	Game repo, this fetches games for us from Firebase.
	*/
    /** @private */ db;

    constructor(firebase) {
        this.db = firebase.firestore();
    }

    getPlayerByEmail(email,onDataAvailable, onFailure) {
        this.db.collection("players").where("email", "==", email).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Player data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) }).catch((e) => {
				onFailure(e.message);
//				console.log(e.message);
//				onDataAvailable(null); //WARNING: This is sheer hackery because something is porked.
			});
    }
    
    savePlayer(player) {
        const data = player.playerData;
        console.log("Saving data of "+JSON.stringify(data));
        if(data.hasOwnProperty('id') && data.id !== undefined) {
            console.log("UPDATING, ID IS:"+data.id);
            var id = data.id;
            delete data.id;
            this.db.collection("players").doc(id).set(data);
            data.id = id;
        } else {
            console.log("CREATING, data is "+JSON.stringify(data));
            this.db.collection("players").add(data);
        }
    }

}
