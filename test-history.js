import { db } from './firebaseconfig.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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