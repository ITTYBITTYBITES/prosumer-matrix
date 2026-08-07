function getProductImageFallback(product = {}) {
  const brand = truncateLabel(product.brand || "Prosumer Matrix", 26);
  const model = truncateLabel(product.name || "Image unavailable", 34);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${escapeXml(brand)} ${escapeXml(model)}">
      <rect width="640" height="400" fill="#1e293b"/>
      <rect x="20" y="20" width="600" height="360" rx="20" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <path d="M270 112h100M270 160h76M270 208h124" stroke="#0ea5e9" stroke-width="12" stroke-linecap="round"/>
      <circle cx="382" cy="208" r="13" fill="#10b981"/>
      <text x="320" y="278" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(brand)}</text>
      <text x="320" y="320" text-anchor="middle" fill="#f1f5f9" font-family="Arial, sans-serif" font-size="22">${escapeXml(model)}</text>
      <text x="320" y="350" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="16">Product image unavailable</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function truncateLabel(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function getImageUrl(rawUrl, width = 400) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "";
  }
  try {
    new URL(rawUrl);
  } catch {
    return "";
  }
  const encodedUrl = encodeURIComponent(rawUrl);
  const height = Math.round(width * 1);
  const baseUrl = "https://images.weserv.nl/";
  return `${baseUrl}?url=${encodedUrl}&w=${width}&h=${height}&output=webp&q=85`;
}
const AFFILIATE_CONFIG = {
  // Impact.com Publisher ID
  // Format: numeric string
  // Example: "12345678"
  IMPACT_PUBLISHER_ID: "7575765",
  // Awin Publisher ID
  // Format: numeric string
  // Example: "1234567"
  AWIN_PUBLISHER_ID: "3025417",
  // ShareASale User ID
  // Format: numeric string
  // Example: "123456"
  SHAREASALE_USER_ID: "PLACEHOLDER_SHAREASALE_ID",
  // Amazon Associates Tag
  // Format: association-tag (usually lowercase, no spaces)
  // Example: "my-tag-20"
  AMAZON_TAG: "prosumatrix-20"
};
function areAllIdsPlaceholder() {
  const { IMPACT_PUBLISHER_ID, AWIN_PUBLISHER_ID, SHAREASALE_USER_ID, AMAZON_TAG } = AFFILIATE_CONFIG;
  const allPlaceholder = IMPACT_PUBLISHER_ID.startsWith("PLACEHOLDER") && AWIN_PUBLISHER_ID.startsWith("PLACEHOLDER") && SHAREASALE_USER_ID.startsWith("PLACEHOLDER") && AMAZON_TAG.startsWith("PLACEHOLDER");
  return allPlaceholder;
}
function cleanDestinationUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    return "";
  }
  try {
    const destination = new URL(url.trim());
    if (!["http:", "https:"].includes(destination.protocol)) {
      return "";
    }
    destination.search = "";
    destination.hash = "";
    destination.pathname = destination.pathname.replace(/\/+$/, "") || "/";
    return destination.toString();
  } catch {
    return "";
  }
}
function buildProductLink(product) {
  const destination = cleanDestinationUrl(product == null ? void 0 : product.directUrl);
  if (!destination) {
    return "#";
  }
  if (areAllIdsPlaceholder()) {
    return destination;
  }
  switch (((product == null ? void 0 : product.affiliateNetwork) || "").toLowerCase()) {
    case "impact":
      return buildImpactLink(product, destination);
    case "awin":
      return buildAwinLink(product, destination);
    case "amazon":
      return buildAmazonLink(product);
    default:
      return destination;
  }
}
function buildImpactLink(product, destination) {
  const merchantId = encodeURIComponent(product.merchantId || "");
  const affiliateId = encodeURIComponent(AFFILIATE_CONFIG.IMPACT_PUBLISHER_ID);
  return `https://impact.com/c/${merchantId}?affid=${affiliateId}&u=${encodeURIComponent(destination)}`;
}
function buildAwinLink(product, destination) {
  const merchantId = encodeURIComponent(product.merchantId || "");
  const affiliateId = encodeURIComponent(AFFILIATE_CONFIG.AWIN_PUBLISHER_ID);
  return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${affiliateId}&ued=${encodeURIComponent(destination)}`;
}
function buildAmazonLink(product) {
  const asin = String((product == null ? void 0 : product.merchantId) || "").trim();
  const tag = encodeURIComponent(AFFILIATE_CONFIG.AMAZON_TAG);
  return `https://www.amazon.com/dp/${encodeURIComponent(asin)}/?tag=${tag}`;
}
function getNetworkDisplayName(network) {
  const names = {
    impact: "Impact",
    awin: "Awin",
    amazon: "Amazon",
    none: "Direct"
  };
  return names[network == null ? void 0 : network.toLowerCase()] || "Direct";
}
class MatrixApp {
  constructor(container, products) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    this.products = products || [];
    this.filteredProducts = [...this.products];
    this.selectedCategory = "all";
    this.searchQuery = "";
    this.sortColumn = "name";
    this.sortDirection = "asc";
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
              <option value="name" ${this.sortColumn === "name" ? "selected" : ""}>Name</option>
              <option value="priceUsd" ${this.sortColumn === "priceUsd" ? "selected" : ""}>Price</option>
              <option value="roiScore" ${this.sortColumn === "roiScore" ? "selected" : ""}>ROI Score</option>
            </select>
            <button class="sort-direction" id="sortDirection" aria-label="Toggle sort direction" title="${this.sortDirection === "asc" ? "Ascending" : "Descending"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${this.sortDirection === "desc" ? "rotated" : ""}">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info">
          <span class="results-count">${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? "s" : ""}</span>
          ${this.searchQuery ? `<span class="search-query">matching "${this.searchQuery}"</span>` : ""}
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
    const categoryContainer = this.container.querySelector("#categoryPills");
    if (categoryContainer) {
      categoryContainer.innerHTML = this.getCategoryPills();
    }
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
                    <svg class="sort-arrow ${this.sortColumn === "name" ? "active" : ""} ${this.sortDirection === "desc" ? "desc" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-brand" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="brand" aria-label="Sort by brand">
                    Brand
                    <svg class="sort-arrow ${this.sortColumn === "brand" ? "active" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              <th class="th-price-roi" scope="col">
                <div class="th-content">
                  <span class="th-label">Price / ROI</span>
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
    return this.filteredProducts.map((product) => {
      const imageUrl = getImageUrl(product.imageUrl, 80);
      const imageFallback = getProductImageFallback(product);
      const productLink = buildProductLink(product);
      return `
        <tr class="matrix-row" data-id="${product.id}" data-category="${product.category}">
          <td class="td-product">
            <div class="product-cell">
              <div class="product-thumbnail">
                <img
                  src="${imageUrl}"
                  alt="${product.name}"
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
          <td class="td-specs">
            <div class="specs-preview">
              ${this.getSpecsPreview(product.specs)}
            </div>
          </td>
          <td class="td-price-roi">
            <span class="price-value">$${product.priceUsd.toLocaleString()}</span>
            <span class="roi-inline">ROI ${product.roiScore}</span>
          </td>
          <td class="td-action">
            <div class="action-cell">
              <a
                href="${productLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-buy"
                aria-label="View ${this.escapeHtml(product.name)} in a new tab"
              >
                View Item →
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join("");
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
    return this.filteredProducts.map((product) => {
      const imageUrl = getImageUrl(product.imageUrl, 400);
      const imageFallback = getProductImageFallback(product);
      const productLink = buildProductLink(product);
      return `
        <div class="mobile-card" data-id="${product.id}">
          <div class="mobile-card-image">
            <img
              src="${imageUrl}"
              alt="${product.name}"
              loading="lazy"
              onerror="this.onerror=null;this.src='${imageFallback}';"
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
            <a
              href="${productLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-buy mobile-card-cta"
              aria-label="View ${this.escapeHtml(product.name)} in a new tab"
            >
              View Item →
            </a>
          </div>
        </div>
      `;
    }).join("");
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
    `).join("");
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
    `).join("");
  }
  /**
   * Format spec key for display
   */
  formatSpecKey(key) {
    return key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  }
  /**
   * Format spec value for display
   */
  formatSpecValue(value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    if (typeof value === "string") return value;
    return String(value);
  }
  /**
   * Get ROI color based on score
   */
  getRoiColor(score) {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#0EA5E9";
    if (score >= 40) return "#F59E0B";
    return "#EF4444";
  }
  /**
   * Get category pills HTML
   */
  getCategoryPills() {
    const categories = ["all", ...new Set(this.products.map((p) => p.category))];
    return categories.map((cat) => {
      const label = cat === "all" ? "All" : cat;
      return `
        <button
          class="category-pill ${this.selectedCategory === cat ? "active" : ""}"
          data-category="${this.escapeHtml(cat)}"
          role="tab"
          aria-selected="${this.selectedCategory === cat}"
        >
          ${this.escapeHtml(label)}
        </button>
      `;
    }).join("");
  }
  /**
   * Get number of categories
   */
  getCategoryCount() {
    return new Set(this.products.map((p) => p.category)).size;
  }
  /**
   * Get price range string
   */
  getPriceRange() {
    if (this.products.length === 0) return "$0";
    const prices = this.products.map((p) => p.priceUsd);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  /**
   * Escape HTML entities
   */
  escapeHtml(text) {
    if (typeof text !== "string") return String(text);
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    var _a, _b, _c, _d;
    const searchInput = this.container.querySelector("#searchInput");
    const searchClear = this.container.querySelector("#searchClear");
    searchInput == null ? void 0 : searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      searchClear.style.display = this.searchQuery ? "flex" : "none";
      this.applyFilters();
    });
    searchClear == null ? void 0 : searchClear.addEventListener("click", () => {
      searchInput.value = "";
      this.searchQuery = "";
      searchClear.style.display = "none";
      this.applyFilters();
    });
    this.container.querySelectorAll(".category-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        this.selectedCategory = pill.dataset.category;
        this.container.querySelectorAll(".category-pill").forEach((p) => {
          p.classList.toggle("active", p.dataset.category === this.selectedCategory);
          p.setAttribute("aria-selected", p.dataset.category === this.selectedCategory);
        });
        this.applyFilters();
      });
    });
    const sortSelect = this.container.querySelector("#sortSelect");
    sortSelect == null ? void 0 : sortSelect.addEventListener("change", (e) => {
      this.sortColumn = e.target.value;
      this.sortDirection = "asc";
      this.applyFilters();
      this.updateSortIndicators();
    });
    const sortDirectionBtn = this.container.querySelector("#sortDirection");
    sortDirectionBtn == null ? void 0 : sortDirectionBtn.addEventListener("click", () => {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      this.applyFilters();
      this.updateSortIndicators();
    });
    this.container.querySelectorAll(".th-sort-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const column = btn.dataset.column;
        if (column === "specs") return;
        const isCurrent = column === this.sortColumn;
        this.sortColumn = column;
        this.sortDirection = isCurrent && this.sortDirection === "asc" ? "desc" : "asc";
        this.applyFilters();
        this.updateSortIndicators();
      });
    });
    this.container.querySelectorAll(".btn-fullspecs").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = btn.dataset.id;
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          this.showSpecsModal(product);
        }
      });
    });
    (_a = document.getElementById("modalClose")) == null ? void 0 : _a.addEventListener("click", () => this.hideModal("buyModal"));
    (_b = document.getElementById("modalOverlay")) == null ? void 0 : _b.addEventListener("click", () => this.hideModal("buyModal"));
    (_c = document.getElementById("specsModalClose")) == null ? void 0 : _c.addEventListener("click", () => this.hideModal("specsModal"));
    (_d = document.getElementById("specsModalOverlay")) == null ? void 0 : _d.addEventListener("click", () => this.hideModal("specsModal"));
    document.addEventListener("keydown", (e) => {
      var _a2;
      if (e.key === "Escape") {
        this.hideModal("buyModal");
        this.hideModal("specsModal");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        (_a2 = this.container.querySelector("#searchInput")) == null ? void 0 : _a2.focus();
      }
    });
    this.handleResize();
    window.addEventListener("resize", () => this.handleResize());
  }
  /**
   * Update sort indicators
   */
  updateSortIndicators() {
    this.container.querySelectorAll(".th-sort-btn").forEach((btn) => {
      const column = btn.dataset.column;
      const arrow = btn.querySelector(".sort-arrow");
      if (arrow) {
        arrow.classList.toggle("active", column === this.sortColumn);
        arrow.classList.toggle("desc", this.sortDirection === "desc");
      }
    });
    const sortArrow = this.container.querySelector("#sortDirection svg");
    if (sortArrow) {
      sortArrow.classList.toggle("rotated", this.sortDirection === "desc");
    }
  }
  /**
   * Apply filters and update views
   */
  applyFilters() {
    if (this.selectedCategory !== "all") {
      this.filteredProducts = this.products.filter((p) => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = [...this.products];
    }
    if (this.searchQuery) {
      this.filteredProducts = this.filteredProducts.filter((product) => {
        const searchable = [
          product.name,
          product.brand,
          product.category,
          product.specs ? JSON.stringify(product.specs) : "",
          product.affiliateNetwork,
          product.merchantId
        ].join(" ").toLowerCase();
        return searchable.includes(this.searchQuery);
      });
    }
    this.sortProducts();
    this.updateViews();
  }
  /**
   * Sort filtered products
   */
  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      let aValue, bValue;
      switch (this.sortColumn) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          return this.sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        case "brand":
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          return this.sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        case "priceUsd":
          aValue = a.priceUsd;
          bValue = b.priceUsd;
          return this.sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        case "roiScore":
          aValue = a.roiScore;
          bValue = b.roiScore;
          return this.sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        default:
          return 0;
      }
    });
  }
  /**
   * Update desktop and mobile views
   */
  updateViews() {
    const desktopContent = this.container.querySelector("#matrixContent");
    const mobileView = this.container.querySelector("#mobileView");
    if (desktopContent) {
      desktopContent.innerHTML = this.getDesktopView();
    }
    if (mobileView) {
      mobileView.innerHTML = this.getMobileCards();
    }
    const tableBody = this.container.querySelector("#tableBody");
    if (tableBody) {
      tableBody.innerHTML = this.getTableRows();
    }
    this.updateSortIndicators();
    this.attachBuyDropdownHandlers();
  }
  /**
   * CTA anchors require no runtime event binding. Kept as a named hook because
   * updateViews() calls it after replacing the table and mobile-card markup.
   */
  attachBuyDropdownHandlers() {
  }
  /**
   * Handle responsive layout
   */
  handleResize() {
    const mobileView = this.container.querySelector("#mobileView");
    const desktopContent = this.container.querySelector("#matrixContent");
    if (window.innerWidth < 768) {
      if (mobileView) mobileView.style.display = "block";
      if (desktopContent) desktopContent.style.display = "none";
    } else if (window.innerWidth < 1024) {
      if (mobileView) mobileView.style.display = "none";
      if (desktopContent) desktopContent.style.display = "block";
    } else {
      if (mobileView) mobileView.style.display = "none";
      if (desktopContent) desktopContent.style.display = "block";
    }
  }
  /**
   * Show buy modal
   * For non-affiliate products, show a simplified modal with just the direct link.
   * For affiliate products, show both direct and affiliate options.
   */
  showBuyModal(product) {
    const modal = document.getElementById("buyModal");
    const body = document.getElementById("modalBody");
    const title = document.getElementById("modalTitle");
    if (!modal || !body) return;
    const imageFallback = getProductImageFallback(product);
    if (product.affiliateNetwork === "none") {
      title.textContent = `${product.name} - Direct Link`;
      body.innerHTML = `
        <div class="modal-product">
          <div class="modal-product-image">
            <img
              src="${getImageUrl(product.imageUrl, 200)}"
              alt="${product.name}"
              onerror="this.onerror=null;this.src='${imageFallback}';"
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
      modal.style.display = "flex";
      return;
    }
    title.textContent = `${product.name} - Purchase Options`;
    const directUrl = product.directUrl;
    const affiliateUrl = buildProductLink(product);
    const networkName = getNetworkDisplayName(product.affiliateNetwork);
    const hasAffiliate = product.affiliateNetwork !== "none";
    body.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img
            src="${getImageUrl(product.imageUrl, 200)}"
            alt="${product.name}"
            onerror="this.onerror=null;this.src='${imageFallback}';"
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
        ` : ""}
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
      ` : ""}
    `;
    modal.style.display = "flex";
  }
  /**
   * Hide modal
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    }
  }
  /**
   * Show specs modal (mobile)
   */
  showSpecsModal(product) {
    const modal = document.getElementById("specsModal");
    const body = document.getElementById("specsModalBody");
    const title = document.getElementById("specsModalTitle");
    if (!modal || !body) return;
    const imageFallback = getProductImageFallback(product);
    const productLink = buildProductLink(product);
    title.textContent = `${product.name} - Full Specifications`;
    const specsHtml = product.specs && Object.keys(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => `
        <div class="specs-row">
          <span class="specs-key">${this.formatSpecKey(key)}</span>
          <span class="specs-value">${this.formatSpecValue(value)}</span>
        </div>
      `).join("") : '<p class="no-specs">No specifications available</p>';
    body.innerHTML = `
      <div class="specs-header">
        <img
          src="${getImageUrl(product.imageUrl, 120)}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='${imageFallback}';"
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
            href="${productLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-specs-buy"
          >
            View Item →
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    `;
    modal.style.display = "flex";
  }
}
const hardwareData = [
  {
    id: "creality-k1c",
    name: "Creality K1C 3D Printer",
    brand: "Creality",
    category: "3D Printers",
    priceUsd: 369,
    directUrl: "https://www.amazon.com/dp/B0DNPZW6BY",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0DNPZW6BY.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0DNPZW6BY",
    roiScore: 76,
    specs: {
      build_volume: "220 × 220 × 250 mm",
      max_print_speed: "600 mm/s",
      nozzle_temperature: "300 °C"
    }
  },
  {
    id: "bambu-lab-a1-mini",
    name: "Bambu Lab A1 mini 3D Printer + LED Lamp Kit",
    brand: "Bambu Lab",
    category: "3D Printers",
    priceUsd: 219,
    directUrl: "https://www.amazon.com/dp/B0GQMJ8QQT",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0GQMJ8QQT.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0GQMJ8QQT",
    roiScore: 82,
    specs: {
      build_volume: "180 × 180 × 180 mm",
      max_print_speed: "500 mm/s",
      calibration: "Fully automatic"
    }
  },
  {
    id: "bambu-lab-p1s",
    name: "Bambu Lab P1S 3D Printer",
    brand: "Bambu Lab",
    category: "3D Printers",
    priceUsd: 579,
    directUrl: "https://us.store.bambulab.com/products/p1s",
    imageUrl: "https://store.bblcdn.com/s7/default/465c4c8bf2a746069eee46eda06f5a62/P1SC2-compressed.jpg",
    affiliateNetwork: "awin",
    merchantId: "46345",
    roiScore: 88,
    specs: {
      build_volume: "256 × 256 × 256 mm",
      enclosure: "Fully enclosed",
      setup_time: "15 minutes"
    }
  },
  {
    id: "xtool-s1-20w",
    name: "xTool S1 20W Laser Cutter and Laser Engraver",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 1599,
    directUrl: "https://www.amazon.com/dp/B0CPM1MSS4",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0CPM1MSS4.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CPM1MSS4",
    roiScore: 81,
    specs: {
      laser_output: "20W diode",
      working_area: "23.93 × 15.16 in",
      max_speed: "600 mm/s"
    }
  },
  {
    id: "xtool-p2s-55w",
    name: "xTool P2S 55W Desktop CO2 Laser Cutter",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 3399,
    directUrl: "https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter",
    imageUrl: "https://www.xtool.com/cdn/shop/files/mk-p2-p2s-v30_us_pc_p2s_2Bf1-black-productiveduo-black_10723-4360_ff86d9ca-713f-4a65-9a64-a7695ee0f6a9.webp?v=1767868459",
    affiliateNetwork: "impact",
    merchantId: "175642",
    roiScore: 90,
    specs: {
      laser_output: "55W CO2",
      working_area: "23.6 × 12 in",
      cameras: "16MP dual HD"
    }
  },
  {
    id: "glowforge-spark",
    name: "Glowforge Spark Craft Laser Printer",
    brand: "Glowforge",
    category: "CNC & Laser Cutters",
    priceUsd: 599,
    directUrl: "https://www.amazon.com/dp/B0D6P48TV5",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0D6P48TV5.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D6P48TV5",
    roiScore: 72,
    specs: {
      laser_type: "Diode craft laser",
      camera: "Onboard preview camera",
      materials: "Wood, leather, paper, acrylic and more"
    }
  },
  {
    id: "ecoflow-delta-2",
    name: "EF ECOFLOW DELTA 2 Portable Power Station",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 499,
    directUrl: "https://www.amazon.com/dp/B0B9XB57XM",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0B9XB57XM.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B9XB57XM",
    roiScore: 86,
    specs: {
      capacity: "1024 Wh",
      ac_output: "1800 W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "jackery-explorer-1000-v2",
    name: "Jackery Explorer 1000 v2 Portable Power Station",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 799,
    directUrl: "https://www.amazon.com/dp/B0D7PPG25F",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0D7PPG25F.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D7PPG25F",
    roiScore: 84,
    specs: {
      capacity: "1070 Wh",
      ac_output: "1500 W",
      charge_time: "1 hour fast charge"
    }
  },
  {
    id: "ecoflow-delta-pro-ultra",
    name: "EcoFlow DELTA Pro Ultra Whole-Home Backup Power",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 5799,
    directUrl: "https://us.ecoflow.com/products/delta-pro-ultra",
    imageUrl: "https://us.ecoflow.com/cdn/shop/files/ecoflow-ecoflow-delta-pro-ultra-whole-home-backup-power-ul-9540-certificated-dpu-bundle-delta-pro-ultra-1-x-inverter-1-x-battery-1253485498.png?v=1786091054&width=1240",
    affiliateNetwork: "awin",
    merchantId: "59181",
    roiScore: 91,
    specs: {
      base_capacity: "6 kWh",
      ac_output: "7200 W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "flir-one-edge-pro",
    name: "FLIR ONE Edge Pro Wireless Thermal Imaging Camera",
    brand: "FLIR",
    category: "Thermal & Mapping Drones",
    priceUsd: 459,
    directUrl: "https://www.amazon.com/dp/B0BLJD6Q5G",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0BLJD6Q5G.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0BLJD6Q5G",
    roiScore: 79,
    specs: {
      native_thermal_resolution: "160 × 120",
      super_resolution: "480 × 360",
      connectivity: "Bluetooth"
    }
  },
  {
    id: "dji-mavic-3-enterprise",
    name: "DJI Mavic 3 Enterprise Series",
    brand: "DJI Enterprise",
    category: "Thermal & Mapping Drones",
    priceUsd: 3629,
    directUrl: "https://enterprise.dji.com/mavic-3-enterprise",
    imageUrl: "https://www-cdn.djiits.com/dps/1829a0d110ac80c641f7d22569e71796.svg",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 93,
    specs: {
      flight_time: "45 minutes",
      thermal_camera: "640 × 512 px on Mavic 3T",
      mapping: "Mechanical shutter and RTK support"
    }
  },
  {
    id: "dji-matrice-4t",
    name: "DJI Matrice 4T",
    brand: "DJI Enterprise",
    category: "Thermal & Mapping Drones",
    priceUsd: 6999,
    directUrl: "https://enterprise.dji.com/matrice-4-series",
    imageUrl: "https://www-cdn.djiits.com/dps/8d0d498b1e8af614016dd919e753b1f3.svg",
    affiliateNetwork: "impact",
    merchantId: "248631",
    roiScore: 94,
    specs: {
      platform: "Multi-sensor enterprise drone",
      thermal_use: "Public safety and inspection",
      positioning: "Laser range finder and smart measurement"
    }
  },
  {
    id: "gaggia-classic-evo-pro",
    name: "Gaggia Classic Evo Pro Espresso Machine",
    brand: "Gaggia",
    category: "Prosumer Espresso",
    priceUsd: 499,
    directUrl: "https://www.amazon.com/dp/B086H1W384",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B086H1W384.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B086H1W384",
    roiScore: 83,
    specs: {
      grouphead: "58 mm commercial style",
      extraction_pressure: "9 bar",
      steam_wand: "Commercial steam wand"
    }
  },
  {
    id: "breville-bambino-plus",
    name: "Breville Bambino Plus Espresso Machine",
    brand: "Breville",
    category: "Prosumer Espresso",
    priceUsd: 499.95,
    directUrl: "https://www.amazon.com/dp/B07JVD78TT",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B07JVD78TT.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B07JVD78TT",
    roiScore: 80,
    specs: {
      heat_up_time: "3 seconds",
      portafilter: "54 mm",
      steam_wand: "Automatic microfoam"
    }
  },
  {
    id: "la-marzocco-linea-micra",
    name: "Linea Micra",
    brand: "La Marzocco",
    category: "Prosumer Espresso",
    priceUsd: 4500,
    directUrl: "https://home.lamarzoccousa.com/product/linea-micra",
    imageUrl: "https://home.lamarzoccousa.com/wp-content/uploads/2023/11/Micra-White-Front.png",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      boiler_system: "Dual boiler",
      heat_up_time: "5 minutes",
      water_reservoir: "2 liters"
    }
  },
  {
    id: "la-marzocco-linea-mini",
    name: "Linea Mini",
    brand: "La Marzocco",
    category: "Prosumer Espresso",
    priceUsd: 6600,
    directUrl: "https://home.lamarzoccousa.com/product/linea-mini",
    imageUrl: "https://home.lamarzoccousa.com/wp-content/uploads/2024/02/Nera-mat-front-e1713981623547.png",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 87,
    specs: {
      boiler_system: "Dual boiler",
      grouphead: "Integrated grouphead",
      water_reservoir: "2.5 liters"
    }
  },
  {
    id: "segway-ninebot-max-g2",
    name: "Segway Ninebot MAX G2 Electric KickScooter",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 999.99,
    directUrl: "https://www.amazon.com/dp/B0C65CMKTK",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0C65CMKTK.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C65CMKTK",
    roiScore: 78,
    specs: {
      peak_motor_power: "1000 W",
      max_range: "43 miles",
      top_speed: "22 mph"
    }
  },
  {
    id: "razor-mx650-dirt-rocket",
    name: "Razor MX650 Dirt Rocket Electric Motocross Bike",
    brand: "Razor",
    category: "Utility EVs",
    priceUsd: 879.99,
    directUrl: "https://www.amazon.com/dp/B01LZ2OCKW",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B01LZ2OCKW.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B01LZ2OCKW",
    roiScore: 69,
    specs: {
      battery: "36 V sealed lead acid",
      top_speed: "17 mph",
      suspension: "Front and rear"
    }
  },
  {
    id: "segway-zt3-pro",
    name: "Segway ZT3 Pro Electric Scooter",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 849.99,
    directUrl: "https://www.amazon.com/dp/B0DDTFMPS6",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/P/B0DDTFMPS6.01.MAIN._SCLZZZZZZZ_.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0DDTFMPS6",
    roiScore: 77,
    specs: {
      peak_motor_power: "1600 W",
      max_range: "43.5 miles",
      top_speed: "24.9 mph"
    }
  },
  {
    id: "aventon-abound-lr",
    name: "Aventon Abound LR Ebike",
    brand: "Aventon",
    category: "Utility EVs",
    priceUsd: 1999,
    directUrl: "https://www.aventon.com/products/abound-lr-ebike",
    imageUrl: "https://aventon-images.imgix.net/files/01_Abound-LR_Stealth_Side_1-bike.jpg?v=1737999400&auto=compress,format",
    affiliateNetwork: "impact",
    merchantId: "231547",
    roiScore: 85,
    specs: {
      motor: "750 W",
      payload_capacity: "440 lb",
      max_range: "60 miles"
    }
  }
];
function init() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      startApp();
    });
  } else {
    startApp();
  }
}
function startApp() {
  const container = document.getElementById("matrixContainer");
  if (!container) {
    console.error("Matrix container not found");
    return;
  }
  try {
    const app = new MatrixApp("#matrixContainer", hardwareData);
    const loadingState = document.getElementById("loadingState");
    if (loadingState) {
      loadingState.classList.add("loaded");
      setTimeout(() => {
        if (loadingState.parentNode) {
          loadingState.parentNode.removeChild(loadingState);
        }
      }, 300);
    }
    window.__matrixApp = app;
    console.log(`Prosumer Matrix initialized with ${hardwareData.length} products`);
  } catch (error) {
    console.error("Failed to initialize MatrixApp:", error);
    const container2 = document.getElementById("matrixContainer");
    if (container2) {
      container2.innerHTML = `
        <div class="error-state">
          <h2>Initialization Error</h2>
          <p>Failed to load the specification matrix. Please refresh the page.</p>
          <details>
            <summary>Error details</summary>
            <pre>${error.message}</pre>
          </details>
        </div>
      `;
      const loadingState = document.getElementById("loadingState");
      if (loadingState) {
        loadingState.classList.add("loaded");
      }
    }
  }
}
init();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const baseUrl = "/prosumer-matrix/";
    navigator.serviceWorker.register(`${baseUrl}sw.js`, {
      scope: baseUrl
    }).then((registration) => {
      console.log("ServiceWorker registered:", registration.scope);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("New content available, refreshing...");
            }
          });
        }
      });
    }).catch((error) => {
      console.error("ServiceWorker registration failed:", error);
    });
  });
}
export {
  MatrixApp,
  hardwareData as default,
  init
};
