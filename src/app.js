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

    // Expose for debugging
    window.__matrixApp = app;

    console.log(`Prosumer Matrix initialized with ${hardwareData.length} products`);
  } catch (error) {
    console.error('Failed to initialize MatrixApp:', error);
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
  }
}

// Auto-start
init();

// Export for potential module usage
export { init, MatrixApp };
export default hardwareData;
