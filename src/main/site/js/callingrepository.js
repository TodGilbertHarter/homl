/**
 * This software is Copyright (C) 2023 Tod G. Harter. All rights reserved.
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
import { Calling } from './calling.js';

const callingConverter = {
	toFirestore(calling) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting calling and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Calling(id,data.name,
			data.features,data.hitPoints,data.damageDie, data.role
			, data.powerSource,data.weaponProfs,data.implementProfs 
			, data.proficiencies
			, data.startingHitPoints,data.boons);
	}
}

class CallingRepository {
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
	 * Convert a collection of calling document references into Calling objects by looking them
	 * up in firestore. This is intended to handle converting lists of callings into Calling objects.
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
    getCallingByName(name,onDataAvailable) {
        this.db.collection("callings").where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Calling data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getReferencedCalling(callingRef,onDataAvailable) {
		const dr = callingRef.withConverter(callingConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such calling as "+callingRef);
			}
		}).catch(e => console.log("Failed to get calling data "+e.message));
	}
	
	/**
	 * Preload a copy of all the callings. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allCallings;
	loadAllCallings() {
		this.getAllCallings((docs) => { this.allCallings = docs; });
		this.notifyListeners(this.allCallings);
	}
	
	reloadAllCallings() {
		this.allCallings = undefined;
		loadAllCallings();
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allCallings));
	}
	
	addListener(listener) {
		listeners.push(listener);
	}

    /**
     * Gets all available callings as a list and invokes the given callback when the data is available.
     */
    getAllCallings(onDataAvailable) {
		if(this.allCallings !== undefined) {
			onDataAvailable(this.allCallings);
		}
		var callingsRef = collection(this.db,'callings');
		callingsRef = callingsRef.withConverter(callingConverter);
		getDocs(callingsRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all callings "+e.message);
		});
	}
	
    /**
     * Get a calling given its id.
     *
     * @param {string} id Document id of the calling to get.
     * @Param {function([Calling])} onDataAvailable data available callback.
     */
	getCallingById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"callings",id);
		docRef = docRef.withConverter(callingConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    saveCalling(calling) {
        console.log("Saving calling");
        if(calling.hasOwnProperty('id') && calling.id !== undefined) {
            console.log("UPDATING, ID IS:"+calling.id);
            var id = calling.id;
            delete calling.id;
            this.db.collection("callings").doc(id).set(calling);
            calling.id = id;
        } else {
            console.log("CREATING, calling");
            this.db.collection("callings").add(calling);
        }
    }
}

export { CallingRepository };

