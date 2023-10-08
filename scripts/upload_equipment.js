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

Object.keys(data["equipment"]).forEach((equipment) => {
	handleEquipment(data['equipment'][equipment]);
});

function handleEquipment(equipment) {
	upload(equipment,['equipment',equipment.id]);
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}