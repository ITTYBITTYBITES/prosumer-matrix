// ============================================================================
// HEADER COMPONENT
// ============================================================================

export function Header({
  products = [],
  onToggleDrawer = () => {}
} = {}) {
  return { products, onToggleDrawer };
}

export function renderHeaderHtml(products = []) {
  return `
    <header class="matrix-header">
      <div class="matrix-header-left">
        <button
          type="button"
          class="matrix-menu-btn"
          id="menu-toggle"
          aria-label="Open Menu"
          aria-expanded="false"
        >
          &#9776;
        </button>
        <div class="matrix-brand-group">
          <div class="matrix-logo-box" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="matrix-title-wrap">
            <h1 class="matrix-title">PROSUMER MATRIX</h1>
            <p class="matrix-subtitle">HARDWARE &amp; EQUIPMENT SPECIFICATION DATA</p>
          </div>
        </div>
      </div>
    </header>
  `;
}

export default Header;
