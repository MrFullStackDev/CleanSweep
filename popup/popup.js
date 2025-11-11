// Load and display settings
async function loadAndDisplaySettings() {
  try {
    const settings = await chrome.storage.sync.get([
      'scope',
      'clearCookies',
      'clearCache',
      'clearLocalStorage',
      'clearSessionStorage',
      'clearIndexedDB',
      'clearServiceWorkers',
      'clearHistory'
    ]);

    // Update mode indicator
    updateModeIndicator(settings.scope || 'current');

    // Update active items list
    updateActiveItems(settings);

    // Update last cleared time
    updateLastClearedDisplay();
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Update mode indicator
function updateModeIndicator(scope) {
  const modeTitle = document.getElementById('modeTitle');
  const modeDescription = document.getElementById('modeDescription');
  const modeIndicator = document.getElementById('modeIndicator');

  if (scope === 'current') {
    modeTitle.textContent = 'Current Site Only';
    modeDescription.textContent = 'Clearing data for this site only';
    modeIndicator.querySelector('.mode-icon').textContent = '🎯';
  } else {
    modeTitle.textContent = 'All Sites';
    modeDescription.textContent = 'Clearing data for all websites';
    modeIndicator.querySelector('.mode-icon').textContent = '🌐';
  }
}

// Update active items display
function updateActiveItems(settings) {
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = '';

  const itemMap = {
    clearCookies: 'Cookies',
    clearCache: 'Cache',
    clearLocalStorage: 'Local Storage',
    clearSessionStorage: 'Session Storage',
    clearIndexedDB: 'IndexedDB',
    clearServiceWorkers: 'Service Workers',
    clearHistory: 'History'
  };

  const activeItems = Object.entries(itemMap)
    .filter(([key]) => settings[key])
    .map(([, label]) => label);

  if (activeItems.length === 0) {
    itemsList.innerHTML = '<span style="color: #7f8c8d; font-size: 12px;">No items selected</span>';
    return;
  }

  activeItems.forEach(item => {
    const badge = document.createElement('span');
    badge.className = 'item-badge';
    badge.textContent = item;
    itemsList.appendChild(badge);
  });
}

// Update last cleared display
async function updateLastClearedDisplay() {
  try {
    const result = await chrome.storage.local.get(['lastCleared', 'lastClearedItems', 'lastClearedScope']);
    const lastClearedElement = document.getElementById('lastCleared');
    
    if (result.lastCleared) {
      const date = new Date(result.lastCleared);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      let timeText;
      if (diffMins < 1) {
        timeText = 'Just now';
        // Show success message if very recent (less than 10 seconds)
        if (diffMs < 10000) {
          showSuccess();
        }
      } else if (diffMins < 60) {
        timeText = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        timeText = date.toLocaleDateString();
      }
      
      // Build detailed message
      let message = `Last cleared: ${timeText}`;
      if (result.lastClearedItems && result.lastClearedItems.length > 0) {
        const itemsText = result.lastClearedItems.join(', ');
        const scopeText = result.lastClearedScope === 'current' ? ' (current site)' : ' (all sites)';
        message += ` - ${itemsText}${scopeText}`;
      }
      
      lastClearedElement.textContent = message;
    } else {
      lastClearedElement.textContent = 'No data cleared yet';
    }
  } catch (error) {
    console.error('Error loading last cleared time:', error);
  }
}

// Show success status
function showSuccess() {
  const statusSection = document.getElementById('statusSection');
  statusSection.classList.add('show');
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusSection.classList.remove('show');
  }, 3000);
}

// Open settings page
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplaySettings();

  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', openSettings);

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      loadAndDisplaySettings();
    }
    if (namespace === 'local' && changes.lastCleared) {
      updateLastClearedDisplay();
      showSuccess();
    }
  });
});

