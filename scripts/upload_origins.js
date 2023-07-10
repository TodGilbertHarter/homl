/*
 * Upload heroic origins from a compendium.json into Firestore.
 */
const admin = require('firebase-admin');
const serviceAccount = require("../keys/homl_firebase_credentials2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heroes-of-myth-and-legend.firebaseio.com"
});

const arg1 = process.argv[2]
const data = require("../"+arg1);

Object.keys(data["origins"]).forEach((origin) => {
	handleOrigin(data['origins'][origin]);
});

function handleOrigin(origin) {
	if(!origin.hasOwnProperty('features')) { origin.features = []; }
	if(typeof origin.features !== 'undefined') {
		origin.features = origin.features.map((feature) => {
			return admin.firestore().doc(`features/${feature}`);
		});
	}
	
	if(!origin.hasOwnProperty('boons')) { origin.boons = []; }
	if(typeof origin.boons !== 'undefined') {
		origin.boons = origin.boons.map((boon) => {
			return admin.firestore().doc(`boons/${boon}`);
		});
	}
	upload(origin,['origins',origin.id]);
}

async function upload(data, path) {
  var result = await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}