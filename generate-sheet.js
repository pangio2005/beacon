async function generateSheet(topic, educationLevel = 'university12') {
  const apiKey = 'AIzaSyAJJQLYD2wHZu49VgCIzbAuc2XBWFtCBJA';
  
  // Map education level to descriptive text
  const levelMap = {
    'highSchool': 'high school',
    'university12': 'first or second year university',
    'university34': 'third or fourth year university',
    'masters': 'graduate/masters level'
  };
  
  const level = levelMap[educationLevel] || 'university level';
  
  // Show loading state
  const resultDiv = document.getElementById('geminiResult');
  if (!resultDiv) {
    console.error('Could not find geminiResult div');
    return;
  }

  resultDiv.innerHTML = `
    <div class="loading-container">
      <div class="loading-dots">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
      <div class="loading-message">Generating study sheet...</div>
    </div>
  `;

  try {
    // Construct the prompt for study sheet generation
    const prompt = `Create a comprehensive one-page study sheet about "${topic}" suitable for ${level} students.
    Include:
    1. Key Concepts and Definitions
    2. Important Formulas or Rules (if applicable)
    3. Main Ideas and Principles
    4. Examples or Applications
    5. Common Misconceptions or Important Notes

    Format the content with clear sections and bullet points for easy reading.
    Keep explanations concise but thorough.`;

    // Make API request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    const sheetContent = data.candidates[0].content.parts[0].text;
    displaySheet(sheetContent, level);

  } catch (error) {
    console.error('Error generating study sheet:', error);
    resultDiv.innerHTML = `
      <div class="alert alert-danger">
        <h4>Error Generating Study Sheet</h4>
        <p>${error.message}</p>
        <p>Please try again later.</p>
        <button class="btn btn-outline-secondary mt-3" onclick="resetStudyTools()">
          <i class="fas fa-arrow-left"></i> Back to Study Tools
        </button>
      </div>
    `;
  }
}

function displaySheet(content, level) {
  const resultDiv = document.getElementById('geminiResult');
  
  // Convert markdown-style content to HTML
  const formattedContent = content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#\s+(.*?)$/gm, '<h2>$1</h2>')
    .replace(/^##\s+(.*?)$/gm, '<h3>$1</h3>')
    .replace(/^###\s+(.*?)$/gm, '<h4>$1</h4>')
    .replace(/^\d\.\s+(.*?)$/gm, '<li>$1</li>')
    .replace(/^-\s+(.*?)$/gm, '<li>$1</li>');

  const html = `
    <div class="study-sheet">
      <div class="sheet-header mb-4">
        <h2 class="text-center">Study Sheet</h2>
        <div class="text-center text-muted mb-3">Level: ${level}</div>
      </div>
      
      <div class="sheet-content">
        ${formattedContent}
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-outline-secondary" onclick="resetStudyTools()">
          <i class="fas fa-arrow-left"></i> Back to Study Tools
        </button>
      </div>
    </div>
  `;

  resultDiv.innerHTML = html;
}

// Expose the function to the global scope
window.generateSheet = generateSheet; 