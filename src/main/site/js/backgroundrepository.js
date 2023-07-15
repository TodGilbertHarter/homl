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
import { Background } from './background.js';

const backgroundConverter = {
	toFirestore(background) {
		
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting background and id is "+snapshot.id);
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Background(id,data.type,
			data.name,data.text);
	}
}

class BackgroundRepository {
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
 	getReferencedBackgrounds(backgrounds,onDataAvailable) {
		const results = [];
		backgrounds.forEach((docRef) => {
			const dr = docRef.withConverter(backgroundConverter);
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
	 * Get a background by name. Technically multiple backgrounds with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    getBackgroundByName(name,onDataAvailable) {
        this.db.collection("backgrounds").where("name", "==", name).get().then((doc) => { 
            doc.forEach(r => { 
                console.log("GOT "+r.id);
                var data = r.data();
                data.id = r.id;
                console.log("Background data is:"+JSON.stringify(data));
                onDataAvailable(data);
            } ) });
    }
    
    getReferencedBackground(backgroundRef,onDataAvailable) {
		const dr = backgroundRef.withConverter(backgroundConverter);
		getDoc(dr).then((cp) => {
			if(cp.exists()) {
				onDataAvailable(cp.data());
			} else {
				console.log("There is no such background as "+backgroundRef);
			}
		}).catch(e => console.log("Failed to get background data "+e.message));
	}
	
	/**
	 * Preload a copy of all the backgrounds. This can be called long before they are required, thus
	 * various other methods can directly return results, and we can then set up listeners to allow
	 * for handling any updated information which comes in later.
	 */
	allBackgrounds;
	loadAllBackgrounds() {
		this.getAllBackgrounds((docs) => { this.allBackgrounds = docs; });
		this.notifyListeners(this.allBackgrounds);
	}
	
	listeners = [];
	notifyListeners() {
		this.listeners.forEach((listener) => listener(this.allBackgrounds));
	}
	
	addListener(listener) {
		listeners.push(listener);
	}

    /**
     * Gets all available backgrounds as a list and invokes the given callback when the data is available.
     */
    getAllBackgrounds(onDataAvailable) {
		var backgroundsRef = collection(this.db,'backgrounds');
		backgroundsRef = backgroundsRef.withConverter(backgroundConverter);
		getDocs(backgroundsRef).then((doc) => {
			const docs = [];
			doc.forEach(r => {
				var data = r.data();
				docs.push(data);
			});
			onDataAvailable(docs);
		}).catch(e => {
			console.trace();
			console.log("Failed to get all backgrounds "+e.message);
		});
	}

	/**
	 * Call onDataAvailable passing a structure where each type is a key and all the backgrounds of that type are contained in a hash
	 * keyed on the name of each background.
	 */
	getCategorizedBackgrounds(onDataAvailable) {
		getAllBackgrounds((backgrounds) => {
			var result = {};
			backgrounds.forEach((background) => {
				if(result[background.type] === 'undefined') {
					result[background.type] = {};
				}
				result[background.type][background.name] = background;
			});
			onDataAvailable(result);
		});
	}
	
    /**
     * Get a background given its id.
     *
     * @param {string} id Document id of the background to get.
     * @Param {function([Background])} onDataAvailable data available callback.
     */
	getBackgroundById(id,onDataAvailable) {
		console.log("WTF IS THE ID "+id);
		var docRef = doc(this.db,"backgrounds",id);
		docRef = docRef.withConverter(backgroundConverter);
		getDoc(docRef).then((doc) => {
				console.log("GOT SOME DATA "+doc);
				const results = [];
				results.push(doc.data());
				onDataAvailable(results[0]); 
		});
	}
	
    saveBackground(background) {
        console.log("Saving background");
        if(background.hasOwnProperty('id') && background.id !== undefined) {
            console.log("UPDATING, ID IS:"+background.id);
            var id = background.id;
            delete background.id;
            this.db.collection("backgrounds").doc(id).set(background);
            background.id = id;
        } else {
            console.log("CREATING, background");
            this.db.collection("backgrounds").add(background);
        }
    }
}

export { BackgroundRepository };

