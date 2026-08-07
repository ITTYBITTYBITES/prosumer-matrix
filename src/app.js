// ============================================================================
// APP ENTRY POINT
// ============================================================================
// Initializes the Matrix Application
// ============================================================================

import './styles/main.css';
import { MatrixApp } from './components/MatrixApp.js';
import hardwareData from './data/hardware.json' assert { type: 'json' };

/** 
 * Initialize the application
 */
function init() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startApp();
    });
  } else {
    startApp();
  }
}

/** 
 * Start the Matrix Application
 */
function startApp() {
  const container = document.getElementById('matrixContainer');

  if (!container) {
    console.error('Matrix container not found');
    return;
  }

  try {
    // Initialize the MatrixApp
    const app = new MatrixApp('#matrixContainer', hardwareData);

    // Hide loading state after app initializes
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
      loadingState.classList.add('loaded');
      // Remove from DOM after transition to free up memory
      setTimeout(() => {
        if (loadingState.parentNode) {
          loadingState.parentNode.removeChild(loadingState);
        }
      }, 300);
    }

    // Expose for debugging
    window.__matrixApp = app;

    console.log(`Prosumer Matrix initialized with ${hardwareData.length} products`);
  } catch (error) {
    console.error('Failed to initialize MatrixApp:', error);
    const container = document.getElementById('matrixContainer');
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <h2>Initialization Error</h2>
          <p>Failed to load the specification matrix. Please refresh the page.</p>
          <details>
            <summary>Error details</summary>
            <pre>${error.message}</pre>
          </details>
        </div>
      `;
      // Still hide loading state on error
      const loadingState = document.getElementById('loadingState');
      if (loadingState) {
        loadingState.classList.add('loaded');
      }
    }
  }
}

// Auto-start
init();

// Register service worker for offline support and cache management
if ('serviceWorker' in navigator) {
  // Wait for the page to fully load before registering
  window.addEventListener('load', () => {
    // The service worker is at /sw.js which becomes /prosumer-matrix/sw.js when deployed
    // Its scope will be /prosumer-matrix/ which takes precedence over root site's SW
    navigator.serviceWorker.register('/prosumer-matrix/sw.js', {
      scope: '/prosumer-matrix/'
    })
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content available, refreshing...');
                // Optionally auto-refresh or notify user
                // window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Export for potential module usage
export { init, MatrixApp };
export default hardwareData;
