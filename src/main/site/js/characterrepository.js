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
import { Character } from './character.js';

const characterConverter = {
	toFirestore(character) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting character and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Character(id,data);
	}
}

class CharacterRepository {
	/*
	Character repo, this fetches characters for us from Firebase.
	*/
	/** @private */ gebApp;
    /** @private */ db;

    constructor(gebApp,firestore) {
		this.gebApp = gebApp;
        this.db = firestore;
    }

	/**
	 * Convert a collection of character document references into Character objects by looking them
	 * up in firestore. This is intended to handle converting lists of characters from a game or a
	 * player into Character objects.
	 *
	 * @param {[docs]} characters an array of character docrefs.
	 * @param {function([Character])} onDataAvailable callback to handle the results.
	 */
 	getReferencedCharacters(characters,onDataAvailable) {
		const results = [];
		characters.forEach((docRef) => {
			const dr = docRef.withConverter(characterConverter);
			const cp = getDoc(dr);
			results.push(cp);
		});
		Promise.all(results).then((carry) => {
			const res = [];
			carry.forEach((doc) => { 
				res.push(doc.data()); 
			});
			onDataAvailable(res); 
		});
	}
	
   getCharacterByName(name,onDataAvailable) {
        this.db.collection("characters").where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Character data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    /**
     * Get a character given its id.
     *
     * @param {string} id Document id of the character to get.
     * @Param {function([Character])} onDataAvailable data available callback.
     */
	getCharacterById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"characters",id);
		docRef = docRef.withConverter(characterConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    saveCharacter(character) {
        const data = character.characterData;
        console.log("Saving data of "+JSON.stringify(data));
        if(data.hasOwnProperty('id') && data.id !== undefined) {
            console.log("UPDATING, ID IS:"+data.id);
            var id = data.id;
            delete data.id;
            this.db.collection("characters").doc(id).set(data);
            data.id = id;
        } else {
            console.log("CREATING, data is "+JSON.stringify(data));
            this.db.collection("characters").add(data);
        }
    }
}

export { CharacterRepository };

