function selectOption(option) {
  // Remove selected class from all cards
  document.querySelectorAll('.study-option-card').forEach(card => {
    card.classList.remove('selected');
  });

  // Add selected class to clicked card
  option.classList.add('selected');

  // Show configuration panel
  const configPanel = document.getElementById('config-panel');
  configPanel.style.display = 'block';

  // Update configuration panel content based on selected option
  const optionTitle = option.querySelector('.card-title').textContent;
  const configTitle = document.getElementById('config-title');
  configTitle.textContent = `Configure ${optionTitle}`;

  // Show relevant configuration options
  const configOptions = document.getElementById('config-options');
  configOptions.innerHTML = ''; // Clear existing options

  // Add configuration options based on selected study type
  switch (optionTitle) {
    case 'Flashcards':
      configOptions.innerHTML = `
        <div class="mb-3">
          <label class="form-label">Number of Cards</label>
          <input type="number" class="form-control" min="5" max="50" value="10">
        </div>
        <div class="mb-3">
          <label class="form-label">Difficulty Level</label>
          <select class="form-select">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Topics</label>
          <select class="form-select" multiple>
            <option>Mathematics</option>
            <option>Science</option>
            <option>History</option>
            <option>Literature</option>
          </select>
        </div>
      `;
      break;
    case 'Practice Questions':
      configOptions.innerHTML = `
        <div class="mb-3">
          <label class="form-label">Number of Questions</label>
          <input type="number" class="form-control" min="5" max="50" value="10">
        </div>
        <div class="mb-3">
          <label class="form-label">Question Type</label>
          <select class="form-select" multiple>
            <option>Multiple Choice</option>
            <option>True/False</option>
            <option>Short Answer</option>
            <option>Essay</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Difficulty Level</label>
          <select class="form-select">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      `;
      break;
    case 'Study Timer':
      configOptions.innerHTML = `
        <div class="mb-3">
          <label class="form-label">Study Duration (minutes)</label>
          <input type="number" class="form-control" min="5" max="180" value="25">
        </div>
        <div class="mb-3">
          <label class="form-label">Break Duration (minutes)</label>
          <input type="number" class="form-control" min="5" max="30" value="5">
        </div>
        <div class="mb-3">
          <label class="form-label">Number of Sessions</label>
          <input type="number" class="form-control" min="1" max="8" value="4">
        </div>
      `;
      break;
  }

  // Add start button
  const startButton = document.createElement('button');
  startButton.className = 'btn btn-primary w-100';
  startButton.textContent = 'Start Study Session';
  startButton.onclick = () => {
    // Handle starting the study session
    console.log('Starting study session...');
  };
  configOptions.appendChild(startButton);
} 