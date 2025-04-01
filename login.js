import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv3GPF3uTDURd704A4M68H7T91Ygfik-M",
  authDomain: "beacon-73ff8.firebaseapp.com",
  projectId: "beacon-73ff8",
  storageBucket: "beacon-73ff8.firebasestorage.app",
  messagingSenderId: "398593009531",
  appId: "1:398593009531:web:09358faa7409fa38743fde",
  measurementId: "G-9RLHSZPCKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

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

    } catch (error) {
      const errorCode = error.code;
      let errorMessage = "Please check your login details and try again";

      switch (errorCode) {
        case 'auth/user-not-found':
          errorMessage = "Account not found";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email";
          break;
        default:
          errorMessage = "Unable to sign in";
      }

      signInMessage.style.display = 'block';
      signInMessage.textContent = errorMessage;
    }
  });
});