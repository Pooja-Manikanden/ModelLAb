
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhwTR19JU99Wdp8vPKfR7N8rH3JxekiLs",
  authDomain: "fir-app-613ab.firebaseapp.com",
  projectId: "fir-app-613ab",
  storageBucket: "fir-app-613ab.firebasestorage.app",
  messagingSenderId: "1080130345785",
  appId: "1:1080130345785:web:a3452b6d7a3c86809766e8",
  measurementId: "G-72G1N8GR72"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);