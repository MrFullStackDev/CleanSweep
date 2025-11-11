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

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const existing = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
    
    // Only set defaults for missing keys
    const settingsToSet = {};
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      if (existing[key] === undefined) {
        settingsToSet[key] = value;
      }
    }
    
    if (Object.keys(settingsToSet).length > 0) {
      await chrome.storage.sync.set(settingsToSet);
    }
  } catch (error) {
    console.error('Error setting default settings:', error);
  }
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  const startTime = performance.now();
  console.log('🚀 Extension icon clicked!', tab);
  
  try {
    // Get settings
    const settings = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
    console.log(`⚙️  Settings retrieved (${(performance.now() - startTime).toFixed(0)}ms):`, settings);
    
    // Determine if we should clear for current site or all sites
    const scope = settings.scope || 'current';
    console.log('Scope:', scope);
    
    // Get the current tab's origin if clearing current site only
    let origins = [];
    if (scope === 'current' && tab.url) {
      try {
        const url = new URL(tab.url);
        // For chrome://, about:, etc., we can't clear site-specific data
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          origins = [url.origin];
        } else {
          // For special pages, show a badge and notification
          try {
            await chrome.action.setBadgeText({ text: '✗' });
            await chrome.action.setBadgeBackgroundColor({ color: '#dc3545' });
            
            setTimeout(() => {
              chrome.action.setBadgeText({ text: '' }).catch(() => {});
            }, 2000);
          } catch (badgeError) {
            console.log('Could not set badge:', badgeError.message);
          }
          
          
          return;
        }
      } catch (error) {
        console.error('Error parsing URL:', error);
        return;
      }
    }
    
    // Ensure toast script is injected
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['toast.js']
      });
      console.log(`📜 Toast script injected (${(performance.now() - startTime).toFixed(0)}ms)`);
    } catch (injectError) {
      console.log('Toast script already loaded or cannot inject:', injectError.message);
    }
    
    // Small delay to ensure toast is ready
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Show initial toast notification
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showToast',
        message: 'Clearing data...',
        type: 'loading',
        progress: 0
      });
    } catch (toastError) {
      console.log('Could not show toast:', toastError.message);
    }
    
    // Clear data based on settings
    console.log(`🧹 Starting to clear data... (${(performance.now() - startTime).toFixed(0)}ms)`, { settings, origins });
    
    // Update progress: 30%
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showToast',
        message: 'Clearing data...',
        type: 'loading',
        progress: 30
      });
    } catch (e) {}
    
    const clearStartTime = performance.now();
    await clearBrowsingData(settings, origins);
    const clearDuration = (performance.now() - clearStartTime).toFixed(0);
    console.log(`✨ Data cleared successfully! (took ${clearDuration}ms, total ${(performance.now() - startTime).toFixed(0)}ms)`);
    
    // Update progress: 70%
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showToast',
        message: 'Data cleared!',
        type: 'loading',
        progress: 70
      });
    } catch (e) {}
    
    // Count what was cleared
    const clearedItems = [];
    if (settings.clearCookies) clearedItems.push('Cookies');
    if (settings.clearCache) clearedItems.push('Cache');
    if (settings.clearLocalStorage) clearedItems.push('Local Storage');
    if (settings.clearSessionStorage) clearedItems.push('Session Storage');
    if (settings.clearIndexedDB) clearedItems.push('IndexedDB');
    if (settings.clearServiceWorkers) clearedItems.push('Service Workers');
    if (settings.clearHistory) clearedItems.push('History');
    
    const scopeText = scope === 'current' ? 'current site' : 'all sites';
    const itemsText = clearedItems.length > 0 ? clearedItems.join(', ') : 'No items';
    
    // Update last cleared timestamp
    await chrome.storage.local.set({ 
      lastCleared: Date.now(),
      lastClearedItems: clearedItems,
      lastClearedScope: scope
    });
    
    // Show success toast briefly
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showToast',
        message: `Cleared ${itemsText} (${scopeText})`,
        type: 'success',
        progress: 100
      });
    } catch (e) {}
    
    // Quick 400ms delay to show success, then reload
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Reload the current page to apply changes
    console.log(`🔄 Reloading tab: ${tab.id} (${(performance.now() - startTime).toFixed(0)}ms)`);
    try {
      if (tab && tab.id) {
        await chrome.tabs.reload(tab.id);
        const totalTime = (performance.now() - startTime).toFixed(0);
        console.log(`✅ Tab reloaded successfully! TOTAL TIME: ${totalTime}ms`);
      }
    } catch (reloadError) {
      console.error('Could not reload tab:', reloadError);
    }
    
    // Show success badge (globally, not tied to specific tab)
    try {
      await chrome.action.setBadgeText({ text: '✓' });
      await chrome.action.setBadgeBackgroundColor({ color: '#28a745' });
      
      // Clear badge after 5 seconds
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' }).catch(() => {
          // Ignore errors if extension is being reloaded
        });
      }, 5000);
    } catch (badgeError) {
      // Ignore badge errors - not critical
      console.log('Could not set badge:', badgeError.message);
    }
    
  } catch (error) {
    console.error('Error clearing data:', error);
    console.error('Error stack:', error.stack);
    
    // Show error toast
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showToast',
        message: 'Error clearing data',
        type: 'error',
        progress: 0
      });
      
      // Auto-hide error after 3 seconds
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'hideToast' });
        } catch (e) {}
      }, 3000);
    } catch (toastError) {
      console.error('Error showing error toast:', toastError);
    }
    
    // Show error badge
    try {
      await chrome.action.setBadgeText({ text: '!' });
      await chrome.action.setBadgeBackgroundColor({ color: '#dc3545' });
      
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' }).catch(() => {});
      }, 5000);
    } catch (badgeError) {
      console.log('Could not set badge:', badgeError.message);
    }
  }
});

