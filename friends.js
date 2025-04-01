// Mock data for friends (replace with actual API calls in production)
const mockFriends = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'user.jpg',
    status: 'online',
    topicsStudied: 12,
    studyHours: 45,
    courses: 3
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'user.jpg',
    status: 'offline',
    topicsStudied: 8,
    studyHours: 32,
    courses: 2
  },
  {
    id: 3,
    name: 'Alex Wilson',
    avatar: 'user.jpg',
    status: 'away',
    topicsStudied: 15,
    studyHours: 60,
    courses: 4
  },
  {
    id: 4,
    name: 'Sarah Jones',
    avatar: 'user.jpg',
    status: 'online',
    topicsStudied: 10,
    studyHours: 38,
    courses: 3
  },
  {
    id: 5,
    name: 'Mike Brown',
    avatar: 'user.jpg',
    status: 'offline',
    topicsStudied: 6,
    studyHours: 25,
    courses: 2
  }
];

// DOM Elements
const friendList = document.querySelector('.friend-list');
const searchInput = document.querySelector('.search-box input');
const friendDetails = document.querySelector('.friend-details');
const friendCard = document.querySelector('.friend-card');
const statValues = document.querySelectorAll('.stat-value');
const statLabels = document.querySelectorAll('.stat-label');

// Initialize the friends list
function initializeFriendsList() {
  displayFriends(mockFriends);
  setupEventListeners();
}

// Display friends in the sidebar
function displayFriends(friends) {
  friendList.innerHTML = friends.map(friend => `
    <div class="friend-card" data-id="${friend.id}">
      <img src="${friend.avatar}" alt="${friend.name}" class="friend-avatar">
      <div class="friend-info">
        <div class="friend-name">${friend.name}</div>
        <div class="friend-status ${friend.status}">${friend.status}</div>
      </div>
    </div>
  `).join('');
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filteredFriends = mockFriends.filter(friend => 
      friend.name.toLowerCase().includes(query)
    );
    displayFriends(filteredFriends);
  });

  // Friend card click handler
  friendList.addEventListener('click', (e) => {
    const friendCard = e.target.closest('.friend-card');
    if (friendCard) {
      const friendId = parseInt(friendCard.dataset.id);
      const friend = mockFriends.find(f => f.id === friendId);
      if (friend) {
        displayFriendDetails(friend);
      }
    }
  });

  // Action buttons
  document.querySelector('.action-btn.primary').addEventListener('click', () => {
    alert('Messaging feature coming soon!');
  });

  document.querySelector('.action-btn.secondary').addEventListener('click', () => {
    alert('Add friend feature coming soon!');
  });
}

// Display friend details
function displayFriendDetails(friend) {
  // Update friend card
  friendCard.querySelector('.friend-avatar').src = friend.avatar;
  friendCard.querySelector('.friend-avatar').alt = friend.name;
  friendCard.querySelector('.friend-name').textContent = friend.name;
  friendCard.querySelector('.friend-status').textContent = friend.status;
  friendCard.querySelector('.friend-status').className = `friend-status ${friend.status}`;

  // Update stats
  statValues[0].textContent = friend.topicsStudied;
  statValues[1].textContent = friend.studyHours;
  statValues[2].textContent = friend.courses;

  // Add active state to selected friend card
  document.querySelectorAll('.friend-card').forEach(card => {
    card.classList.remove('active');
    if (parseInt(card.dataset.id) === friend.id) {
      card.classList.add('active');
    }
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initializeFriendsList); 