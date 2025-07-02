// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCFy3ne-ep1VVBPN_zuoDG6dLE5ZQNjb4",
  authDomain: "day3-40ce5.firebaseapp.com",
  projectId: "day3-40ce5",
  storageBucket: "day3-40ce5.firebasestorage.app",
  messagingSenderId: "462289773636",
  appId: "1:462289773636:web:e41d15c70b5a6c03e98811",
  measurementId: "G-9CSY9NTCS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ add this
