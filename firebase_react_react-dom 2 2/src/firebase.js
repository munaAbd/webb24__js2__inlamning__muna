import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDk1_MRD8CwpVLAd1_i03nEO3zddBU_vmk",
  authDomain: "webshop-fe3fb.firebaseapp.com",
  databaseURL: "https://webshop-fe3fb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webshop-fe3fb",
  storageBucket: "webshop-fe3fb.appspot.com",
  messagingSenderId: "603658758465",
  appId: "1:603658758465:web:10acaefab052473b4999c0",
  measurementId: "G-4BPFMNJNLY"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };