// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAvGhF538yoq4SbI6FTvAkkD1KXl-cRPMY",
  authDomain: "hutech-safety-ai.firebaseapp.com",
  projectId: "hutech-safety-ai",
  storageBucket: "hutech-safety-ai.appspot.app",
  messagingSenderId: "41450126170",
  appId: "1:41450126170:web:4cd4829887f9c63470d163",
  measurementId: "G-1MJRP6BLJE"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Export auth để dùng trong Login.jsx
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 