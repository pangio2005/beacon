import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const db = getFirestore(app);

const historyRef = db.collection('searchHistory').doc('searchTerms');
  
function getSearchHistory() {
  return historyRef.get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().searchTerms || [];
      } else {
        return [];  
      }
    })
    .catch((error) => {
      console.error("Error fetching document: ", error);
      return [];
    });
}
  

function saveSearchHistory(searchTerm) {
  getSearchHistory().then((currentHistory) => {
    currentHistory.push({
      searchTerm: searchTerm,
      timestamp: serverTimestamp()
    });

    historyRef.set({
      searchTerms: currentHistory
    }).then(() => {
      console.log("Search history saved!");
    }).catch((error) => {
      console.error("Error updating document: ", error);
    });
  });
}
  
function handleSearch(searchInput) {
  if (searchInput.trim() !== "") {
    saveSearchHistory(searchInput);
  }
}
  
handleSearch("example search term");