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
import { collection, doc, setDoc, query, where, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { Boon } from './boon.js';
import { schema } from './schema.js';

const boonConverter = {
	toFirestore(boon) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting boon and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Boon(id,data.name,data.source,data.level,data.type,data.association,data.description,data.benefits
			,data.disadvantages,data.restrictions,data.manifestation);
	}
}

class BoonRepository {
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
	 * up in firestore. This is intended to handle converting lists of backgrounds into Background objects.
	 *
	 * @param {[docs]} backgrounds an array of character docrefs.
	 * @param {function([Background])} onDataAvailable callback to handle the results.
	 */
 	getReferencedBoons(boons,onDataAvailable) {
		const results = [];
		boons.forEach((docRef) => {
			const dr = docRef.withConverter(boonConverter);
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
	 * Get a boon by name. Technically multiple boons with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getBoonByName(name,onDataAvailable) {
        this.db.collection(schema.boons).where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Boon data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getReferencedBoon(boonRef,onDataAvailable) {
		const dr = boonRef.withConverter(boonConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such boon as "+boonRef);
			}
		}).catch(e => console.log("Failed to get boon data "+e.message));
	}
	
	/**
	 * Preload a copy of all the boons. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allBoons;
	loadAllBoons() {
		this.getAllBoons((docs) => { this.allBoons = docs; });
		this.notifyListeners(this.allBoons);
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allBoons));
	}
	
	addListener(listener) {
		this.listeners.push(listener);
	}
	
	removeListener(listener) {
		const lidx = this.listeners.indexOf(listener);
		if(lidx > -1) {
			this.listeners.splice(lidx,1);
		}
	}

    /**
     * Gets all available boons as a list and invokes the given callback when the data is available.
     */
    getAllBoons(onDataAvailable) {
		var boonsRef = collection(this.db,schema.boons);
		boonsRef = boonsRef.withConverter(boonConverter);
		getDocs(boonsRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all boons "+e.message);
		});
	}

    /**
     * Get a boon given its id.
     *
     * @param {string} id Document id of the background to get.
     * @Param {function([Background])} onDataAvailable data available callback.
     */
	getBoonById(id,onDataAvailable) {
		var docRef = doc(this.db,schema.boons,id);
		docRef = docRef.withConverter(boonConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
}

export { BoonRepository };

