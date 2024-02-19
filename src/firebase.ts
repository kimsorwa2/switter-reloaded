// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA18S1n4MXEg2wXqgnfmLjEdTNBaeE2amE",
  authDomain: "switter-reloded.firebaseapp.com",
  projectId: "switter-reloded",
  storageBucket: "switter-reloded.appspot.com",
  messagingSenderId: "53676722412",
  appId: "1:53676722412:web:cd01642903d402bcd57dc9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
