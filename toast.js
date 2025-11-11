// Toast notification content script
(function() {
  'use strict';

  // Create toast container if it doesn't exist
  function getToastContainer() {
    let container = document.getElementById('cache-cleaner-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cache-cleaner-toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  // Create toast element
  function createToast() {
    const toast = document.createElement('div');
    toast.className = 'cache-cleaner-toast';
    toast.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 16px 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    // Add animation keyframes
    if (!document.getElementById('cache-cleaner-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'cache-cleaner-toast-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .cache-cleaner-progress-bar {
          height: 3px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }
        .cache-cleaner-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4A90E2, #357ABD);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }

    return toast;
  }

  // Show toast with message
  function showToast(message, type = 'loading', progress = 0) {
    const container = getToastContainer();
    let toast = container.querySelector('.cache-cleaner-toast');
    
    if (!toast) {
      toast = createToast();
      container.appendChild(toast);
    }

    // Icon based on type
    let icon = '';
    let iconColor = '';
    
    if (type === 'loading') {
      icon = `<div style="width: 20px; height: 20px; border: 3px solid #e0e0e0; border-top-color: #4A90E2; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>`;
    } else if (type === 'success') {
      iconColor = '#28a745';
      icon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" fill="${iconColor}"/>
        <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    } else if (type === 'error') {
      iconColor = '#dc3545';
      icon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" fill="${iconColor}"/>
        <path d="M7 7l6 6M13 7l-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    }

    // Build toast content
    let content = `
      <div style="flex-shrink: 0;">${icon}</div>
      <div style="flex: 1;">
        <div style="font-size: 14px; font-weight: 500; color: #2c3e50;">${message}</div>
    `;

    // Add progress bar if loading
    if (type === 'loading' && progress > 0) {
      content += `
        <div class="cache-cleaner-progress-bar">
          <div class="cache-cleaner-progress-fill" style="width: ${progress}%"></div>
        </div>
      `;
    }

    content += `</div>`;
    toast.innerHTML = content;
  }

  // Remove toast
  function removeToast() {
    const toast = document.querySelector('.cache-cleaner-toast');
    if (toast) {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showToast') {
      showToast(request.message, request.type, request.progress);
      sendResponse({ success: true });
    } else if (request.action === 'hideToast') {
      removeToast();
      sendResponse({ success: true });
    }
    return true;
  });
})();

