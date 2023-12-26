/*
 * Upload feat data from a compendium.json to Firestore
 */
const admin = require('firebase-admin');
const serviceAccount = require("../keys/homl_firebase_credentials2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heroes-of-myth-and-legend.firebaseio.com"
});

const arg1 = process.argv[2]
const data = require("../"+arg1);

Object.keys(data["feats"]).forEach((feat) => {
	handleFeat(data['feats'][feat],feat);
});

function handleFeat(feat,id) {
	upload(feat,['feats',id]);
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}