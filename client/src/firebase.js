// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "harmony-homess.firebaseapp.com",
  projectId: "harmony-homess",
  storageBucket: "harmony-homess.appspot.com",
  messagingSenderId: "916019124327",
  appId: "1:916019124327:web:6c986e539ce9cff86c9cc2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);