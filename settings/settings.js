// Default settings
const DEFAULT_SETTINGS = {
  scope: 'current',
  clearCookies: true,
  clearCache: true,
  clearLocalStorage: true,
  clearSessionStorage: true,
  clearIndexedDB: false,
  clearServiceWorkers: false,
  clearHistory: false
};

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    applySettings(result);
    updateLastClearedDisplay();
  } catch (error) {
    console.error('Error loading settings:', error);
    applySettings(DEFAULT_SETTINGS);
  }
}

// Apply settings to UI
function applySettings(settings) {
  // Set scope radio buttons
  if (settings.scope === 'current') {
    document.getElementById('scopeCurrent').checked = true;
  } else {
    document.getElementById('scopeAll').checked = true;
  }

  // Set toggle switches
  document.getElementById('clearCookies').checked = settings.clearCookies;
  document.getElementById('clearCache').checked = settings.clearCache;
  document.getElementById('clearLocalStorage').checked = settings.clearLocalStorage;
  document.getElementById('clearSessionStorage').checked = settings.clearSessionStorage;
  document.getElementById('clearIndexedDB').checked = settings.clearIndexedDB;
  document.getElementById('clearServiceWorkers').checked = settings.clearServiceWorkers;
  document.getElementById('clearHistory').checked = settings.clearHistory;
}

// Save settings to storage
async function saveSettings() {
  const settings = {
    scope: document.querySelector('input[name="scope"]:checked').value,
    clearCookies: document.getElementById('clearCookies').checked,
    clearCache: document.getElementById('clearCache').checked,
    clearLocalStorage: document.getElementById('clearLocalStorage').checked,
    clearSessionStorage: document.getElementById('clearSessionStorage').checked,
    clearIndexedDB: document.getElementById('clearIndexedDB').checked,
    clearServiceWorkers: document.getElementById('clearServiceWorkers').checked,
    clearHistory: document.getElementById('clearHistory').checked
  };

  try {
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
  
  // Clear message after 3 seconds
  setTimeout(() => {
    statusElement.textContent = '';
    statusElement.className = 'status-message';
  }, 3000);
}

// Update last cleared display
async function updateLastClearedDisplay() {
  try {
    const result = await chrome.storage.local.get('lastCleared');
    if (result.lastCleared) {
      const date = new Date(result.lastCleared);
      const formatted = date.toLocaleString();
      document.getElementById('lastCleared').textContent = `Last cleared: ${formatted}`;
    }
  } catch (error) {
    console.error('Error loading last cleared time:', error);
  }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  // Save on any change
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', saveSettings);
  });

  // Listen for clearing events to update last cleared display
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.lastCleared) {
      updateLastClearedDisplay();
    }
  });
});

