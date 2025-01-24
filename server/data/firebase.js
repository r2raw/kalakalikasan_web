const {initializeApp, cert} = require('firebase-admin/app');
const dotenv = require('dotenv')
const {getFirestore} = require('firebase-admin/firestore');
dotenv.config()
// const serviceAccount = require('../creds.json');

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X590_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
}

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