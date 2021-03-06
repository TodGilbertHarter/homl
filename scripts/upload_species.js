/*
 * Upload species from a compendium.json into Firestore.
 */
const admin = require('firebase-admin');
const serviceAccount = require("../keys/homl_firebase_credentials2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heroes-of-myth-and-legend.firebaseio.com"
});

const arg1 = process.argv[2]
const data = require("../"+arg1);

Object.keys(data["species"]).forEach((species) => {
	handleSpecies(data['species'][species]);
});

function handleSpecies(species) {
	if(!species.hasOwnProperty('boons')) { species.boons = []; }
	species.boons = species.boons.map((boon) => {
		return admin.firestore().doc(`boons/${boon}`);
	});
// console.log("WTF IS WRONG HERE "+JSON.stringify(calling));
	upload(species,['species',species.id]);
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}