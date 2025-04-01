import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6S_-Chou9YqPq7w1u-opm6cdd4W0gCXY",
    authDomain: "beacon-pa05.firebaseapp.com",
    projectId: "beacon-pa05",
    storageBucket: "beacon-pa05.firebasestorage.app",
    messagingSenderId: "694515167233",
    appId: "1:694515167233:web:4997c08a2f4af97ef7d000",
    measurementId: "G-VFPFPL5PD1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics }; 