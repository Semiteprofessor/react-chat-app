import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-688b8.firebaseapp.com",
  projectId: "reactchat-688b8",
  storageBucket: "reactchat-688b8.appspot.com",
  messagingSenderId: "954118171546",
  appId: "1:954118171546:web:22be72e8806e51b5caa823",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
