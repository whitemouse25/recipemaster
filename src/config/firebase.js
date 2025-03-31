import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyCwnbcue32wS2GGc5cn5x6wu2qmlZbgLfU",
  authDomain: "megaprojectreact.firebaseapp.com",
  projectId: "megaprojectreact",
  storageBucket: "megaprojectreact.firebasestorage.app",
  messagingSenderId: "678333030939",
  appId: "1:678333030939:web:56057631d93f25ed2c0ebe",
  measurementId: "G-7W00CV6WWZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 