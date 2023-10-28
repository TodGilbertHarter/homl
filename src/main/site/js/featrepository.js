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
import { Feat } from './feat.js';
import { schema } from './schema.js';

const featConverter = {
	toFirestore(feat) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting feat and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Feat(id,data.name,data.source,data.level,data.origin,data.tags,data.tier,data.effects,data.costs,data.components,data.action,data.attack
		,data.completesuccess,data.enhancedsuccess,data.success,data.failure,data.flavortext,data.special,data.typetarget,data.trigger,data.check
		,data.defense,data.duration,data.requirements);
	}
}

class FeatRepository {
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
 	getReferencedFeats(feats,onDataAvailable) {
		const results = [];
		boons.forEach((docRef) => {
			const dr = docRef.withConverter(featConverter);
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
	 * Get a feat by name. Technically multiple feats with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getFeatByName(name,onDataAvailable) {
        this.db.collection(schema.feats).where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Boon data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getReferencedFeat(featRef,onDataAvailable) {
		const dr = featRef.withConverter(featConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such feat as "+featRef);
			}
		}).catch(e => console.log("Failed to get feat data "+e.message));
	}
	
    async getReferencedFeatAsync(featRef) {
		const dr = featRef.withConverter(featConverter);
		return await getDoc(dr).then(cp => cp.data());
	}
	
	/**
	 * Preload a copy of all the feats. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allFeats;
	loadAllFeats() {
		this.getAllFeats((docs) => { this.allFeats = docs; });
		this.notifyListeners(this.allFeats);
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allBoons));
	}
	
	addListener(listener) {
		this.listeners.push(listener);
	}

    /**
     * Gets all available backgrounds as a list and invokes the given callback when the data is available.
     */
    getAllFeats(onDataAvailable) {
		var featsRef = collection(this.db,schema.feats);
		featsRef = featsRef.withConverter(featConverter);
		getDocs(featsRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all feats "+e.message);
		});
	}

    /**
     * Get a feat given its id.
     *
     * @param {string} id Document id of the feat to get.
     * @Param {function([Feat])} onDataAvailable data available callback.
     */
	getFeatById(id,onDataAvailable) {
		var docRef = doc(this.db,schema.feats,id);
		docRef = docRef.withConverter(featConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
}

export { FeatRepository };

