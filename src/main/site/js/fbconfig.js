import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
	    apiKey: "AIzaSyBUvzyIX-YQSEcQXdBdrHNgyOWTS5hVwx4",
	    authDomain: "heroes-of-myth-and-legend.firebaseapp.com",
	    projectId: "heroes-of-myth-and-legend",
	    storageBucket: "heroes-of-myth-and-legend.appspot.com",
	    messagingSenderId: "670305006733",
	    appId: "1:670305006733:web:4086a48931a752cbf85ec4",
	    measurementId: "G-PY517GF9BS"
	  };

window.fbProject = initializeApp(firebaseConfig);
window.firestore = getFirestore(window.fbProject);