// Clear browsing data based on settings
async function clearBrowsingData(settings, origins = []) {
  console.log('clearBrowsingData called with:', { settings, origins });
  
  const dataToRemove = {};
  const options = {};
  
  // Set time range to clear everything
  options.since = 0;
  
  // Set origins if clearing current site only
  if (origins.length > 0) {
    options.origins = origins;
    console.log('Clearing for specific origins:', origins);
  } else {
    console.log('Clearing for all sites');
  }
  
  // Build the data removal object based on settings
  if (settings.clearCookies) {
    dataToRemove.cookies = true;
  }
  
  if (settings.clearCache) {
    dataToRemove.cache = true;
    dataToRemove.cacheStorage = true;
  }
  
  if (settings.clearLocalStorage) {
    dataToRemove.localStorage = true;
  }
  
  if (settings.clearSessionStorage) {
    // Session storage is cleared with localStorage in Chrome API
    dataToRemove.localStorage = true;
  }
  
  if (settings.clearIndexedDB) {
    dataToRemove.indexedDB = true;
  }
  
  if (settings.clearServiceWorkers) {
    dataToRemove.serviceWorkers = true;
  }
  
  if (settings.clearHistory) {
    dataToRemove.history = true;
  }
  
  // Additional data types that are related
  if (settings.clearCache) {
    dataToRemove.fileSystems = true;
    dataToRemove.webSQL = true;
  }
  
  // Clear the data
  console.log('Calling chrome.browsingData.remove with:', { options, dataToRemove });
  
  try {
    // Use Promise.race to timeout if it takes too long
    const clearPromise = chrome.browsingData.remove(options, dataToRemove);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Clearing timeout')), 5000)
    );
    
    await Promise.race([clearPromise, timeoutPromise]);
    console.log('chrome.browsingData.remove completed successfully');
    
    // For current site cookies, use faster direct cookie removal
    if (origins.length > 0 && settings.clearCookies) {
      console.log('Clearing cookies for specific origins (fast method)...');
      // Run in parallel with a timeout
      await Promise.race([
        clearCookiesForOriginsFast(origins),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Cookie timeout')), 2000))
      ]).catch(err => console.log('Cookie clearing timed out, continuing...'));
      console.log('Cookies cleared for origins');
    }
    
  } catch (error) {
    if (error.message === 'Clearing timeout') {
      console.warn('⚠️ Clearing took too long, continuing anyway...');
      // Continue execution even if it times out
    } else {
      console.error('Error in browsingData.remove:', error);
      console.error('Error details:', { options, dataToRemove });
      throw error;
    }
  }
}

// Faster cookie clearing method
async function clearCookiesForOriginsFast(origins) {
  const promises = [];
  
  for (const origin of origins) {
    try {
      const url = new URL(origin);
      const domain = url.hostname;
      
      // Get and remove cookies in parallel
      const promise = chrome.cookies.getAll({ domain }).then(cookies => {
        return Promise.all(cookies.map(cookie => {
          const protocol = cookie.secure ? 'https:' : 'http:';
          const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
          return chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name,
            storeId: cookie.storeId
          }).catch(() => {}); // Ignore individual failures
        }));
      });
      
      promises.push(promise);
    } catch (error) {
      console.error('Error parsing origin:', error);
    }
  }
  
  await Promise.all(promises);
}

// Old slower method - kept for reference but not used
async function clearCookiesForOriginsOld(origins) {
  try {
    for (const origin of origins) {
      const url = new URL(origin);
      const domain = url.hostname;
      
      // Get all cookies for this domain
      const cookies = await chrome.cookies.getAll({ domain });
      
      // Also get cookies for subdomains
      const cookiesWithDot = await chrome.cookies.getAll({ domain: `.${domain}` });
      
      const allCookies = [...cookies, ...cookiesWithDot];
      
      // Remove each cookie
      for (const cookie of allCookies) {
        const protocol = cookie.secure ? 'https:' : 'http:';
        const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
        
        try {
          await chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name,
            storeId: cookie.storeId
          });
        } catch (error) {
          console.error('Error removing cookie:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error clearing cookies for origins:', error);
  }
}

// Listen for messages from popup or settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clearNow') {
    // Allow manual clearing trigger from popup if needed
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        chrome.action.onClicked.dispatch(tabs[0]);
      }
    });
    sendResponse({ success: true });
  }
  return true;
});

