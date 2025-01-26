// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7gnzkZTQy2zcZA90OEOnivKXBKG9Z5Zs",
  authDomain: "challengeher-81034.firebaseapp.com",
  projectId: "challengeher-81034",
  storageBucket: "challengeher-81034.firebasestorage.app",
  messagingSenderId: "317821299078",
  appId: "1:317821299078:web:9a4bbc132a058061462407",
  measurementId: "G-V49J8JEP1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
export const auth = getAuth(app);
export { db };