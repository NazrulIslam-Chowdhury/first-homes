// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_apiKey,
  authDomain: "first-homes.firebaseapp.com",
  projectId: "first-homes",
  storageBucket: "first-homes.appspot.com",
  messagingSenderId: "664085332915",
  appId: "1:664085332915:web:1c3095c06f18d4ea4781c6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
