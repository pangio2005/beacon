// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Firebase configuration (using the same config from your chat implementation)
const firebaseConfig = {
  apiKey: "AIzaSyC6S_-Chou9YqPq7w1u-opm6cdd4W0gCXY",
  authDomain: "beacon-pa05.firebaseapp.com",
  projectId: "beacon-pa05",
  storageBucket: "beacon-pa05.firebasestorage.app",
  messagingSenderId: "694515167233",
  appId: "1:694515167233:web:4997c08a2f4af97ef7d000",
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global variables
let currentUser = null;
let currentUserData = null;
let selectedPostImage = null;
const POST_MAX_LENGTH = 2000; // Maximum characters per post

// Initialize the forum when the user is authenticated
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        currentUserData = userDoc.data();
      } else {
        console.warn("No user document found, using default values");
        currentUserData = {
          username: user.email.split('@')[0],
          university: "Unknown University"
        };
      }
      
      // Store current user
      currentUser = user;
      
      // Initialize forum UI
      initializeForumUI();
      
      // Load posts
      loadPosts();
      
    } catch (error) {
      console.error("Error initializing forum:", error);
      showError("Failed to initialize forum. Please try refreshing the page.");
    }
  } else {
    // Redirect to login if not authenticated
    window.location.href = "index.html";
  }
});

function initializeForumUI() {
  // Hide loading indicator
  document.getElementById('loading').style.display = 'none';
  
  // Setup post button functionality
  setupPostButton();
  
  // Setup image upload functionality
  setupImageUpload();
}

function setupPostButton() {
  const postInput = document.getElementById('post-input');
  const submitButton = document.getElementById('submit-post');
  
  // Enable/disable submit button based on input
  postInput.addEventListener('input', () => {
    submitButton.disabled = postInput.value.trim() === '';
  });
  
  // Initialize submit button as disabled
  submitButton.disabled = true;
  
  // Handle post submission
  submitButton.addEventListener('click', async () => {
    const postText = postInput.value.trim();
    
    if (!postText) {
      return; // Don't submit empty posts
    }
    
    if (postText.length > POST_MAX_LENGTH) {
      showError(`Post too long. Maximum ${POST_MAX_LENGTH} characters allowed.`);
      return;
    }
    
    try {
      // Disable button during submission
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      
      // Create post data
      const postData = {
        text: postText,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        username: currentUserData.username || currentUser.email.split('@')[0],
        userImage: currentUserData.photoURL || 'user.jpg',
        university: currentUserData.university || "Unknown University",
        likes: 0,
        comments: 0
      };
      
      // Upload image if selected
      if (selectedPostImage) {
        const imageUrl = await uploadImage(selectedPostImage, 'post-images');
        if (imageUrl) {
          postData.imageUrl = imageUrl;
        }
      }
      
      // Add post to Firestore
      await addDoc(collection(db, "forumPosts"), postData);
      
      // Reset form
      postInput.value = '';
      clearPostImage();
      submitButton.disabled = true;
      submitButton.innerHTML = 'Post';
      
      console.log("Post submitted successfully");
      
    } catch (error) {
      console.error("Error submitting post:", error);
      showError("Failed to submit post. Please try again.");
      
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = 'Post';
    }
  });
}

function setupImageUpload() {
  const imageInput = document.getElementById('post-image-input');
  const addImageButton = document.getElementById('add-post-image');
  const imagePreview = document.getElementById('post-image-preview');
  const previewImg = document.getElementById('post-preview-img');
  const removeImageButton = document.getElementById('remove-post-image');
  
  // Open file dialog when clicking the image button
  addImageButton.addEventListener('click', () => {
    imageInput.click();
  });
  
  // Handle image selection
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Store the file for later upload
      selectedPostImage = file;
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImg.src = event.target.result;
        imagePreview.style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Handle image removal
  removeImageButton.addEventListener('click', () => {
    clearPostImage();
  });
}

function clearPostImage() {
  selectedPostImage = null;
  document.getElementById('post-image-input').value = '';
  document.getElementById('post-image-preview').style.display = 'none';
}

