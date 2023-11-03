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
import { collection, doc, setDoc, query, where, getDocs, getDoc } from 'firebase-firestore';
import { Species } from './species.js';

const speciesConverter = {
	toFirestore(species) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting species and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Species(id,data.name,data.size,data.speed,data.vision,data.height,data.weight,data.boons);
	}
}

class SpeciesRepository {
	/*
	Calling repo, this fetches callings for us from Firebase.
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
/* 	getReferencedCharacters(characters,onDataAvailable) {
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
	} */

	/**
	 * Get a calling by name. Technically multiple callings with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getSpeciesByName(name,onDataAvailable) {
        this.db.collection("species").where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Character data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getReferencedSpecies(speciesRef,onDataAvailable) {
		const dr = speciesRef.withConverter(speciesConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such species as "+speciesRef);
			}
		}).catch(e => console.log("Failed to get species data "+e.message));
	}
	
	/**
	 * Preload a copy of all the callings. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allSpecies = [];
	loadAllSpecies() {
		this.getAllSpecies((docs) => { this.allSpecies = docs; });
		this.notifyListeners(this.allSpecies);
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allSpecies));
	}
	
	addListener(listener) {
		listeners.push(listener);
	}
    /**
     * Gets all available callings as a list and invokes the given callback when the data is available.
     */
    getAllSpecies(onDataAvailable) {
		var speciesRef = collection(this.db,'species');
		speciesRef = speciesRef.withConverter(speciesConverter);
		getDocs(speciesRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.log("Failed to get all species "+e.message);
		});
	}
	
    /**
     * Get a species given its id.
     *
     * @param {string} id Document id of the calling to get.
     * @Param {function([Calling])} onDataAvailable data available callback.
     */
	getSpeciesById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"species",id);
		docRef = docRef.withConverter(speciesConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    saveSpecies(species) {
        console.log("Saving species");
        if(species.hasOwnProperty('id') && species.id !== undefined) {
            console.log("UPDATING, ID IS:"+species.id);
            var id = species.id;
            delete species.id;
            this.db.collection("species").doc(id).set(species);
            species.id = id;
        } else {
            console.log("CREATING species");
            this.db.collection("species").add(species);
        }
    }
}

export { SpeciesRepository };