const {initializeApp, cert} = require('firebase-admin/app');

const {getFirestore} = require('firebase-admin/firestore');

const serviceAccount = require('../creds.json');

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore();

module.exports = {db};



// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDRhLBJrl3cj3OLmEuoz_seryFLCGi40Kw",
//   authDomain: "kalakalikasandb.firebaseapp.com",
//   projectId: "kalakalikasandb",
//   storageBucket: "kalakalikasandb.firebasestorage.app",
//   messagingSenderId: "856444206901",
//   appId: "1:856444206901:web:3984ec87068f9d2617567c"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);