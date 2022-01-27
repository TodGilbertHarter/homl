/*
 * Upload boons from a compendium.json into Firestore.
 */
const admin = require('firebase-admin');
const serviceAccount = require("../keys/homl_firebase_credentials2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heroes-of-myth-and-legend.firebaseio.com"
});

const arg1 = process.argv[2]
const data = require("../"+arg1);

Object.keys(data["boons"]).forEach((boon) => {
	handleBoon(data['boons'][boon]);
});

function handleBoon(boon) {
	if(!boon.hasOwnProperty('benefits')) { boon.benefits = []; }
	const pattern = /id=\[([a-e|0-9|\-])+\]/;
	const benefits = boon.benefits.map((benefit) => {
		const m = pattern.exec(benefit);
		if(m !== null) {
			const idSTR = m[0];
			const id = idSTR.substr(4,36);
console.log("GOT A FEAT ID OF:'"+id+"'");
			const featRef = admin.firestore().doc(`feats/${id}`);
			return featRef;
		} else {
			return benefit;
		}
	});
	boon.benefits = benefits;
	upload(boon,['boons',boon.id]);
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}