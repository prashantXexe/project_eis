import { initializeApp } from "firebase/app";
import { 
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeMazDtYS9M1GGmJLmcxuPTJpjkCcxwT0",
  authDomain: "projecteis-a13d1.firebaseapp.com",
  projectId: "projecteis-a13d1",
  storageBucket: "projecteis-a13d1.firebasestorage.app",
  messagingSenderId: "923843182985",
  appId: "1:923843182985:web:634cf58b4314204ceea158"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔥 IMPORTANT EXPORT
export { onAuthStateChanged };import { initializeApp } from "firebase/app";
import { 
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeMazDtYS9M1GGmJLmcxuPTJpjkCcxwT0",
  authDomain: "projecteis-a13d1.firebaseapp.com",
  projectId: "projecteis-a13d1",
  storageBucket: "projecteis-a13d1.firebasestorage.app",
  messagingSenderId: "923843182985",
  appId: "1:923843182985:web:634cf58b4314204ceea158"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔥 IMPORTANT EXPORT
export { onAuthStateChanged };