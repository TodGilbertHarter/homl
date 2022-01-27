/*
 * Upload callings from a compendium.json into Firestore.
 */
const admin = require('firebase-admin');
const serviceAccount = require("../keys/homl_firebase_credentials2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heroes-of-myth-and-legend.firebaseio.com"
});

const arg1 = process.argv[2]
const data = require("../"+arg1);

Object.keys(data["callings"]).forEach((calling) => {
	handleCalling(data['callings'][calling]);
});

function handleCalling(calling) {
	if(!calling.hasOwnProperty('features')) { calling.features = []; }
	calling.features = calling.features.map((feature) => {
		return admin.firestore().doc(`boons/${feature}`);
	});
	
	if(!calling.hasOwnProperty('boons')) { calling.boons = []; }
	calling.boons = calling.boons.map((boon) => {
		return admin.firestore().doc(`boons/${boon}`);
	});
// console.log("WTF IS WRONG HERE "+JSON.stringify(calling));
	upload(calling,['callings',calling.id]);
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}