// ============================================================================
// MATRIX APP COMPONENT
// ============================================================================
// Main application component for the Hardware & Equipment Spec Matrix
// Handles rendering, filtering, sorting, responsive views, carousel, and modals
// ============================================================================

import { getImageUrl, getProductImageFallback } from '../utils/imageProxy.js';
import { buildProductLink, getNetworkDisplayName } from '../utils/linkBuilder.js';
import { renderSpecsModalContent, formatSpecKey, formatSpecValue } from './SpecsModal.js';
import { formatPriceRange, formatCurrency } from '../utils/formatUtils.js';
import { renderImageCarouselHtml } from './ImageCarousel.js';

/**
 * MatrixApp - Main application class
 */
export class MatrixApp {
  constructor(container, products) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    this.products = products || [];
    this.filteredProducts = [...this.products];
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.sortColumn = 'name';
    this.sortDirection = 'asc';
    this.selectedProduct = null;
    this.isDrawerOpen = false;

    this.render();
    this.attachEventListeners();
  }

  /**
   * Set selected product for Full Specs modal
   * @param {Object|null} product
   */
  setSelectedProduct(product) {
    this.selectedProduct = product;
    if (product) {
      this.showSpecsModal(product);
    } else {
      this.hideModal('specsModal');
    }
  }

  /**
   * Toggle the mobile slide-out drawer
   * @param {boolean} [open]
   */
  toggleDrawer(open) {
    this.isDrawerOpen = typeof open === 'boolean' ? open : !this.isDrawerOpen;
    const drawer = this.container.querySelector('#mobileDrawer');
    const toggleBtn = this.container.querySelector('#mobileMenuToggle');

    if (drawer) {
      drawer.classList.toggle('open', this.isDrawerOpen);
      drawer.setAttribute('aria-hidden', (!this.isDrawerOpen).toString());
    }

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', this.isDrawerOpen.toString());
    }
  }

  /**
   * Render the complete application UI
   */
  render() {
    this.container.innerHTML = `
      <div class="matrix-app">
        <!-- Header -->
        <header class="matrix-header">
          <div class="matrix-brand">
            <button
              type="button"
              class="mobile-menu-toggle"
              id="mobileMenuToggle"
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round"/>
              </svg>
            </button>
            <svg class="matrix-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#0EA5E9"/>
              <path d="M8 10h16M8 16h12M8 22h8" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="24" cy="22" r="3" fill="#10B981"/>
            </svg>
            <div class="matrix-brand-text">
              <h1 class="matrix-title">PROSUMER MATRIX</h1>
              <p class="matrix-subtitle">HARDWARE & EQUIPMENT SPECIFICATION DATA</p>
            </div>
          </div>
          <div class="matrix-stats">
            <div class="stat-item">
              <span class="stat-value">${this.products.length}</span>
              <span class="stat-label">Products</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.getCategoryCount()}</span>
              <span class="stat-label">Categories</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.getPriceRange()}</span>
              <span class="stat-label">Price Range</span>
            </div>
          </div>
        </header>
        <div class="header-disclosure" style="text-align: center; margin-top: -12px; margin-bottom: 12px; font-size: 11px; color: rgba(148, 163, 184, 0.8);">
          We may earn an affiliate commission from merchant links on this site at no extra cost to you.
        </div>

        <!-- Slide-Out Mobile Drawer -->
        <div class="mobile-drawer" id="mobileDrawer" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Mobile Navigation">
          <div class="drawer-overlay" id="drawerOverlay"></div>
          <div class="drawer-panel">
            <div class="drawer-header">
              <div class="drawer-brand">
                <svg class="matrix-logo" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="6" fill="#0EA5E9"/>
                  <path d="M8 10h16M8 16h12M8 22h8" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="24" cy="22" r="3" fill="#10B981"/>
                </svg>
                <div class="drawer-brand-text">
                  <h2 class="drawer-title">PROSUMER MATRIX</h2>
                  <p class="drawer-subtitle">Categories & Controls</p>
                </div>
              </div>
              <button type="button" class="drawer-close" id="drawerClose" aria-label="Close navigation menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="drawer-body">
              <div class="drawer-section">
                <h3 class="drawer-section-title">Hardware Categories</h3>
                <div class="drawer-categories" id="drawerCategories">
                  ${this.getDrawerCategories()}
                </div>
              </div>
              <div class="drawer-section">
                <h3 class="drawer-section-title">Database Overview</h3>
                <div class="drawer-stats">
                  <div class="drawer-stat">
                    <span class="drawer-stat-val">${this.products.length}</span>
                    <span class="drawer-stat-lbl">Total Products</span>
                  </div>
                  <div class="drawer-stat">
                    <span class="drawer-stat-val">${this.getCategoryCount()}</span>
                    <span class="drawer-stat-lbl">Categories</span>
                  </div>
                  <div class="drawer-stat">
                    <span class="drawer-stat-val">${this.getPriceRange()}</span>
                    <span class="drawer-stat-lbl">Price Range</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="matrix-controls">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              class="matrix-search"
              placeholder="Search specs, names, brands..."
              id="searchInput"
              aria-label="Search products"
            >
            <button type="button" class="search-clear" id="searchClear" aria-label="Clear search" style="display: none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="category-pills-scroll" aria-label="Category filters">
            <div class="category-pills" id="categoryPills" role="tablist" aria-label="Filter by category">
              ${this.getCategoryPills()}
            </div>
          </div>

          <div class="sort-controls">
            <label class="sort-label" for="sortSelect">Sort by:</label>
            <select id="sortSelect" class="sort-select" aria-label="Sort products">
              <option value="name" ${this.sortColumn === 'name' ? 'selected' : ''}>Name</option>
              <option value="priceUsd" ${this.sortColumn === 'priceUsd' ? 'selected' : ''}>Price</option>
              <option value="roiScore" ${this.sortColumn === 'roiScore' ? 'selected' : ''}>ROI Score</option>
            </select>
            <button type="button" class="sort-direction" id="sortDirection" aria-label="Toggle sort direction" title="${this.sortDirection === 'asc' ? 'Ascending' : 'Descending'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${this.sortDirection === 'desc' ? 'rotated' : ''}">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info">
          <span class="results-count">${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? 's' : ''}</span>
          ${this.searchQuery ? `<span class="search-query">matching "${this.escapeHtml(this.searchQuery)}"</span>` : ''}
        </div>

        <!-- Main Content (Desktop & Tablet Table) -->
        <div class="matrix-content" id="matrixContent">
          ${this.getDesktopView()}
        </div>

        <!-- Mobile Card View -->
        <div class="matrix-mobile-view" id="mobileView" style="display: none;">
          ${this.getMobileCards()}
        </div>

        <!-- Footer Legal Disclosure -->
        <footer class="matrix-footer" style="padding: 24px; text-align: center; font-size: 12px; color: rgba(148, 163, 184, 0.7); border-top: 1px solid var(--border-color); margin-top: 32px;">
          <p>PROSUMER MATRIX is an independent hardware specification database. We participate in affiliate programs with Amazon, Awin, Impact, and other retailers. When you click links to buy products through our site, we may earn a commission that supports our independent research at no additional cost to you.</p>
        </footer>
      </div>

      <!-- Buy Modal -->
      <div class="matrix-modal" id="buyModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modalTitle">Purchase Options</h2>
            <button type="button" class="modal-close" id="modalClose" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="modalBody">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>

      <!-- Full Specs Modal -->
      <div class="matrix-modal" id="specsModal" role="dialog" aria-modal="true" aria-labelledby="specsModalTitle">
        <div class="modal-overlay" id="specsModalOverlay"></div>
        <div class="modal-content modal-specs">
          <div class="modal-header">
            <h2 id="specsModalTitle">Full Specifications</h2>
            <button type="button" class="modal-close" id="specsModalClose" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="specsModalBody">
            <!-- Dynamic content populated by showSpecsModal -->
          </div>
        </div>
      </div>
    `;

    // Render category pills
    const categoryContainer = this.container.querySelector('#categoryPills');
    if (categoryContainer) {
      categoryContainer.innerHTML = this.getCategoryPills();
    }

    // Render initial view
    this.updateViews();
  }

  /**
   * Get the desktop table view HTML
   */
  getDesktopView() {
    return `
      <div class="matrix-table-wrapper">
        <table class="matrix-table" id="matrixTable">
          <thead>
            <tr>
              <th class="th-product" scope="col">
                <div class="th-content">
                  <span class="th-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </span>
                  <button type="button" class="th-sort-btn" data-column="name" aria-label="Sort by name">
                    Product
                    <svg class="sort-arrow ${this.sortColumn === 'name' ? 'active' : ''} ${this.sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-brand" scope="col">
                <div class="th-content">
                  <button type="button" class="th-sort-btn" data-column="brand" aria-label="Sort by brand">
                    Brand
                    <svg class="sort-arrow ${this.sortColumn === 'brand' ? 'active' : ''} ${this.sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-specs" scope="col">
                <div class="th-content">
                  <button type="button" class="th-sort-btn" data-column="specs" aria-label="Sort by specs" disabled>
                    Key Specifications
                  </button>
                </div>
              </th>
              <th class="th-price-roi" scope="col">
                <div class="th-content">
                  <button type="button" class="th-sort-btn" data-column="priceUsd" aria-label="Sort by price">
                    Price / ROI
                    <svg class="sort-arrow ${this.sortColumn === 'priceUsd' ? 'active' : ''} ${this.sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-action" scope="col">
                <div class="th-content">
                  <span class="th-label">Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody id="tableBody">
            ${this.getTableRows()}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Get table rows HTML
   */
  getTableRows() {
    if (this.filteredProducts.length === 0) {
      return `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <p class="empty-text">No products match your search</p>
            <p class="empty-hint">Try adjusting your filters or search terms</p>
          </td>
        </tr>
      `;
    }

    return this.filteredProducts.map(product => {
      const rawList = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);
      const firstImage = rawList[0] || product.imageUrl;
      const imageUrl = getImageUrl(firstImage, 80) || firstImage;
      const imageFallback = getProductImageFallback(product);
      const productLink = buildProductLink(product);

      return `
        <tr class="matrix-row" data-id="${product.id}" data-category="${product.category}">
          <td class="td-product" data-action="specs" title="Click to view full specifications">
            <div class="product-cell">
              <div class="product-thumbnail">
                <img
                  src="${imageUrl}"
                  alt="${this.escapeHtml(product.name)}"
                  loading="lazy"
                  onerror="this.onerror=null;this.src='${imageFallback}';"
                  class="product-image"
                >
              </div>
              <div class="product-info">
                <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
                <span class="product-brand">${this.escapeHtml(product.brand)}</span>
              </div>
            </div>
          </td>
          <td class="td-brand">${this.escapeHtml(product.brand)}</td>
          <td class="td-specs" data-action="specs" title="Click to view full specifications">
            <div class="specs-preview">
              ${this.getSpecsPreview(product.specs)}
            </div>
          </td>
          <td class="td-price-roi">
            <span class="price-value">${formatCurrency(product.priceUsd)}</span>
            <span class="roi-inline">ROI ${product.roiScore || 'N/A'}</span>
          </td>
          <td class="td-action">
            <div class="action-cell">
              <a
                href="${productLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-buy whitespace-nowrap"
                aria-label="View ${this.escapeHtml(product.name)} in a new tab"
              >
                View Item →
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Get mobile cards HTML with ImageCarousel
   */
  getMobileCards() {
    if (this.filteredProducts.length === 0) {
      return `
        <div class="mobile-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>No products match your search</p>
        </div>
      `;
    }

    return this.filteredProducts.map(product => {
      const productLink = buildProductLink(product);
      const carouselHtml = renderImageCarouselHtml(product, 0);

      return `
        <div class="mobile-card" data-id="${product.id}">
          <div class="mobile-card-image">
            ${carouselHtml}
          </div>
          <div class="mobile-card-body">
            <h3 class="mobile-card-title cursor-pointer" data-action="specs" data-id="${product.id}">${this.escapeHtml(product.name)}</h3>
            <p class="mobile-card-brand">${this.escapeHtml(product.brand)}</p>

            <div class="mobile-card-specs" data-action="specs" data-id="${product.id}">
              ${this.getMobileSpecs(product.specs)}
            </div>

            <div class="mobile-card-footer">
              <div class="mobile-price">
                <span class="price-value">${formatCurrency(product.priceUsd)}</span>
              </div>
              <div class="mobile-roi">
                <span class="roi-label">ROI</span>
                <span class="roi-value">${product.roiScore || 'N/A'}/100</span>
              </div>
            </div>

            <div class="mobile-card-actions">
              <button
                type="button"
                class="btn-fullspecs"
                data-id="${product.id}"
                aria-label="View full specifications for ${this.escapeHtml(product.name)}"
              >
                Full Specs
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </button>
              <a
                href="${productLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-buy mobile-card-cta whitespace-nowrap"
                aria-label="View ${this.escapeHtml(product.name)} in a new tab"
              >
                View Item →
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Get specs preview for desktop table
   */
  getSpecsPreview(specs) {
    if (!specs || Object.keys(specs).length === 0) {
      return '<span class="spec-empty">No specs available</span>';
    }

    return Object.entries(specs).slice(0, 3).map(([key, val]) => `
      <div class="spec-item">
        <span class="spec-label">${this.escapeHtml(this.formatSpecKey(key))}:</span>
        <span class="spec-val">${this.escapeHtml(this.formatSpecValue(val))}</span>
      </div>
    `).join('');
  }

  /**
   * Get specs for mobile cards
   */
  getMobileSpecs(specs) {
    if (!specs || Object.keys(specs).length === 0) {
      return '<span class="spec-empty">No specs available</span>';
    }

    return Object.entries(specs).slice(0, 2).map(([key, val]) => `
      <div class="mobile-spec">
        <span class="mobile-spec-label">${this.escapeHtml(this.formatSpecKey(key))}</span>
        <span class="mobile-spec-value">${this.escapeHtml(this.formatSpecValue(val))}</span>
      </div>
    `).join('');
  }

  formatSpecKey(key) {
    return formatSpecKey(key);
  }

  formatSpecValue(val) {
    return formatSpecValue(val);
  }

  /**
   * Get category pills HTML
   */
  getCategoryPills() {
    const categories = ['all', ...new Set(this.products.map(p => p.category))];
    return categories.map(cat => {
      const label = cat === 'all' ? 'All' : cat;
      return `
        <button
          type="button"
          class="category-pill ${this.selectedCategory === cat ? 'active' : ''}"
          data-category="${this.escapeHtml(cat)}"
          role="tab"
          aria-selected="${this.selectedCategory === cat}"
        >
          ${this.escapeHtml(label)}
        </button>
      `;
    }).join('');
  }

  /**
   * Get drawer categories HTML
   */
  getDrawerCategories() {
    const categories = ['all', ...new Set(this.products.map(p => p.category))];
    return categories.map(cat => {
      const label = cat === 'all' ? 'All Products' : cat;
      const count = cat === 'all'
        ? this.products.length
        : this.products.filter(p => p.category === cat).length;

      return `
        <button
          type="button"
          class="drawer-category-btn ${this.selectedCategory === cat ? 'active' : ''}"
          data-category="${this.escapeHtml(cat)}"
        >
          <span>${this.escapeHtml(label)}</span>
          <span class="drawer-category-count">${count}</span>
        </button>
      `;
    }).join('');
  }

  /**
   * Get number of categories
   */
  getCategoryCount() {
    return new Set(this.products.map(p => p.category)).size;
  }

  /**
   * Get price range string without duplicate currency symbols
   */
  getPriceRange() {
    return formatPriceRange(this.products);
  }

  /**
   * Escape HTML entities
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return String(text ?? '');
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Attach event listeners using robust event delegation
   */
  attachEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#searchInput');
    const searchClear = this.container.querySelector('#searchClear');

    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = this.searchQuery ? 'flex' : 'none';
      }
      this.applyFilters();
    });

    searchClear?.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      this.searchQuery = '';
      searchClear.style.display = 'none';
      this.applyFilters();
    });

    // Mobile Hamburger Menu Toggle
    const mobileMenuToggle = this.container.querySelector('#mobileMenuToggle');
    mobileMenuToggle?.addEventListener('click', () => {
      this.toggleDrawer();
    });

    const drawerClose = this.container.querySelector('#drawerClose');
    drawerClose?.addEventListener('click', () => {
      this.toggleDrawer(false);
    });

    const drawerOverlay = this.container.querySelector('#drawerOverlay');
    drawerOverlay?.addEventListener('click', () => {
      this.toggleDrawer(false);
    });

    // Drawer Categories
    this.container.querySelector('#drawerCategories')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.drawer-category-btn');
      if (btn) {
        const category = btn.dataset.category;
        this.selectCategory(category);
        this.toggleDrawer(false);
      }
    });

    // Category pills click
    this.container.querySelector('#categoryPills')?.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (pill) {
        const category = pill.dataset.category;
        this.selectCategory(category);
      }
    });

    // Sort select
    const sortSelect = this.container.querySelector('#sortSelect');
    sortSelect?.addEventListener('change', (e) => {
      this.sortColumn = e.target.value;
      this.sortDirection = 'asc';
      this.applyFilters();
      this.updateSortIndicators();
    });

    // Sort direction button
    const sortDirectionBtn = this.container.querySelector('#sortDirection');
    sortDirectionBtn?.addEventListener('click', () => {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.applyFilters();
      this.updateSortIndicators();
    });

    // Table sort buttons
    this.container.querySelectorAll('.th-sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const column = btn.dataset.column;
        if (column === 'specs') return;

        const isCurrent = column === this.sortColumn;
        this.sortColumn = column;
        this.sortDirection = isCurrent && this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.applyFilters();
        this.updateSortIndicators();
      });
    });

    // Global Container Event Delegation for Full Specs, Modals, and Carousel
    this.container.addEventListener('click', (e) => {
      // 1. Carousel Arrow Previous
      const prevBtn = e.target.closest('[data-carousel-action="prev"]');
      if (prevBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = prevBtn.dataset.productId;
        const carousel = prevBtn.closest('.image-carousel');
        this.navigateCarousel(carousel, productId, -1);
        return;
      }

      // 2. Carousel Arrow Next
      const nextBtn = e.target.closest('[data-carousel-action="next"]');
      if (nextBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = nextBtn.dataset.productId;
        const carousel = nextBtn.closest('.image-carousel');
        this.navigateCarousel(carousel, productId, 1);
        return;
      }

      // 3. Carousel Dot
      const dotBtn = e.target.closest('[data-carousel-action="dot"]');
      if (dotBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = dotBtn.dataset.productId;
        const targetIndex = Number.parseInt(dotBtn.dataset.index, 10);
        const carousel = dotBtn.closest('.image-carousel');
        this.setCarouselIndex(carousel, productId, targetIndex);
        return;
      }

      // 4. Full Specs button click
      const specsBtn = e.target.closest('.btn-fullspecs');
      if (specsBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = specsBtn.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.setSelectedProduct(product);
        }
        return;
      }

      // 5. Table Specs Cell or Product Cell click (opens full specs)
      const specsCell = e.target.closest('.td-specs, .td-product[data-action="specs"], [data-action="specs"]');
      if (specsCell && !e.target.closest('a, button')) {
        const row = specsCell.closest('.matrix-row, .mobile-card');
        const productId = row?.dataset.id || specsCell.dataset.productId || specsCell.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.setSelectedProduct(product);
        }
        return;
      }
    });

    // Modal close buttons
    document.getElementById('modalClose')?.addEventListener('click', () => this.hideModal('buyModal'));
    document.getElementById('modalOverlay')?.addEventListener('click', () => this.hideModal('buyModal'));
    document.getElementById('specsModalClose')?.addEventListener('click', () => this.setSelectedProduct(null));
    document.getElementById('specsModalOverlay')?.addEventListener('click', () => this.setSelectedProduct(null));

    // Click outside modal content
    document.getElementById('specsModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'specsModal' || e.target.id === 'specsModalOverlay') {
        this.setSelectedProduct(null);
      }
    });

    // Modal thumbnail clicks for image preview
    document.getElementById('specsModalBody')?.addEventListener('click', (e) => {
      const thumb = e.target.closest('.specs-thumb-btn');
      if (thumb) {
        const newSrc = thumb.dataset.imgSrc;
        const mainImg = document.getElementById('modalCarouselImg');
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
          document.querySelectorAll('.specs-thumb-btn').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal('buyModal');
        this.setSelectedProduct(null);
        this.toggleDrawer(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.container.querySelector('#searchInput')?.focus();
      }
    });

    // Responsive layout resize handler
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Navigate carousel forward or backward
   * @param {HTMLElement} carousel
   * @param {string} productId
   * @param {number} delta
   */
  navigateCarousel(carousel, productId, delta) {
    if (!carousel) return;
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const rawList = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.imageUrl ? [product.imageUrl] : []);
    if (rawList.length <= 1) return;

    let currentIndex = Number.parseInt(carousel.dataset.currentIndex || '0', 10);
    currentIndex = (currentIndex + delta + rawList.length) % rawList.length;
    this.setCarouselIndex(carousel, productId, currentIndex);
  }

  /**
   * Set carousel to specific index
   * @param {HTMLElement} carousel
   * @param {string} productId
   * @param {number} targetIndex
   */
  setCarouselIndex(carousel, productId, targetIndex) {
    if (!carousel) return;
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const rawList = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.imageUrl ? [product.imageUrl] : []);
    if (rawList.length <= 1) return;

    const safeIndex = Math.min(Math.max(0, targetIndex), rawList.length - 1);
    carousel.dataset.currentIndex = safeIndex.toString();

    const img = carousel.querySelector('.carousel-img');
    if (img) {
      const newSrc = rawList[safeIndex];
      img.src = getImageUrl(newSrc, 400) || newSrc;
    }

    const dots = carousel.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === safeIndex);
    });
  }

  /**
   * Select a category and update pills
   * @param {string} category
   */
  selectCategory(category) {
    this.selectedCategory = category;
    this.container.querySelectorAll('.category-pill').forEach(p => {
      const isSelected = p.dataset.category === this.selectedCategory;
      p.classList.toggle('active', isSelected);
      p.setAttribute('aria-selected', isSelected.toString());
    });

    this.container.querySelectorAll('.drawer-category-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.category === this.selectedCategory);
    });

    this.applyFilters();
  }

  /**
   * Update sort indicators
   */
  updateSortIndicators() {
    this.container.querySelectorAll('.th-sort-btn').forEach(btn => {
      const column = btn.dataset.column;
      const arrow = btn.querySelector('.sort-arrow');
      if (arrow) {
        arrow.classList.toggle('active', column === this.sortColumn);
        arrow.classList.toggle('desc', this.sortDirection === 'desc');
      }
    });

    const sortArrow = this.container.querySelector('#sortDirection svg');
    if (sortArrow) {
      sortArrow.classList.toggle('rotated', this.sortDirection === 'desc');
    }
  }

  /**
   * Apply filters and update views
   */
  applyFilters() {
    // Filter by category
    if (this.selectedCategory !== 'all') {
      this.filteredProducts = this.products.filter(p => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = [...this.products];
    }

    // Filter by search query
    if (this.searchQuery) {
      this.filteredProducts = this.filteredProducts.filter(product => {
        const searchable = [
          product.name,
          product.brand,
          product.category,
          product.specs ? JSON.stringify(product.specs) : '',
          product.affiliateNetwork,
          product.merchantId
        ].join(' ').toLowerCase();

        return searchable.includes(this.searchQuery);
      });
    }

    // Sort
    this.sortProducts();

    // Update views
    this.updateViews();
  }

  /**
   * Sort filtered products
   */
  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      let aValue, bValue;

      switch (this.sortColumn) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          return this.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case 'brand':
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          return this.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case 'priceUsd':
          aValue = a.priceUsd ?? 0;
          bValue = b.priceUsd ?? 0;
          return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;

        case 'roiScore':
          aValue = a.roiScore ?? 0;
          bValue = b.roiScore ?? 0;
          return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;

        default:
          return 0;
      }
    });
  }

  /**
   * Update desktop and mobile views
   */
  updateViews() {
    const desktopContent = this.container.querySelector('#matrixContent');
    const mobileView = this.container.querySelector('#mobileView');

    if (desktopContent) {
      desktopContent.innerHTML = this.getDesktopView();
    }

    if (mobileView) {
      mobileView.innerHTML = this.getMobileCards();
    }

    // Update table body specifically if needed
    const tableBody = this.container.querySelector('#tableBody');
    if (tableBody) {
      tableBody.innerHTML = this.getTableRows();
    }

    // Update results count
    const resultsCount = this.container.querySelector('.results-count');
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? 's' : ''}`;
    }

    this.updateSortIndicators();
    this.handleResize();
  }

  /**
   * Handle responsive layout
   */
  handleResize() {
    const mobileView = this.container.querySelector('#mobileView');
    const desktopContent = this.container.querySelector('#matrixContent');

    if (window.innerWidth < 768) {
      // Mobile view
      if (mobileView) mobileView.style.display = 'block';
      if (desktopContent) desktopContent.style.display = 'none';
    } else {
      // Desktop & Tablet view
      if (mobileView) mobileView.style.display = 'none';
      if (desktopContent) desktopContent.style.display = 'block';
      // Close mobile drawer on desktop resize
      this.toggleDrawer(false);
    }
  }

  /**
   * Show buy modal
   * @param {Object} product
   */
  showBuyModal(product) {
    const modal = document.getElementById('buyModal');
    const body = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');

    if (!modal || !body) return;

    const imageFallback = getProductImageFallback(product);
    const directUrl = product.directUrl;
    const affiliateUrl = buildProductLink(product);
    const networkName = getNetworkDisplayName(product.affiliateNetwork);
    const hasAffiliate = product.affiliateNetwork && product.affiliateNetwork !== 'none';

    title.textContent = `${product.name} - Purchase Options`;

    body.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img
            src="${getImageUrl(product.imageUrl, 200)}"
            alt="${this.escapeHtml(product.name)}"
            onerror="this.onerror=null;this.src='${imageFallback}';"
          >
        </div>
        <div class="modal-product-info">
          <span class="modal-product-brand">${this.escapeHtml(product.brand)}</span>
          <h3 class="modal-product-name">${this.escapeHtml(product.name)}</h3>
          <p class="modal-product-price">${formatCurrency(product.priceUsd)}</p>
        </div>
      </div>

      <div class="modal-links">
        <div class="modal-link-item">
          <div class="modal-link-label">
            <span class="link-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </span>
            <span>Direct OEM Link</span>
          </div>
          <a
            href="${directUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link-btn"
          >
            Open in New Tab
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        ${hasAffiliate ? `
        <div class="modal-link-item">
          <div class="modal-link-label">
            <span class="link-icon link-icon-affiliate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
            </span>
            <span>${this.escapeHtml(networkName)} Affiliate Link</span>
            <span class="affiliate-note">Supports our work</span>
          </div>
          <a
            href="${affiliateUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link-btn modal-link-btn-affiliate"
          >
            Visit via ${this.escapeHtml(networkName)}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
        ` : ''}
      </div>

      ${hasAffiliate ? `
      <div class="modal-footer">
        <p class="modal-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Clicking affiliate links may earn us a commission at no extra cost to you.
        </p>
      </div>
      ` : ''}
    `;

    modal.style.display = 'flex';
  }

  /**
   * Hide modal
   * @param {string} modalId
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Show full specs modal
   * @param {Object} product
   */
  showSpecsModal(product) {
    const modal = document.getElementById('specsModal');
    const body = document.getElementById('specsModalBody');
    const title = document.getElementById('specsModalTitle');

    if (!modal || !body) return;

    if (title) {
      title.textContent = `${product.name} - Full Specifications`;
    }

    body.innerHTML = renderSpecsModalContent(product);
    modal.style.display = 'flex';
  }
}
