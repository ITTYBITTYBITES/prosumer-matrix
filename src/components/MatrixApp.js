// ============================================================================
// MATRIX APP COMPONENT
// ============================================================================
// Main application component for the Hardware & Equipment Spec Matrix
// Handles rendering, filtering, sorting, and responsive views
// ============================================================================

import { getImageUrl, IMAGE_FALLBACK_URL } from '../utils/imageProxy.js';
import { buildProductLink, getNetworkDisplayName } from '../utils/linkBuilder.js';

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

    this.render();
    this.attachEventListeners();
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
            <svg class="matrix-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#0EA5E9"/>
              <path d="M8 10h16M8 16h12M8 22h8" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="24" cy="22" r="3" fill="#10B981"/>
            </svg>
            <div class="matrix-brand-text">
              <h1 class="matrix-title">PROsumer MATRIX</h1>
              <p class="matrix-subtitle">Hardware & Equipment Specification Database</p>
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
              <span class="stat-value">$${this.getPriceRange()}</span>
              <span class="stat-label">Price Range</span>
            </div>
          </div>
        </header>

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
            <button class="search-clear" id="searchClear" aria-label="Clear search" style="display: none;">
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
            <button class="sort-direction" id="sortDirection" aria-label="Toggle sort direction" title="${this.sortDirection === 'asc' ? 'Ascending' : 'Descending'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${this.sortDirection === 'desc' ? 'rotated' : ''}">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info">
          <span class="results-count">${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? 's' : ''}</span>
          ${this.searchQuery ? `<span class="search-query">matching "${this.searchQuery}"</span>` : ''}
        </div>

        <!-- Main Content -->
        <div class="matrix-content" id="matrixContent">
          ${this.getDesktopView()}
        </div>

        <!-- Mobile Card View -->
        <div class="matrix-mobile-view" id="mobileView" style="display: none;">
          ${this.getMobileCards()}
        </div>
      </div>

      <!-- Buy Modal -->
      <div class="matrix-modal" id="buyModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modalTitle">Purchase Options</h2>
            <button class="modal-close" id="modalClose" aria-label="Close modal">
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

      <!-- Full Specs Modal for Mobile -->
      <div class="matrix-modal" id="specsModal" role="dialog" aria-modal="true" aria-labelledby="specsModalTitle">
        <div class="modal-overlay" id="specsModalOverlay"></div>
        <div class="modal-content modal-specs">
          <div class="modal-header">
            <h2 id="specsModalTitle">Full Specifications</h2>
            <button class="modal-close" id="specsModalClose" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="specsModalBody">
            <!-- Dynamic content -->
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
                  <button class="th-sort-btn" data-column="name" aria-label="Sort by name">
                    Product
                    <svg class="sort-arrow ${this.sortColumn === 'name' ? 'active' : ''} ${this.sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-brand" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="brand" aria-label="Sort by brand">
                    Brand
                    <svg class="sort-arrow ${this.sortColumn === 'brand' ? 'active' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-specs" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="specs" aria-label="Sort by specs" disabled>
                    Key Specifications
                  </button>
                </div>
              </th>
              <th class="th-price" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="priceUsd" aria-label="Sort by price">
                    Price (USD)
                    <svg class="sort-arrow ${this.sortColumn === 'priceUsd' ? 'active' : ''} ${this.sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-roi" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="roiScore" aria-label="Sort by ROI">
                    ROI Score
                    <svg class="sort-arrow ${this.sortColumn === 'roiScore' ? 'active' : ''} ${this.sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-network" scope="col">
                <div class="th-content">
                  <span class="th-label">Network</span>
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
          <td colspan="7" class="empty-state">
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
      const imageUrl = getImageUrl(product.imageUrl, 80);

      return `
        <tr class="matrix-row" data-id="${product.id}" data-category="${product.category}">
          <td class="td-product">
            <div class="product-cell">
              <div class="product-thumbnail">
                <img
                  src="${imageUrl}"
                  alt="${product.name}"
                  loading="lazy"
                  onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';"
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
          <td class="td-specs">
            <div class="specs-preview">
              ${this.getSpecsPreview(product.specs)}
            </div>
          </td>
          <td class="td-price">
            <span class="price-value">$${product.priceUsd.toLocaleString()}</span>
          </td>
          <td class="td-roi">
            <div class="roi-cell">
              <div class="roi-bar">
                <div class="roi-fill" style="width: ${product.roiScore}%; background: ${this.getRoiColor(product.roiScore)};"></div>
              </div>
              <span class="roi-value">${product.roiScore}</span>
            </div>
          </td>
          <td class="td-network">
            <span class="network-badge ${product.affiliateNetwork}">
              ${getNetworkDisplayName(product.affiliateNetwork)}
            </span>
          </td>
          <td class="td-action">
            <div class="action-cell">
              <button
                class="btn-buy"
                data-id="${product.id}"
                aria-label="View purchase options for ${this.escapeHtml(product.name)}"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                Buy
              </button>
              <div class="buy-dropdown" id="dropdown-${product.id}">
                <button class="btn-buy-primary" data-id="${product.id}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  View Options
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Get mobile cards HTML
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
      const imageUrl = getImageUrl(product.imageUrl, 400);

      return `
        <div class="mobile-card" data-id="${product.id}">
          <div class="mobile-card-image">
            <img
              src="${imageUrl}"
              alt="${product.name}"
              loading="lazy"
              onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';"
              class="mobile-image"
            >
            <span class="mobile-category-badge">${product.category}</span>
          </div>
          <div class="mobile-card-body">
            <h3 class="mobile-card-title">${this.escapeHtml(product.name)}</h3>
            <p class="mobile-card-brand">${this.escapeHtml(product.brand)}</p>

            <div class="mobile-card-specs">
              ${this.getMobileSpecs(product.specs)}
            </div>

            <div class="mobile-card-footer">
              <div class="mobile-price">
                <span class="price-value">$${product.priceUsd.toLocaleString()}</span>
              </div>
              <div class="mobile-roi">
                <span class="roi-label">ROI</span>
                <span class="roi-value">${product.roiScore}/100</span>
              </div>
            </div>

            <button
              class="btn-fullspecs"
              data-id="${product.id}"
              aria-label="View full specifications for ${this.escapeHtml(product.name)}"
            >
              Full Specs
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Get specs preview for table view
   */
  getSpecsPreview(specs) {
    if (!specs || Object.keys(specs).length === 0) return '<span class="specs-none">No specs</span>';

    const entries = Object.entries(specs).slice(0, 3);
    return entries.map(([key, value]) => `
      <div class="spec-item">
        <span class="spec-key">${this.formatSpecKey(key)}:</span>
        <span class="spec-value">${this.formatSpecValue(value)}</span>
      </div>
    `).join('');
  }

  /**
   * Get specs for mobile view
   */
  getMobileSpecs(specs) {
    if (!specs || Object.keys(specs).length === 0) return '<span class="specs-none">No specifications available</span>';

    return Object.entries(specs).map(([key, value]) => `
      <div class="mobile-spec">
        <span class="mobile-spec-key">${this.formatSpecKey(key)}</span>
        <span class="mobile-spec-value">${this.formatSpecValue(value)}</span>
      </div>
    `).join('');
  }

  /**
   * Format spec key for display
   */
  formatSpecKey(key) {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Format spec value for display
   */
  formatSpecValue(value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (typeof value === 'string') return value;
    return String(value);
  }

  /**
   * Get ROI color based on score
   */
  getRoiColor(score) {
    if (score >= 80) return '#10B981'; // Emerald
    if (score >= 60) return '#0EA5E9'; // Sky Blue
    if (score >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
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
   * Get number of categories
   */
  getCategoryCount() {
    return new Set(this.products.map(p => p.category)).size;
  }

  /**
   * Get price range string
   */
  getPriceRange() {
    if (this.products.length === 0) return '$0';
    const prices = this.products.map(p => p.priceUsd);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }

  /**
   * Escape HTML entities
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return String(text);
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#searchInput');
    const searchClear = this.container.querySelector('#searchClear');

    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      searchClear.style.display = this.searchQuery ? 'flex' : 'none';
      this.applyFilters();
    });

    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      this.searchQuery = '';
      searchClear.style.display = 'none';
      this.applyFilters();
    });

    // Category pills
    this.container.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.selectedCategory = pill.dataset.category;
        this.container.querySelectorAll('.category-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.category === this.selectedCategory);
          p.setAttribute('aria-selected', p.dataset.category === this.selectedCategory);
        });
        this.applyFilters();
      });
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
      btn.addEventListener('click', (e) => {
        const column = btn.dataset.column;
        if (column === 'specs') return; // Disabled

        const isCurrent = column === this.sortColumn;
        this.sortColumn = column;
        this.sortDirection = isCurrent && this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.applyFilters();
        this.updateSortIndicators();
      });
    });

    // Buy buttons - handle both affiliate and non-affiliate products
    this.container.querySelectorAll('.btn-buy, .btn-buy-primary').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          // Option B: For non-affiliate products, open direct link immediately
          if (product.affiliateNetwork === 'none') {
            window.open(product.directUrl, '_blank', 'noopener,noreferrer');
          } else {
            // Option A: For affiliate products, open the purchase modal
            this.showBuyModal(product);
          }
        }
      });
    });

    // Full specs buttons (mobile)
    this.container.querySelectorAll('.btn-fullspecs').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = btn.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.showSpecsModal(product);
        }
      });
    });

    // Modal close buttons
    document.getElementById('modalClose')?.addEventListener('click', () => this.hideModal('buyModal'));
    document.getElementById('modalOverlay')?.addEventListener('click', () => this.hideModal('buyModal'));
    document.getElementById('specsModalClose')?.addEventListener('click', () => this.hideModal('specsModal'));
    document.getElementById('specsModalOverlay')?.addEventListener('click', () => this.hideModal('specsModal'));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal('buyModal');
        this.hideModal('specsModal');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.container.querySelector('#searchInput')?.focus();
      }
    });

    // Update views on resize
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
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
          aValue = a.priceUsd;
          bValue = b.priceUsd;
          return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;

        case 'roiScore':
          aValue = a.roiScore;
          bValue = b.roiScore;
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

    // Update table body specifically
    const tableBody = this.container.querySelector('#tableBody');
    if (tableBody) {
      tableBody.innerHTML = this.getTableRows();
    }

    this.updateSortIndicators();
    this.attachBuyDropdownHandlers();
  }

  /**
   * Attach buy dropdown handlers
   */
  attachBuyDropdownHandlers() {
    // Single buy button opens modal directly
    this.container.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.showBuyModal(product);
        }
      });
    });

    // Primary buy button also opens modal
    this.container.querySelectorAll('.btn-buy-primary, .btn-buy-primary-clone').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.showBuyModal(product);
        }
      });
    });
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
    } else if (window.innerWidth < 1024) {
      // Tablet view - show both, desktop is scrollable
      if (mobileView) mobileView.style.display = 'none';
      if (desktopContent) desktopContent.style.display = 'block';
    } else {
      // Desktop view
      if (mobileView) mobileView.style.display = 'none';
      if (desktopContent) desktopContent.style.display = 'block';
    }
  }

  /**
   * Show buy modal
   * For non-affiliate products, show a simplified modal with just the direct link.
   * For affiliate products, show both direct and affiliate options.
   */
  showBuyModal(product) {
    const modal = document.getElementById('buyModal');
    const body = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');

    if (!modal || !body) return;

    // For non-affiliate products, use a simpler modal with just the direct link
    if (product.affiliateNetwork === 'none') {
      title.textContent = `${product.name} - Direct Link`;
      body.innerHTML = `
        <div class="modal-product">
          <div class="modal-product-image">
            <img
              src="${getImageUrl(product.imageUrl, 200)}"
              alt="${product.name}"
              onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';"
            >
          </div>
          <div class="modal-product-info">
            <span class="modal-product-brand">${this.escapeHtml(product.brand)}</span>
            <h3 class="modal-product-name">${this.escapeHtml(product.name)}</h3>
            <p class="modal-product-price">$${product.priceUsd.toLocaleString()}</p>
          </div>
        </div>

        <div class="modal-link-item modal-link-item-primary">
          <div class="modal-link-label">
            <span>Official Product Page</span>
          </div>
          <a
            href="${product.directUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link-btn modal-link-btn-primary"
          >
            Visit Manufacturer Site
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      `;
      modal.style.display = 'flex';
      return;
    }

    // For affiliate products, show full modal with both options
    title.textContent = `${product.name} - Purchase Options`;

    const directUrl = product.directUrl;
    const affiliateUrl = buildProductLink(product);
    const networkName = getNetworkDisplayName(product.affiliateNetwork);
    const hasAffiliate = product.affiliateNetwork !== 'none';

    body.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img
            src="${getImageUrl(product.imageUrl, 200)}"
            alt="${product.name}"
            onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';"
          >
        </div>
        <div class="modal-product-info">
          <span class="modal-product-brand">${this.escapeHtml(product.brand)}</span>
          <h3 class="modal-product-name">${this.escapeHtml(product.name)}</h3>
          <p class="modal-product-price">$${product.priceUsd.toLocaleString()}</p>
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
            <span>${networkName} Affiliate Link</span>
            <span class="affiliate-note">Supports our work</span>
          </div>
          <a
            href="${affiliateUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link-btn modal-link-btn-affiliate"
          >
            Visit via ${networkName}
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
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Show specs modal (mobile)
   */
  showSpecsModal(product) {
    const modal = document.getElementById('specsModal');
    const body = document.getElementById('specsModalBody');
    const title = document.getElementById('specsModalTitle');

    if (!modal || !body) return;

    title.textContent = `${product.name} - Full Specifications`;

    const specsHtml = product.specs && Object.keys(product.specs).length > 0
      ? Object.entries(product.specs).map(([key, value]) => `
        <div class="specs-row">
          <span class="specs-key">${this.formatSpecKey(key)}</span>
          <span class="specs-value">${this.formatSpecValue(value)}</span>
        </div>
      `).join('')
      : '<p class="no-specs">No specifications available</p>';

    body.innerHTML = `
      <div class="specs-header">
        <img
          src="${getImageUrl(product.imageUrl, 120)}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';"
          class="specs-image"
        >
        <div class="specs-meta">
          <span class="specs-brand">${this.escapeHtml(product.brand)}</span>
          <span class="specs-category">${this.escapeHtml(product.category)}</span>
        </div>
      </div>

      <div class="specs-content">
        <div class="specs-list">
          ${specsHtml}
        </div>

        <div class="specs-footer">
          <div class="specs-price">
            <span class="price-label">Price</span>
            <span class="price-value">$${product.priceUsd.toLocaleString()}</span>
          </div>
          <div class="specs-roi">
            <span class="roi-label">ROI Score</span>
            <span class="roi-value">${product.roiScore}/100</span>
          </div>
          <div class="specs-network">
            <span class="network-label">Network</span>
            <span class="network-value">${getNetworkDisplayName(product.affiliateNetwork)}</span>
          </div>

          <a
            href="${product.directUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-specs-buy"
          >
            Buy Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }
}
