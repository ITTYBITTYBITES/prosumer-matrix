// ============================================================================
// HEADER COMPONENT
// ============================================================================

import { formatPriceRange } from '../utils/formatUtils.js';

export function Header({
  products = [],
  onToggleDrawer = () => {}
} = {}) {
  return { products, onToggleDrawer };
}

export function renderHeaderHtml(products = []) {
  const categoryCount = new Set(products.map((p) => p.category)).size;
  const priceRange = formatPriceRange(products);

  return `
    <header class="matrix-header">
      <div class="matrix-brand">
        <button
          type="button"
          class="mobile-menu-toggle"
          id="mobileMenuToggle"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <svg class="matrix-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#0EA5E9" />
          <path d="M8 10h16M8 16h12M8 22h8" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="22" r="3" fill="#10B981" />
        </svg>
        <div class="matrix-brand-text">
          <h1 class="matrix-title">PROsumer MATRIX</h1>
          <p class="matrix-subtitle">Hardware & Equipment Specification Database</p>
        </div>
      </div>
      <div class="matrix-stats">
        <div class="stat-item">
          <span class="stat-value">${products.length}</span>
          <span class="stat-label">Products</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${categoryCount}</span>
          <span class="stat-label">Categories</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${priceRange}</span>
          <span class="stat-label">Price Range</span>
        </div>
      </div>
    </header>
  `;
}

export default Header;
