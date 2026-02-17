// firebase-config.js — keep ONLY this

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6vLv2iF1wcs_iDIAgjZOZPLOh5xgmNKA",
  authDomain: "delight-bites-82857.firebaseapp.com",
  projectId: "delight-bites-82857",
  storageBucket: "delight-bites-82857.firebasestorage.app",
  messagingSenderId: "415746410686",
  appId: "1:415746410686:web:0158a62668ad5be82276ef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;

console.log("Firebase initialized");