const firebaseConfig = {
    apiKey: "AIzaSyDv3GPF3uTDURd704A4M68H7T91Ygfik-M",
    authDomain: "beacon-73ff8.firebaseapp.com",
    projectId: "beacon-73ff8",
    storageBucket: "beacon-73ff8.firebasestorage.app",
    messagingSenderId: "398593009531",
    appId: "1:398593009531:web:09358faa7409fa38743fde",
    measurementId: "G-9RLHSZPCKR"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
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
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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