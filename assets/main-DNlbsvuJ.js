(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
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
function getCategorySvgFallback(category) {
  const iconMap = {
    "3D Printers": get3dPrinterSvg(),
    "CNC & Laser Cutters": getLaserCutterSvg(),
    "Off-Grid Solar & Power": getSolarSvg(),
    "Thermal & Mapping Drones": getDroneSvg(),
    "Prosumer Espresso": getEspressoSvg(),
    "Utility EVs": getEvmSvg()
  };
  return iconMap[category] || iconMap["3D Printers"];
}
function get3dPrinterSvg() {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect x="8" y="8" width="48" height="48" rx="4" fill="%231E293B" stroke="%23334155" stroke-width="2"/%3E%3Cpath d="M18 22h28M18 32h22M18 42h16" stroke="%230EA5E9" stroke-width="3" stroke-linecap="round" fill="none"/%3E%3Ccircle cx="46" cy="42" r="4" fill="%2310B981"/%3E%3C/svg%3E`;
}
function getLaserCutterSvg() {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect x="12" y="16" width="40" height="32" rx="2" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Cpath d="M24 28l8 8 8-8M28 36h8M28 40h8" stroke="%2310B981" stroke-width="2" stroke-linecap="round" fill="none"/%3E%3C/svg%3E`;
}
function getSolarSvg() {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Cpolygon points="32,8 8,48 56,48" fill="%231E293B" stroke="%230EA5E9" stroke-width="2" stroke-linejoin="round"/%3E%3Ccircle cx="32" cy="32" r="4" fill="%2310B981"/%3E%3C/svg%3E`;
}
function getDroneSvg() {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="8" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Cpath d="M8 24h16M8 40h16M40 24h16M40 40h16" stroke="%230EA5E9" stroke-width="2" stroke-linecap="round"/%3E%3Ccircle cx="8" cy="24" r="3" fill="%2310B981"/%3E%3Ccircle cx="8" cy="40" r="3" fill="%2310B981"/%3E%3Ccircle cx="56" cy="24" r="3" fill="%2310B981"/%3E%3Ccircle cx="56" cy="40" r="3" fill="%2310B981"/%3E%3C/svg%3E`;
}
function getEspressoSvg() {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Cellipse cx="32" cy="20" rx="18" ry="8" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Cpath d="M14 30v16M50 30v16M32 30v12" stroke="%231E293B" stroke-width="3" stroke-linecap="round"/%3E%3Cpath d="M18 46h28M22 50h20" stroke="%2310B981" stroke-width="3" stroke-linecap="round" fill="none"/%3E%3C/svg%3E`;
}
function getEvmSvg() {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect x="16" y="24" width="32" height="20" rx="4" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Ccircle cx="22" cy="44" r="6" fill="%2310B981"/%3E%3Ccircle cx="42" cy="44" r="6" fill="%2310B981"/%3E%3Cpath d="M10 28h4v-4M50 28h4v-4" stroke="%230EA5E9" stroke-width="2" stroke-linecap="round"/%3E%3C/svg%3E`;
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
function buildProductLink(item) {
  if (areAllIdsPlaceholder()) {
    return item.directUrl || "#";
  }
  const network = (item.affiliateNetwork || "").toLowerCase();
  switch (network) {
    case "impact":
      return buildImpactLink(item);
    case "awin":
      return buildAwinLink(item);
    case "amazon":
      return buildAmazonLink(item);
    default:
      return item.directUrl || "#";
  }
}
function buildImpactLink(item) {
  const { IMPACT_PUBLISHER_ID } = AFFILIATE_CONFIG;
  const merchantId = item.merchantId || "";
  const base = "https://impact.com/c/";
  const publisherId = encodeURIComponent(IMPACT_PUBLISHER_ID);
  const url = `${base}${merchantId}?affid=${publisherId}&jmp=true`;
  return url;
}
function buildAwinLink(item) {
  const { AWIN_PUBLISHER_ID } = AFFILIATE_CONFIG;
  const merchantId = item.merchantId || "";
  const url = `https://www.awin1.com/cread.php?awinmid=${AWIN_PUBLISHER_ID}&awinaffid=${AWIN_PUBLISHER_ID}&clickref=${merchantId}&p=${encodeURIComponent(item.name || "")}`;
  return url;
}
function buildAmazonLink(item) {
  const { AMAZON_TAG } = AFFILIATE_CONFIG;
  let asin = item.amazonAsin;
  if (!asin && item.merchantId) {
    asin = item.merchantId;
  }
  if (!asin) {
    const url2 = new URL(item.directUrl || "");
    const pathParts = url2.pathname.split("/");
    for (const part of pathParts) {
      if (/^[B][0-9A-Z]{9}$/.test(part)) {
        asin = part;
        break;
      }
    }
  }
  if (!asin) {
    asin = item.merchantId || "UNKNOWN";
  }
  const url = `https://www.amazon.com/dp/${asin}/?tag=${AMAZON_TAG}`;
  return url;
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

          <div class="category-pills" id="categoryPills" role="tablist" aria-label="Filter by category">
            <button class="category-pill ${this.selectedCategory === "all" ? "active" : ""}" data-category="all" role="tab" aria-selected="${this.selectedCategory === "all"}">
              All
            </button>
            ${this.getCategoryPills()}
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
              <th class="th-price" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="priceUsd" aria-label="Sort by price">
                    Price (USD)
                    <svg class="sort-arrow ${this.sortColumn === "priceUsd" ? "active" : ""} ${this.sortDirection === "desc" ? "desc" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-roi" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="roiScore" aria-label="Sort by ROI">
                    ROI Score
                    <svg class="sort-arrow ${this.sortColumn === "roiScore" ? "active" : ""} ${this.sortDirection === "desc" ? "desc" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    return this.filteredProducts.map((product) => {
      const imageUrl = getImageUrl(product.imageUrl, 80);
      const fallbackSvg = getCategorySvgFallback(product.category);
      return `
        <tr class="matrix-row" data-id="${product.id}" data-category="${product.category}">
          <td class="td-product">
            <div class="product-cell">
              <div class="product-thumbnail">
                <img
                  src="${imageUrl}"
                  alt="${product.name}"
                  loading="lazy"
                  onerror="this.onerror=null;this.src='${fallbackSvg}';"
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
      const fallbackSvg = getCategorySvgFallback(product.category);
      return `
        <div class="mobile-card" data-id="${product.id}">
          <div class="mobile-card-image">
            <img
              src="${imageUrl}"
              alt="${product.name}"
              loading="lazy"
              onerror="this.onerror=null;this.src='${fallbackSvg}';"
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
    const categories = [...new Set(this.products.map((p) => p.category))];
    return categories.map((cat) => `
      <button
        class="category-pill ${this.selectedCategory === cat ? "active" : ""}"
        data-category="${this.escapeHtml(cat)}"
        role="tab"
        aria-selected="${this.selectedCategory === cat}"
      >
        ${this.escapeHtml(cat)}
      </button>
    `).join("");
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
    this.container.querySelectorAll(".btn-buy, .btn-buy-primary").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          if (product.affiliateNetwork === "none") {
            window.open(product.directUrl, "_blank", "noopener,noreferrer");
          } else {
            this.showBuyModal(product);
          }
        }
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
   * Attach buy dropdown handlers
   */
  attachBuyDropdownHandlers() {
    this.container.querySelectorAll(".btn-buy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          this.showBuyModal(product);
        }
      });
    });
    this.container.querySelectorAll(".btn-buy-primary, .btn-buy-primary-clone").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        const product = this.products.find((p) => p.id === productId);
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
    if (product.affiliateNetwork === "none") {
      title.textContent = `${product.name} - Direct Link`;
      body.innerHTML = `
        <div class="modal-product">
          <div class="modal-product-image">
            <img
              src="${getImageUrl(product.imageUrl, 200)}"
              alt="${product.name}"
              onerror="this.onerror=null;this.src='${getCategorySvgFallback(product.category)}';"
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
            onerror="this.onerror=null;this.src='${getCategorySvgFallback(product.category)}';"
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
          onerror="this.onerror=null;this.src='${getCategorySvgFallback(product.category)}';"
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
    modal.style.display = "flex";
  }
}
const hardwareData = [
  {
    id: "creality-k1-max",
    name: "Creality K1 Max",
    brand: "Creality",
    category: "3D Printers",
    priceUsd: 999,
    directUrl: "https://www.creality.com/products/k1-max",
    imageUrl: "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B0CKWV1JHZ",
    roiScore: 78,
    specs: {
      print_volume: "220 × 220 × 250 mm",
      layer_height: "0.05 – 0.5 mm",
      nozzle_temp: "260 – 300 °C",
      bed_temp: "up to 100 °C",
      filament: "PLA, PETG, ABS, ASA, PC, Nylon, TPU",
      print_speed: "up to 600 mm/s",
      acceleration: "up to 20,000 mm/s²",
      connectivity: "WiFi, USB-C, Creality OS",
      auto_calibration: true,
      camera: "HD camera with AI failure detection"
    }
  },
  {
    id: "prusa-xl",
    name: "Prusa XL",
    brand: "Prusa Research",
    category: "3D Printers",
    priceUsd: 2499,
    directUrl: "https://www.prusa3d.com/product/prusa-xl/",
    imageUrl: "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
    affiliateNetwork: "none",
    merchantId: "prusa-direct",
    roiScore: 82,
    specs: {
      print_volume: "360 × 360 × 370 mm",
      layer_height: "0.02 – 0.5 mm",
      nozzle_temp: "up to 300 °C",
      bed_temp: "up to 120 °C",
      filament: "PLA, PETG, ABS, ASA, PC, Nylon, PEEK, PEKK",
      print_speed: "up to 600 mm/s",
      core_arms: "5-axis CORE Kinematics",
      auto_calibration: true,
      filament_sensor: "Runout sensor with pause on empty",
      dual_nozzle: "Oxide textured stainless steel"
    }
  },
  {
    id: "bambu-lab-x1c",
    name: "Bambu Lab X1 Carbon",
    brand: "Bambu Lab",
    category: "3D Printers",
    priceUsd: 1899,
    directUrl: "https://www.bambulab.com/en-us/products/x1c",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B0BJGJXQK5",
    roiScore: 75,
    specs: {
      print_volume: "256 × 256 × 256 mm",
      layer_height: "0.01 – 0.5 mm",
      nozzle_temp: "up to 300 °C",
      bed_temp: "up to 110 °C",
      filament: "PLA, PETG, ABS, ASA, PC, Nylon, Carbon Fiber filled",
      print_speed: "up to 500 mm/s",
      laser_meter: "Built-in LiDAR for auto-bed leveling",
      ai_camera: "AI failure detection with spaghetti detection",
      multi_machine: "Supported via Bambu Cloud",
      laser_engraver: "Optional 10W laser module"
    }
  },
  {
    id: "xtool-p2-50w",
    name: "xTool P2 50W",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 4999,
    directUrl: "https://www.xtool.com/products/xtool-p2-50w-laser-cutter",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    affiliateNetwork: "awin",
    merchantId: "xtool",
    roiScore: 68,
    specs: {
      laser_power: "50W (120W peak)",
      working_area: "400 × 400 mm",
      engraving_speed: "up to 1000 mm/s",
      cutting_speed: "up to 600 mm/s",
      cutting_thickness: "up to 25mm basswood, 8mm acrylic",
      blue_crystal_module: "455nm for finer cutting",
      red_violet_module: "405nm for marking",
      auto_focus: true,
      camera: "5MP wide-angle camera",
      air_assist: "Built-in air pump",
      rotation_raster: "360° rotary attachment supported"
    }
  },
  {
    id: "glowforge-plus",
    name: "Glowforge Pro",
    brand: "Glowforge",
    category: "CNC & Laser Cutters",
    priceUsd: 5995,
    directUrl: "https://www.glowforge.com/pro/",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    affiliateNetwork: "none",
    merchantId: "glowforge-direct",
    roiScore: 62,
    specs: {
      laser_power: "50W (claimed)",
      working_area: "420 × 320 mm (16.5 × 12.6 in)",
      dpi: "1000 dpi",
      material_thickness: "Up to 0.45 in hardwood, 0.25 in acrylic",
      camera: "Autofocus camera with print preview",
      honeycomb: "Included honeycomb bed",
      smart_squeeze: "Smart squeeze for material handling",
      air_assist: "Integrated air assist",
      encoders: "Linear encoders for precision",
      wifi: "WiFi connectivity"
    }
  },
  {
    id: "ecoflow-delta-pro-3",
    name: "EcoFlow Delta Pro 3",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 3599,
    directUrl: "https://www.ecoflow.com/products/delta-pro-3",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B0CH7VQXZG",
    roiScore: 88,
    specs: {
      capacity: "4096 Wh (expandable to 12 kWh)",
      output_ac: "3600W continuous (7200W boost)",
      output_voltage: "120V / 240V",
      charge_time: "0-80% in 50 minutes",
      solar_input: "Up to 3000W MPPT",
      "battery chemistry": "LiFePO4",
      cycle_life: "6000 cycles to 80%",
      inverter: "Pure sine wave",
      app_control: true,
      smart_home: "Grid-tie capable with EcoFlow Smart Home Panel"
    }
  },
  {
    id: "bluetti-ac200l",
    name: "Bluetti AC200L",
    brand: "Bluetti",
    category: "Off-Grid Solar & Power",
    priceUsd: 1499,
    directUrl: "https://www.bluettipower.com/products/bluetti-ac200l",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    affiliateNetwork: "awin",
    merchantId: "bluetti-ac200l",
    roiScore: 84,
    specs: {
      capacity: "2048 Wh (expandable to 4096 Wh)",
      output_ac: "2200W continuous (4800W surge)",
      output_voltage: "120V",
      charge_time: "0-80% in 50 minutes (AC)",
      solar_input: "Up to 900W MPPT",
      battery_chemistry: "LiFePO4",
      cycle_life: "3500+ cycles to 80%",
      inverter: "Pure sine wave",
      battery_management: "Smart BMS",
      wifi_bluetooth: "WiFi + Bluetooth app control"
    }
  },
  {
    id: "jackery-explorer-2000",
    name: "Jackery Explorer 2000 Plus",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 1999,
    directUrl: "https://www.jackery.com/products/explorer-2000-plus",
    imageUrl: "https://images.unsplash.com/photo-1585349868034-691062baac3c?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B0BQN7HPKT",
    roiScore: 80,
    specs: {
      capacity: "2048 Wh (expandable to 12 kWh)",
      output_ac: "2000W continuous (4000W surge)",
      output_voltage: "120V",
      charge_time: "0-80% in 1.7 hours (AC)",
      solar_input: "Up to 1000W",
      battery_chemistry: "LiFePO4",
      cycle_life: "4000 cycles to 80%",
      inverter: "Pure sine wave",
      battery_management: "Smart BMS",
      pass_through: "UPS function for seamless backup"
    }
  },
  {
    id: "dji-matrice-350-rtk",
    name: "DJI Matrice 350 RTK",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 13499,
    directUrl: "https://www.dji.com/matrice-350-rtk",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    affiliateNetwork: "none",
    merchantId: "dji-direct",
    roiScore: 91,
    specs: {
      max_flight_time: "55 minutes",
      max_speed: "72 km/h (no wind)",
      max_wind_resistance: "12 m/s (Level 5)",
      max_takeoff_altitude: "6000 m",
      horizon_lib: "Optional FLIR Duo Pro R thermal payload",
      payload_capacity: "2.7 kg",
      obstacle_sensing: "Forward, backward, left, right",
      transmission: "O3 Enterprise 5 km",
      dual_gps: "RTK positioning ±1 cm",
      battery_slots: "2 TB65 intelligent batteries"
    }
  },
  {
    id: "autel-evo-ii-dual",
    name: "Autel EVO II Dual 640T V3",
    brand: "Autel Robotics",
    category: "Thermal & Mapping Drones",
    priceUsd: 5999,
    directUrl: "https://www.autelrobotics.com/evO-II-dual-640T-V3",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B09VQXZ8RT",
    roiScore: 76,
    specs: {
      max_flight_time: "40 minutes",
      max_speed: "68 km/h",
      max_wind_resistance: "12 m/s",
      max_takeoff_altitude: "4500 m",
      thermal_resolution: "640 × 512 @ 30 Hz",
      thermal_sensitivity: "< 50 mK",
      zoom_camera: '1/2\\" CMOS 48MP, 10x optical zoom',
      obstacle_sensing: "6-way sensing",
      transmission: "15 km (FCC)",
      rtk: "Optional RG-N1 RTK module"
    }
  },
  {
    id: "dji-mavic-3-enterprise",
    name: "DJI Mavic 3 Enterprise",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 4139,
    directUrl: "https://www.dji.com/mavic-3-enterprise",
    imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b57c4?w=400&h=400&fit=crop",
    affiliateNetwork: "none",
    merchantId: "dji-direct",
    roiScore: 85,
    specs: {
      max_flight_time: "45 minutes",
      max_speed: "75.6 km/h (max cruise)",
      thermal_option: "M3T with 640×512 thermal (optional)",
      camera: "4/3 CMOS 20MP, Hasselblad",
      zoom: "56x hybrid zoom (28x lossless)",
      obstacle_sensing: "Omnidirectional",
      transmission: "O3 Enterprise (15 km)",
      rtk_module: "Optional D-RTK 2 Mobile Station",
      light_module: "DJI L1/L2 LiDAR optional"
    }
  },
  {
    id: "lamarzocco-linea-micra",
    name: "La Marzocco Linea Micra",
    brand: "La Marzocco",
    category: "Prosumer Espresso",
    priceUsd: 2499,
    directUrl: "https://www.lamarzocco.com/linea-micra/",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
    affiliateNetwork: "awin",
    merchantId: "lamarzocco",
    roiScore: 72,
    specs: {
      brew_pressure: "9 bar (preset)",
      boiler: "Dual thermoblock, PID controlled",
      temperature_stability: "±1°C",
      head_temperature: "93°C / 199.4°F (adjustable via app)",
      group_head: "Saturated Brew Group",
      water_filter: "APF in-tank water filtration",
      tank_capacity: "2.5 L",
      doser: "Manual doser with adjustable pre-infusion",
      connectivity: "WiFi + Bluetooth for app control",
      app_features: "Shot profiling, diagnostics, firmware updates",
      dimensions: "260 × 410 × 505 mm",
      weight: "24.5 kg"
    }
  },
  {
    id: "rocket-espresso-appartamento",
    name: "Rocket Espresso Appartamento",
    brand: "Rocket Espresso",
    category: "Prosumer Espresso",
    priceUsd: 2995,
    directUrl: "https://www.rocket-espresso.com/appartamento.html",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    affiliateNetwork: "none",
    merchantId: "rocket-direct",
    roiScore: 70,
    specs: {
      brew_pressure: "9 bar (manual pump)",
      boiler: "1.25 L stainless steel thermosiphon",
      temperature_stability: "PID digital control",
      group_head: "57mm BRAlternatively saturated",
      ports_server: "Hot water spout with steam wand",
      residual_toggle: "Commercial high-pressure pump",
      pressure_stat: "External gauge and pressure stat",
      thermal_hysteresis: "Manual PID adjust",
      dimensions: "400 × 330 × 400 mm",
      weight: "18 kg"
    }
  },
  {
    id: "eversys-mycoffeelab-center",
    name: "eversys myCoffeelab Center",
    brand: "Eversys",
    category: "Prosumer Espresso",
    priceUsd: 3490,
    directUrl: "https://www.eversys.com/mycoffeelab-center",
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B0CLXKJQ7P",
    roiScore: 68,
    specs: {
      brew_pressure: "Variable 0-12 bar (digital)",
      temperature_control: "0.1°C precision digital",
      shot_profiling: "Multi-profile with cloud sync",
      water_quality: "Integrated TDS sensor",
      connectivity: "WiFi + Ethernet + USB",
      app: "eversys myCoffeelab app",
      flow_meter: "Peristaltic flow measurement",
      temperature_probe: "Dual NTC probes",
      dimensions: "320 × 510 × 420 mm",
      warranty: "3 years comprehensive"
    }
  },
  {
    id: "tern-gsd-s10",
    name: "Tern GSD S10",
    brand: "Tern",
    category: "Utility EVs",
    priceUsd: 5299,
    directUrl: "https://ternbicycles.com/products/gsd-s10",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    affiliateNetwork: "awin",
    merchantId: "tern-gsd-s10",
    roiScore: 89,
    specs: {
      motor: "TQ HPR50 500W mid-drive",
      battery: "36V 20.7 Ah (745 Wh)",
      range: "up to 112 km (assist dependent)",
      max_speed: "45 km/h (28 mph S-Pedelec mode)",
      cargo_capacity: "95 kg combined",
      cargo_short_john: "Front Rack GSD Short John compatible",
      frame: 'High-tensile steel with 20" wheels',
      gearbox: "Shimano Alfine 8-speed",
      lights: "Integrated USB rechargeable LED",
      brakes: "Tektro hydraulic disc (180mm front, 160mm rear)",
      kicking: "Quick-release rear rack and cargo platform"
    }
  },
  {
    id: "cargo-bike-riese-muller",
    name: "Riese & Müller Load 60",
    brand: "Riese & Müller",
    category: "Utility EVs",
    priceUsd: 6499,
    directUrl: "https://www.r-m-pe.com/usa_en/produkte-lastenfaehren/lastenfahrrad-load.html",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    affiliateNetwork: "none",
    merchantId: "rm-direct",
    roiScore: 74,
    specs: {
      motor: "Bosch Performance Line CX 75 Nm",
      battery: "500 Wh or 625 Wh Range Extender",
      range: "up to 180 km (Eco mode)",
      max_speed: "25 km/h (pedelec) / 45 km/h (Speed pedelec)",
      cargo_capacity: "80 kg rear, 20 kg front",
      frame_geometry: "Dual deck, low step-through",
      suspension: "Lockout front fork, rear elastomer",
      lights: "Bosch integrated LED",
      brakes: "Shimano hydraulic disc 180/160mm",
      gears: "Shimano Nexus 7D or Enviolo CVP"
    }
  },
  {
    id: "ripmow-450",
    name: "RIPMOw 450",
    brand: "Worx",
    category: "Utility EVs",
    priceUsd: 1299,
    directUrl: "https://www.worx.com/products/landroid-m",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    affiliateNetwork: "amazon",
    merchantId: "B07YJ92CFV",
    roiScore: 81,
    specs: {
      motor: "Brushless 20V MAX",
      cutting_width: "22 cm",
      cutting_height: "20 – 60 mm",
      tackle: "Nyline cutting system, 180° pivoting",
      battery: "20V 6.0 Ah or 4.0 Ah (up to 2.5 hours)",
      rain_sensor: "Automatic return to charging station",
      anti_theft: "GPS tracking (optional module)",
      slope_handling: "Handles slopes up to 70%",
      mulching: "Discharge mulching plug included",
      app_control: "Worx Landroid app with boundary setup"
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
    navigator.serviceWorker.register("/prosumer-matrix/sw.js", {
      scope: "/prosumer-matrix/"
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
