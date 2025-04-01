import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const signInMessage = document.getElementById("signInMessage");
  const submitButton = document.getElementById("submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Disable submit button to prevent double submission
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing in...';

    const input = document.getElementById("floatingInput").value.trim();
    const password = document.getElementById("floatingPassword").value;

    // Basic validation
    if (!input || !password) {
      showError("Please fill in all fields");
      resetSubmitButton();
      return;
    }

    // Email format validation if input looks like an email
    if (input.includes('@') && !isValidEmail(input)) {
      showError("Please enter a valid email address");
      resetSubmitButton();
      return;
    }

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
      console.error("Login error:", error);
      let errorMessage = "Unable to sign in";

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "Account not found";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection";
          break;
        case 'auth/internal-error':
          errorMessage = "An error occurred. Please try again";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled";
          break;
        default:
          errorMessage = "Unable to sign in. Please try again";
      }

      showError(errorMessage);
    } finally {
      resetSubmitButton();
    }
  });
});

function showError(message) {
  const signInMessage = document.getElementById("signInMessage");
  signInMessage.textContent = message;
  signInMessage.className = "alert alert-danger";
  signInMessage.style.display = "block";
}

function resetSubmitButton() {
  const submitButton = document.getElementById("submit");
  submitButton.disabled = false;
  submitButton.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Sign in';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}