async function uploadImage(imageFile, folder) {
  try {
    // Create a unique file name
    const fileName = `${currentUser.uid}_${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, imageFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
    
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

function loadPosts() {
  try {
    const postsRef = collection(db, "forumPosts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(20));
    
    // Subscribe to posts
    onSnapshot(q, (snapshot) => {
      const postList = document.getElementById('post-list');
      const emptyState = document.getElementById('empty-posts');
      const posts = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {  // Ensure we have a valid timestamp
          posts.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      if (posts.length === 0) {
        emptyState.style.display = 'flex';
      } else {
        emptyState.style.display = 'none';
        
        // Clear existing posts before adding new ones
        // Keep only the empty state element
        const children = Array.from(postList.children);
        children.forEach(child => {
          if (child.id !== 'empty-posts') {
            postList.removeChild(child);
          }
        });
        
        // Add posts
        posts.forEach((post) => {
          appendPost(post);
        });
      }
    }, (error) => {
      console.error("Error loading posts:", error);
      showError("Failed to load posts. Please try refreshing the page.");
    });
    
  } catch (error) {
    console.error("Error setting up post listener:", error);
    showError("Failed to connect to forum. Please try refreshing the page.");
  }
}

function appendPost(post) {
  const postList = document.getElementById('post-list');
  const template = document.getElementById('post-template');
  const postNode = template.content.cloneNode(true);
  
  // Set post data
  postNode.querySelector('.post-author-img').src = post.userImage || 'user.jpg';
  postNode.querySelector('.post-author-name').textContent = post.username;
  
  // Format timestamp
  let formattedTime = 'Just now';
  if (post.createdAt) {
    const timestamp = post.createdAt.toDate();
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      formattedTime = 'Just now';
    } else if (diffMins < 60) {
      formattedTime = `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      const diffHours = Math.floor(diffMins / 60);
      formattedTime = `${diffHours}h ago`;
    } else {
      formattedTime = timestamp.toLocaleDateString();
    }
  }
  postNode.querySelector('.post-time').textContent = formattedTime;
  
  // Set post content
  postNode.querySelector('.post-text').textContent = post.text;
  
  // Show image if available
  const postImage = postNode.querySelector('.post-image');
  if (post.imageUrl) {
    postImage.src = post.imageUrl;
    postImage.style.display = 'block';
  }
  
  // Set like and comment counts
  const actionCounts = postNode.querySelectorAll('.post-action-count');
  actionCounts[0].textContent = post.likes || 0;
  actionCounts[1].textContent = post.comments || 0;
  
  // Set up actions
  const likeButton = postNode.querySelectorAll('.post-action')[0];
  const commentButton = postNode.querySelectorAll('.post-action')[1];
  
  // Like functionality
  likeButton.addEventListener('click', async () => {
    // Toggle like status
    const likeIcon = likeButton.querySelector('i');
    const isLiked = likeIcon.classList.contains('fas');
    
    if (isLiked) {
      likeIcon.classList.replace('fas', 'far');
      actionCounts[0].textContent = Number(actionCounts[0].textContent) - 1;
    } else {
      likeIcon.classList.replace('far', 'fas');
      likeButton.classList.add('active');
      actionCounts[0].textContent = Number(actionCounts[0].textContent) + 1;
    }
    
    // Update like count in database
    // This is simplified - in a real app, you'd track which users liked which posts
    try {
      await updateLikeCount(post.id, !isLiked);
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  });
  
  // Comment functionality
  const repliesContainer = postNode.querySelector('.replies-container');
  commentButton.addEventListener('click', () => {
    if (repliesContainer.style.display === 'none') {
      repliesContainer.style.display = 'block';
      loadComments(post.id, repliesContainer.querySelector('.reply-list'));
    } else {
      repliesContainer.style.display = 'none';
    }
  });
  
  // Reply submission
  const replyForm = postNode.querySelector('.add-reply');
  const replyInput = replyForm.querySelector('.reply-input');
  const replySubmitBtn = replyForm.querySelector('.reply-submit-btn');
  
  replySubmitBtn.addEventListener('click', async () => {
    const replyText = replyInput.value.trim();
    if (!replyText) return;
    
    try {
      await addComment(post.id, replyText);
      replyInput.value = '';
    } catch (error) {
      console.error("Error adding comment:", error);
      showError("Failed to add comment. Please try again.");
    }
  });
  
  // Add post to list
  const emptyState = document.getElementById('empty-posts');
  postList.insertBefore(postNode, emptyState);
}

