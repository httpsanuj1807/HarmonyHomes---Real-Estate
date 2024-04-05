// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "harmony-home-9043b.firebaseapp.com",
  projectId: "harmony-home-9043b",
  storageBucket: "harmony-home-9043b.appspot.com",
  messagingSenderId: "74499041031",
  appId: "1:74499041031:web:a294f4c005c4fb0dd007a2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);