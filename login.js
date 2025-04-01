import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC6S_-Chou9YqPq7w1u-opm6cdd4W0gCXY",
    authDomain: "beacon-pa05.firebaseapp.com",
    projectId: "beacon-pa05",
    storageBucket: "beacon-pa05.firebasestorage.app",
    messagingSenderId: "694515167233",
    appId: "1:694515167233:web:4997c08a2f4af97ef7d000",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;
    const signInMessage = document.getElementById("signInMessage");

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", input));
      const querySnapshot = await getDocs(q);
      
      let emailToUse = input; // Default to using input as email
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        emailToUse = userDoc.data().email;
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);
      window.location.href = "search-topic.html";

    } 
    
    catch (error) {
      let errorMessage = "Please check your login details and try again.";

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "Account not found.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email.";
          break;
        default:
          errorMessage = error.message;
      }

      signInMessage.style.display = 'block';
      signInMessage.textContent = errorMessage;
    }
  });
});