async function updateLikeCount(postId, isLiking) {
  // In a real app, you would track which users liked which posts
  // This is a simplified version
  try {
    const postRef = doc(db, "forumPosts", postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const currentLikes = postDoc.data().likes || 0;
      await updateDoc(postRef, {
        likes: isLiking ? currentLikes + 1 : Math.max(0, currentLikes - 1)
      });
    }
  } catch (error) {
    console.error("Error updating like count:", error);
    throw error;
  }
}

async function addComment(postId, commentText) {
  try {
    const commentsRef = collection(db, "forumPosts", postId, "comments");
    
    const commentData = {
      text: commentText,
      createdAt: serverTimestamp(),
      userId: currentUser.uid,
      username: currentUserData.username || currentUser.email.split('@')[0],
      userImage: currentUserData.photoURL || 'user.jpg'
    };
    
    await addDoc(commentsRef, commentData);
    
    // Update comment count on post
    const postRef = doc(db, "forumPosts", postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const currentComments = postDoc.data().comments || 0;
      await updateDoc(postRef, {
        comments: currentComments + 1
      });
    }
    
    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

function loadComments(postId, replyListElement) {
  try {
    const commentsRef = collection(db, "forumPosts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    
    // Clear existing comments
    replyListElement.innerHTML = '';
    
    // Subscribe to comments
    onSnapshot(q, (snapshot) => {
      const comments = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          comments.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      if (comments.length === 0) {
        replyListElement.innerHTML = '<p class="text-center text-muted mt-3">No comments yet. Be the first to comment!</p>';
      } else {
        // Clear existing comments
        replyListElement.innerHTML = '';
        
        // Add comments
        comments.forEach((comment) => {
          appendComment(comment, replyListElement);
        });
      }
    }, (error) => {
      console.error("Error loading comments:", error);
      replyListElement.innerHTML = '<p class="text-center text-danger">Failed to load comments. Please try again.</p>';
    });
    
  } catch (error) {
    console.error("Error setting up comment listener:", error);
    replyListElement.innerHTML = '<p class="text-center text-danger">Failed to load comments. Please try refreshing the page.</p>';
  }
}

function appendComment(comment, replyListElement) {
  const template = document.getElementById('reply-template');
  const commentNode = template.content.cloneNode(true);
  
  // Set comment data
  commentNode.querySelector('.reply-author-img').src = comment.userImage || 'user.jpg';
  commentNode.querySelector('.reply-author-name').textContent = comment.username;
  commentNode.querySelector('.reply-text').textContent = comment.text;
  
  // Format timestamp
  let formattedTime = 'Just now';
  if (comment.createdAt) {
    const timestamp = comment.createdAt.toDate();
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      formattedTime = 'Just now';
    } else if (diffMins < 60) {
      formattedTime = `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      const diffHours = Math.floor(diffMins / 60);
      formattedTime = `${diffHours}h ago`;
    } else {
      formattedTime = timestamp.toLocaleDateString();
    }
  }
  commentNode.querySelector('.reply-time').textContent = formattedTime;
  
  // Add comment to list
  replyListElement.appendChild(commentNode);
}

function showError(message) {
  // Create error toast
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-danger border-0 position-fixed bottom-0 end-0 m-3';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>Error:</strong> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Initialize and show the toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Remove the toast after it's hidden
  toast.addEventListener('hidden.bs.toast', () => {
    document.body.removeChild(toast);
  });
}

// Missing function - import this
import { updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";