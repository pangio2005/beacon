document.addEventListener('DOMContentLoaded', () => {
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationDropdown = document.querySelector('.notification-dropdown');

  // Toggle notification dropdown
  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!notificationBtn.contains(e.target)) {
      notificationDropdown.classList.remove('show');
    }
  });
}); 