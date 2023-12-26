/*
 * Upload npcs from a compendium.json into Firestore.
 */
const admin = require('firebase-admin');
const serviceAccount = require("../keys/homl_firebase_credentials2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heroes-of-myth-and-legend.firebaseio.com"
});

const arg1 = process.argv[2]
const data = require("../"+arg1);

Object.keys(data["npcs"]).forEach((npc) => {
	handleNpc(data['npcs'][npc],npc);
});

function splitField(value) {
	return value.split(',').map((value) => value.trim());
}

function handleNpc(npc,id) {
	if(npc.name !== 'Monster Name') { // get rid of example stat block
		npc.tags = splitField(npc.tags);
		upload(npc,['npcs',id]);
	}
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}