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
import { Origin } from './origin.js';

const originConverter = {
	toFirestore(origin) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting origin and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Origin(id,data.backgrounds,data.name,data.description,data.boons,data.features,data.implements,data.knacks,data.weapons);
	}
}

class OriginRepository {
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
	 * Convert a collection of origin document references into Origin objects by looking them
	 * up in firestore. 
	 *
	 * @param {[docs]} origins an array of character docrefs.
	 * @param {function([Origin])} onDataAvailable callback to handle the results.
	 */
 	getReferencedOrigins(origins,onDataAvailable) {
		const results = [];
		origins.forEach((docRef) => {
			const dr = docRef.withConverter(originConverter);
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

	/**
	 * Get an origin by name. Technically multiples with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getOriginByName(name,onDataAvailable) {
        this.db.collection("origins").withConverter(originConverter).where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Origin data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getReferencedOrigin(originRef,onDataAvailable) {
		const dr = originRef.withConverter(originConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such origin as "+originRef);
			}
		}).catch(e => console.log("Failed to get origin data "+e.message));
	}
	
	/**
	 * Preload a copy of all the backgrounds. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allOrigins;
	loadAllOrigins() {
		this.getAllOrigins((docs) => { this.allOrigins = docs; });
		this.notifyListeners(this.allOrigins);
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allOrigins));
	}
	
	addListener(listener) {
		listeners.push(listener);
	}

    /**
     * Gets all available backgrounds as a list and invokes the given callback when the data is available.
     */
    getAllOrigins(onDataAvailable) {
		var originsRef = collection(this.db,'origins');
		originsRef = originsRef.withConverter(originConverter);
		getDocs(originsRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all origins "+e.message);
		});
	}

    /**
     * Get a background given its id.
     *
     * @param {string} id Document id of the background to get.
     * @Param {function([Background])} onDataAvailable data available callback.
     */
	getOriginById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"origins",id);
		docRef = docRef.withConverter(originConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    saveOrigin(origin) {
        console.log("Saving origin");
        if(origin.hasOwnProperty('id') && origin.id !== undefined) {
            console.log("UPDATING, ID IS:"+origin.id);
            var id = origin.id;
            delete origin.id;
            this.db.collection("origins").doc(id).set(origin);
            origin.id = id;
        } else {
            console.log("CREATING, origin");
            this.db.collection("origins").add(origin);
        }
    }
}

export { OriginRepository };

