const __vite_import_meta_env__ = {};
function getProductImageFallback(product = {}) {
  const brand = truncateLabel$1(product.brand || "Prosumer Matrix", 26);
  const model = truncateLabel$1(product.name || "Image unavailable", 34);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeXml$1(brand)} ${escapeXml$1(model)}">
      <rect width="640" height="400" fill="#1e293b"/>
      <rect x="20" y="20" width="600" height="360" rx="20" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <path d="M270 112h100M270 160h76M270 208h124" stroke="#0ea5e9" stroke-width="12" stroke-linecap="round"/>
      <circle cx="382" cy="208" r="13" fill="#10b981"/>
      <text x="320" y="278" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="24" font-weight="700">${escapeXml$1(brand)}</text>
      <text x="320" y="320" text-anchor="middle" fill="#f1f5f9" font-family="Arial, sans-serif" font-size="22">${escapeXml$1(model)}</text>
      <text x="320" y="350" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="16">Product image unavailable</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function truncateLabel$1(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
function escapeXml$1(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function getImageUrl(rawUrl, width = 400) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "";
  }
  if (rawUrl.startsWith("/images/")) {
    const baseUrl2 = typeof import.meta !== "undefined" && __vite_import_meta_env__ ? "/prosumer-matrix/" : "/prosumer-matrix/";
    return `${baseUrl2.replace(/\/$/, "")}${rawUrl}`;
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
  if (!product || typeof product !== "object") {
    return "#";
  }
  if (!product.affiliateUrl && !product.affiliateNetwork && product.directUrl) {
    return cleanDestinationUrl(product.directUrl) || product.directUrl;
  }
  const destination = cleanDestinationUrl(product.directUrl) || (typeof product.directUrl === "string" ? product.directUrl.trim() : "");
  const fallbackUrl = product.affiliateUrl || destination || product.directUrl || "#";
  if (!destination && !product.affiliateUrl && !product.directUrl) {
    return "#";
  }
  if (areAllIdsPlaceholder()) {
    return destination || fallbackUrl;
  }
  const network = (product.affiliateNetwork || "").trim().toLowerCase();
  if (!network || network === "none" || network === "direct") {
    return destination || fallbackUrl;
  }
  switch (network) {
    case "impact":
      return buildImpactLink(product, destination) || fallbackUrl;
    case "awin":
      return buildAwinLink(product, destination) || fallbackUrl;
    case "amazon":
      return buildAmazonLink(product, destination) || fallbackUrl;
    case "shareasale":
      return buildShareASaleLink(product, destination) || fallbackUrl;
    default:
      return product.affiliateUrl || destination || fallbackUrl;
  }
}
function buildImpactLink(product, destination) {
  const target = destination || cleanDestinationUrl(product == null ? void 0 : product.directUrl) || (product == null ? void 0 : product.directUrl);
  const campaignId = String(
    (product == null ? void 0 : product.impactCampaignId) || ((product == null ? void 0 : product.merchantId) && (product == null ? void 0 : product.merchantId) !== "direct" ? product == null ? void 0 : product.merchantId : "") || "248631"
  ).trim();
  const affiliateId = String(
    (product == null ? void 0 : product.affiliateId) || (product == null ? void 0 : product.impactPublisherId) || (AFFILIATE_CONFIG == null ? void 0 : AFFILIATE_CONFIG.IMPACT_PUBLISHER_ID)
  ).trim();
  if (!target || !campaignId || campaignId === "direct" || campaignId.startsWith("PLACEHOLDER") || !affiliateId || affiliateId.startsWith("PLACEHOLDER")) {
    return target || (product == null ? void 0 : product.affiliateUrl) || "#";
  }
  const encodedCampaign = encodeURIComponent(campaignId);
  const encodedAffiliate = encodeURIComponent(affiliateId);
  const encodedTarget = encodeURIComponent(target);
  return `https://impact.com/c/${encodedCampaign}?affid=${encodedAffiliate}&u=${encodedTarget}`;
}
function buildAwinLink(product, destination) {
  const target = destination || cleanDestinationUrl(product == null ? void 0 : product.directUrl) || (product == null ? void 0 : product.directUrl);
  const merchantId = String(
    (product == null ? void 0 : product.awinMid) || ((product == null ? void 0 : product.merchantId) && (product == null ? void 0 : product.merchantId) !== "direct" ? product == null ? void 0 : product.merchantId : "") || "46345"
  ).trim();
  const affiliateId = String(
    (product == null ? void 0 : product.affiliateId) || (product == null ? void 0 : product.awinAffid) || (AFFILIATE_CONFIG == null ? void 0 : AFFILIATE_CONFIG.AWIN_PUBLISHER_ID)
  ).trim();
  if (!target || !merchantId || merchantId === "direct" || merchantId.startsWith("PLACEHOLDER") || !affiliateId || affiliateId.startsWith("PLACEHOLDER")) {
    return target || (product == null ? void 0 : product.affiliateUrl) || "#";
  }
  const encodedMerchant = encodeURIComponent(merchantId);
  const encodedAffiliate = encodeURIComponent(affiliateId);
  const encodedTarget = encodeURIComponent(target);
  return `https://www.awin1.com/cread.php?awinmid=${encodedMerchant}&awinaffid=${encodedAffiliate}&ued=${encodedTarget}`;
}
function buildAmazonLink(product, destination) {
  const target = destination || cleanDestinationUrl(product == null ? void 0 : product.directUrl) || (product == null ? void 0 : product.directUrl);
  const asin = String((product == null ? void 0 : product.asin) || (product == null ? void 0 : product.merchantId) || "").trim();
  const tag = String((product == null ? void 0 : product.amazonTag) || (AFFILIATE_CONFIG == null ? void 0 : AFFILIATE_CONFIG.AMAZON_TAG)).trim();
  if (!asin || asin === "direct" || asin.startsWith("PLACEHOLDER") || !tag || tag.startsWith("PLACEHOLDER")) {
    return target || (product == null ? void 0 : product.affiliateUrl) || "#";
  }
  return `https://www.amazon.com/dp/${encodeURIComponent(asin)}/?tag=${encodeURIComponent(tag)}`;
}
function buildShareASaleLink(product, destination) {
  const target = destination || cleanDestinationUrl(product == null ? void 0 : product.directUrl) || (product == null ? void 0 : product.directUrl);
  const merchantId = String((product == null ? void 0 : product.shareasaleMerchantId) || (product == null ? void 0 : product.merchantId) || "").trim();
  const userId = String((product == null ? void 0 : product.affiliateId) || (product == null ? void 0 : product.shareasaleUserId) || (AFFILIATE_CONFIG == null ? void 0 : AFFILIATE_CONFIG.SHAREASALE_USER_ID)).trim();
  if (!target || !merchantId || merchantId === "direct" || merchantId.startsWith("PLACEHOLDER") || !userId || userId.startsWith("PLACEHOLDER")) {
    return target || (product == null ? void 0 : product.affiliateUrl) || "#";
  }
  const encodedMerchant = encodeURIComponent(merchantId);
  const encodedUser = encodeURIComponent(userId);
  const encodedTarget = encodeURIComponent(target);
  return `https://shareasale.com/r.cfm?b=${encodedMerchant}&u=${encodedUser}&m=${encodedMerchant}&urllink=${encodedTarget}`;
}
function getNetworkDisplayName(network) {
  const names = {
    impact: "Impact",
    awin: "Awin",
    amazon: "Amazon",
    shareasale: "ShareASale",
    none: "Direct"
  };
  return names[network == null ? void 0 : network.toLowerCase()] || "Direct";
}
function formatPriceRange(products = []) {
  if (!products || products.length === 0) {
    return "$0";
  }
  const prices = products.map((p) => typeof p === "number" ? p : p == null ? void 0 : p.priceUsd).filter((p) => typeof p === "number" && !isNaN(p) && p >= 0);
  if (prices.length === 0) {
    return "$0";
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) {
    return `$${min.toLocaleString()}`;
  }
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}
function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "N/A";
  }
  return `$${amount.toLocaleString()}`;
}
function formatSpecKey(key) {
  if (!key) return "";
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatSpecValue(value) {
  if (value === null || value === void 0) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
function renderSpecsModalContent(product) {
  if (!product) return "";
  const rawList = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const firstImage = rawList[0] || product.imageUrl;
  const imageFallback = getProductImageFallback(product);
  const productLink = buildProductLink(product);
  const networkName = getNetworkDisplayName(product.affiliateNetwork);
  const specsHtml = product.specs && Object.keys(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => `
      <div class="specs-row">
        <span class="specs-key">${escapeHtml(formatSpecKey(key))}</span>
        <span class="specs-value">${escapeHtml(formatSpecValue(value))}</span>
      </div>
    `).join("") : '<p class="no-specs">No specifications available</p>';
  const carouselHtml = rawList.length > 1 ? `
      <div class="specs-carousel-container" data-modal-carousel="true" data-product-id="${product.id}">
        <div class="specs-carousel-display">
          <img
            src="${getImageUrl(firstImage, 400) || firstImage}"
            alt="${escapeHtml(product.name)}"
            onerror="this.onerror=null;this.src='${imageFallback}';"
            class="specs-carousel-img"
            id="modalCarouselImg"
          >
        </div>
        <div class="specs-thumbnail-row">
          ${rawList.map((img, idx) => `
            <button
              type="button"
              class="specs-thumb-btn ${idx === 0 ? "active" : ""}"
              data-img-src="${getImageUrl(img, 400) || img}"
              aria-label="View thumbnail ${idx + 1}"
            >
              <img src="${getImageUrl(img, 100) || img}" alt="Thumb ${idx + 1}" onerror="this.onerror=null;this.src='${imageFallback}';">
            </button>
          `).join("")}
        </div>
      </div>
    ` : `
      <div class="specs-hero-image">
        <img
          src="${getImageUrl(firstImage, 360) || firstImage}"
          alt="${escapeHtml(product.name)}"
          onerror="this.onerror=null;this.src='${imageFallback}';"
          class="specs-image"
        >
      </div>
    `;
  return `
    <div class="specs-header">
      ${carouselHtml}
      <div class="specs-meta">
        <span class="specs-brand">${escapeHtml(product.brand)}</span>
        <h3 class="specs-title">${escapeHtml(product.name)}</h3>
        <span class="specs-category">${escapeHtml(product.category)}</span>
      </div>
    </div>

    <div class="specs-content">
      <div class="specs-list">
        ${specsHtml}
      </div>

      <div class="specs-footer">
        <div class="specs-price">
          <span class="price-label">Price</span>
          <span class="price-value">${formatCurrency(product.priceUsd)}</span>
        </div>
        <div class="specs-roi">
          <span class="roi-label">ROI Score</span>
          <span class="roi-value">${product.roiScore || "N/A"}/100</span>
        </div>
        <div class="specs-network">
          <span class="network-label">Network</span>
          <span class="network-value">${escapeHtml(networkName)}</span>
        </div>

        <p class="specs-disclosure" style="font-size: 11px; color: rgba(148, 163, 184, 0.8); text-align: center; margin-top: 16px; margin-bottom: 8px;">
          * Clicking this link takes you to our partner merchant. We may earn a qualifying commission.
        </p>

        <a
          href="${productLink}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-specs-buy"
          aria-label="View ${escapeHtml(product.name)} item details"
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
}
function escapeHtml(text) {
  if (typeof text !== "string") return String(text ?? "");
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function getCarouselFallbackSvg(brand = "", category = "") {
  const brandLabel = truncateLabel(brand || "Hardware", 26);
  const categoryLabel = truncateLabel(category || "Product", 34);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeXml(brandLabel)} ${escapeXml(categoryLabel)}">
    <rect width="100%" height="100%" fill="#0f172a"/>
    <circle cx="150" cy="75" r="24" fill="#1e293b"/>
    <path d="M142 75l16 0m-8 -8l0 16" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
    <text x="50%" y="125" dominant-baseline="middle" text-anchor="middle" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">${escapeXml(brandLabel)}</text>
    <text x="50%" y="148" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">${escapeXml(categoryLabel)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function attachCarouselImageFallback(root) {
  if (!root || typeof root.addEventListener !== "function") return;
  root.addEventListener("error", (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";
    const brand = img.dataset.brand || "";
    const category = img.dataset.category || "";
    img.src = getCarouselFallbackSvg(brand, category);
  }, true);
}
function renderImageCarouselHtml(product, activeIdx = 0) {
  if (!product) return "";
  const rawList = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const imageList = rawList.length > 0 ? rawList : ["#placeholder"];
  const currentIndex = Math.min(Math.max(0, activeIdx), imageList.length - 1);
  const currentSrc = imageList[currentIndex];
  const title = product.name || "Hardware";
  const category = product.category || "Product";
  const dotsHtml = imageList.length > 1 ? `
      <div class="carousel-dots absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-auto" data-product-id="${product.id}">
        ${imageList.map((_, idx) => `
          <button
            type="button"
            class="carousel-dot ${idx === currentIndex ? "active" : ""}"
            data-carousel-action="dot"
            data-index="${idx}"
            data-product-id="${product.id}"
            aria-label="Go to slide ${idx + 1}"
          ></button>
        `).join("")}
      </div>
    ` : "";
  const arrowsHtml = imageList.length > 1 ? `
      <button
        type="button"
        class="carousel-arrow carousel-prev"
        data-carousel-action="prev"
        data-product-id="${product.id}"
        aria-label="Previous Image"
      >
        &#10094;
      </button>
      <button
        type="button"
        class="carousel-arrow carousel-next"
        data-carousel-action="next"
        data-product-id="${product.id}"
        aria-label="Next Image"
      >
        &#10095;
      </button>
    ` : "";
  return `
    <div
      class="image-carousel relative group w-full bg-slate-900/80 rounded-t-lg overflow-hidden"
      data-product-id="${product.id}"
      data-current-index="${currentIndex}"
      data-total-images="${imageList.length}"
    >
      <div
        class="carousel-display h-48 sm:h-56 w-full flex items-center justify-center p-3 cursor-pointer overflow-x-auto snap-x snap-mandatory no-scrollbar"
        data-action="specs"
        data-product-id="${product.id}"
        title="Click to view full specifications"
      >
        <img
          src="${getImageUrl(currentSrc, 400) || currentSrc}"
          alt="${escapeXml(title)} view ${currentIndex + 1}"
          loading="lazy"
          data-brand="${escapeXml(product.brand || "")}"
          data-category="${escapeXml(product.category || "")}"
          class="carousel-img max-w-full max-h-full object-contain pointer-events-none transition-all duration-200"
        >
        <span class="mobile-category-badge">${escapeXml(category)}</span>
      </div>
      ${arrowsHtml}
      ${dotsHtml}
    </div>
  `;
}
function escapeXml(text) {
  if (typeof text !== "string") return String(text ?? "");
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function truncateLabel(value, maxLength) {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
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
      this.hideModal("specsModal");
    }
  }
  /**
   * Toggle the mobile slide-out drawer
   * @param {boolean} [open]
   */
  toggleDrawer(open) {
    this.isDrawerOpen = typeof open === "boolean" ? open : !this.isDrawerOpen;
    const drawer = this.container.querySelector("#mobileDrawer");
    const toggleBtn = this.container.querySelector("#menu-toggle");
    if (drawer) {
      drawer.classList.toggle("open", this.isDrawerOpen);
      drawer.setAttribute("aria-hidden", (!this.isDrawerOpen).toString());
    }
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", this.isDrawerOpen.toString());
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
          <div class="matrix-header-disclosure">
            We may earn an affiliate commission from merchant links on this site at no extra cost to you.
          </div>
        </header>

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
              <option value="name" ${this.sortColumn === "name" ? "selected" : ""}>Name</option>
              <option value="priceUsd" ${this.sortColumn === "priceUsd" ? "selected" : ""}>Price</option>
              <option value="roiScore" ${this.sortColumn === "roiScore" ? "selected" : ""}>ROI Score</option>
            </select>
            <button type="button" class="sort-direction" id="sortDirection" aria-label="Toggle sort direction" title="${this.sortDirection === "asc" ? "Ascending" : "Descending"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${this.sortDirection === "desc" ? "rotated" : ""}">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info">
          <span class="results-count">${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? "s" : ""}</span>
          ${this.searchQuery ? `<span class="search-query">matching "${this.escapeHtml(this.searchQuery)}"</span>` : ""}
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
                  <button type="button" class="th-sort-btn" data-column="name" aria-label="Sort by name">
                    Product
                    <svg class="sort-arrow ${this.sortColumn === "name" ? "active" : ""} ${this.sortDirection === "desc" ? "desc" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-brand" scope="col">
                <div class="th-content">
                  <button type="button" class="th-sort-btn" data-column="brand" aria-label="Sort by brand">
                    Brand
                    <svg class="sort-arrow ${this.sortColumn === "brand" ? "active" : ""} ${this.sortDirection === "desc" ? "desc" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                    <svg class="sort-arrow ${this.sortColumn === "priceUsd" ? "active" : ""} ${this.sortDirection === "desc" ? "desc" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    return this.filteredProducts.map((product) => {
      const rawList = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
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
            <span class="roi-inline">ROI ${product.roiScore || "N/A"}</span>
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
    }).join("");
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
    return this.filteredProducts.map((product) => {
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
                <span class="roi-value">${product.roiScore || "N/A"}/100</span>
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
    }).join("");
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
    `).join("");
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
    `).join("");
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
    const categories = ["all", ...new Set(this.products.map((p) => p.category))];
    return categories.map((cat) => {
      const label = cat === "all" ? "All" : cat;
      return `
        <button
          type="button"
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
   * Get drawer categories HTML
   */
  getDrawerCategories() {
    const categories = ["all", ...new Set(this.products.map((p) => p.category))];
    return categories.map((cat) => {
      const label = cat === "all" ? "All Products" : cat;
      const count = cat === "all" ? this.products.length : this.products.filter((p) => p.category === cat).length;
      return `
        <button
          type="button"
          class="drawer-category-btn ${this.selectedCategory === cat ? "active" : ""}"
          data-category="${this.escapeHtml(cat)}"
        >
          <span>${this.escapeHtml(label)}</span>
          <span class="drawer-category-count">${count}</span>
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
   * Get price range string without duplicate currency symbols
   */
  getPriceRange() {
    return formatPriceRange(this.products);
  }
  /**
   * Escape HTML entities
   */
  escapeHtml(text) {
    if (typeof text !== "string") return String(text ?? "");
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  /**
   * Attach event listeners using robust event delegation
   */
  attachEventListeners() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const searchInput = this.container.querySelector("#searchInput");
    const searchClear = this.container.querySelector("#searchClear");
    searchInput == null ? void 0 : searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = this.searchQuery ? "flex" : "none";
      }
      this.applyFilters();
    });
    searchClear == null ? void 0 : searchClear.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
      }
      this.searchQuery = "";
      searchClear.style.display = "none";
      this.applyFilters();
    });
    const mobileMenuToggle = this.container.querySelector("#menu-toggle");
    mobileMenuToggle == null ? void 0 : mobileMenuToggle.addEventListener("click", () => {
      this.toggleDrawer();
    });
    attachCarouselImageFallback(this.container);
    const drawerClose = this.container.querySelector("#drawerClose");
    drawerClose == null ? void 0 : drawerClose.addEventListener("click", () => {
      this.toggleDrawer(false);
    });
    const drawerOverlay = this.container.querySelector("#drawerOverlay");
    drawerOverlay == null ? void 0 : drawerOverlay.addEventListener("click", () => {
      this.toggleDrawer(false);
    });
    (_a = this.container.querySelector("#drawerCategories")) == null ? void 0 : _a.addEventListener("click", (e) => {
      const btn = e.target.closest(".drawer-category-btn");
      if (btn) {
        const category = btn.dataset.category;
        this.selectCategory(category);
        this.toggleDrawer(false);
      }
    });
    (_b = this.container.querySelector("#categoryPills")) == null ? void 0 : _b.addEventListener("click", (e) => {
      const pill = e.target.closest(".category-pill");
      if (pill) {
        const category = pill.dataset.category;
        this.selectCategory(category);
      }
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
      btn.addEventListener("click", () => {
        const column = btn.dataset.column;
        if (column === "specs") return;
        const isCurrent = column === this.sortColumn;
        this.sortColumn = column;
        this.sortDirection = isCurrent && this.sortDirection === "asc" ? "desc" : "asc";
        this.applyFilters();
        this.updateSortIndicators();
      });
    });
    this.container.addEventListener("click", (e) => {
      const prevBtn = e.target.closest('[data-carousel-action="prev"]');
      if (prevBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = prevBtn.dataset.productId;
        const carousel = prevBtn.closest(".image-carousel");
        this.navigateCarousel(carousel, productId, -1);
        return;
      }
      const nextBtn = e.target.closest('[data-carousel-action="next"]');
      if (nextBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = nextBtn.dataset.productId;
        const carousel = nextBtn.closest(".image-carousel");
        this.navigateCarousel(carousel, productId, 1);
        return;
      }
      const dotBtn = e.target.closest('[data-carousel-action="dot"]');
      if (dotBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = dotBtn.dataset.productId;
        const targetIndex = Number.parseInt(dotBtn.dataset.index, 10);
        const carousel = dotBtn.closest(".image-carousel");
        this.setCarouselIndex(carousel, productId, targetIndex);
        return;
      }
      const specsBtn = e.target.closest(".btn-fullspecs");
      if (specsBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = specsBtn.dataset.id;
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          this.setSelectedProduct(product);
        }
        return;
      }
      const specsCell = e.target.closest('.td-specs, .td-product[data-action="specs"], [data-action="specs"]');
      if (specsCell && !e.target.closest("a, button")) {
        const row = specsCell.closest(".matrix-row, .mobile-card");
        const productId = (row == null ? void 0 : row.dataset.id) || specsCell.dataset.productId || specsCell.dataset.id;
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          this.setSelectedProduct(product);
        }
        return;
      }
    });
    (_c = document.getElementById("modalClose")) == null ? void 0 : _c.addEventListener("click", () => this.hideModal("buyModal"));
    (_d = document.getElementById("modalOverlay")) == null ? void 0 : _d.addEventListener("click", () => this.hideModal("buyModal"));
    (_e = document.getElementById("specsModalClose")) == null ? void 0 : _e.addEventListener("click", () => this.setSelectedProduct(null));
    (_f = document.getElementById("specsModalOverlay")) == null ? void 0 : _f.addEventListener("click", () => this.setSelectedProduct(null));
    (_g = document.getElementById("specsModal")) == null ? void 0 : _g.addEventListener("click", (e) => {
      if (e.target.id === "specsModal" || e.target.id === "specsModalOverlay") {
        this.setSelectedProduct(null);
      }
    });
    (_h = document.getElementById("specsModalBody")) == null ? void 0 : _h.addEventListener("click", (e) => {
      const thumb = e.target.closest(".specs-thumb-btn");
      if (thumb) {
        const newSrc = thumb.dataset.imgSrc;
        const mainImg = document.getElementById("modalCarouselImg");
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
          document.querySelectorAll(".specs-thumb-btn").forEach((t) => t.classList.remove("active"));
          thumb.classList.add("active");
        }
      }
    });
    document.addEventListener("keydown", (e) => {
      var _a2;
      if (e.key === "Escape") {
        this.hideModal("buyModal");
        this.setSelectedProduct(null);
        this.toggleDrawer(false);
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
   * Navigate carousel forward or backward
   * @param {HTMLElement} carousel
   * @param {string} productId
   * @param {number} delta
   */
  navigateCarousel(carousel, productId, delta) {
    if (!carousel) return;
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;
    const rawList = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
    if (rawList.length <= 1) return;
    let currentIndex = Number.parseInt(carousel.dataset.currentIndex || "0", 10);
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
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;
    const rawList = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
    if (rawList.length <= 1) return;
    const safeIndex = Math.min(Math.max(0, targetIndex), rawList.length - 1);
    carousel.dataset.currentIndex = safeIndex.toString();
    const img = carousel.querySelector(".carousel-img");
    if (img) {
      const newSrc = rawList[safeIndex];
      img.src = getImageUrl(newSrc, 400) || newSrc;
    }
    const dots = carousel.querySelectorAll(".carousel-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === safeIndex);
    });
  }
  /**
   * Select a category and update pills
   * @param {string} category
   */
  selectCategory(category) {
    this.selectedCategory = category;
    this.container.querySelectorAll(".category-pill").forEach((p) => {
      const isSelected = p.dataset.category === this.selectedCategory;
      p.classList.toggle("active", isSelected);
      p.setAttribute("aria-selected", isSelected.toString());
    });
    this.container.querySelectorAll(".drawer-category-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.category === this.selectedCategory);
    });
    this.applyFilters();
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
          aValue = a.priceUsd ?? 0;
          bValue = b.priceUsd ?? 0;
          return this.sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        case "roiScore":
          aValue = a.roiScore ?? 0;
          bValue = b.roiScore ?? 0;
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
    const resultsCount = this.container.querySelector(".results-count");
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? "s" : ""}`;
    }
    this.updateSortIndicators();
    this.handleResize();
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
    } else {
      if (mobileView) mobileView.style.display = "none";
      if (desktopContent) desktopContent.style.display = "block";
      this.toggleDrawer(false);
    }
  }
  /**
   * Show buy modal
   * @param {Object} product
   */
  showBuyModal(product) {
    const modal = document.getElementById("buyModal");
    const body = document.getElementById("modalBody");
    const title = document.getElementById("modalTitle");
    if (!modal || !body) return;
    const imageFallback = getProductImageFallback(product);
    const directUrl = product.directUrl;
    const affiliateUrl = buildProductLink(product);
    const networkName = getNetworkDisplayName(product.affiliateNetwork);
    const hasAffiliate = product.affiliateNetwork && product.affiliateNetwork !== "none";
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
   * @param {string} modalId
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    }
  }
  /**
   * Show full specs modal
   * @param {Object} product
   */
  showSpecsModal(product) {
    const modal = document.getElementById("specsModal");
    const body = document.getElementById("specsModalBody");
    const title = document.getElementById("specsModalTitle");
    if (!modal || !body) return;
    if (title) {
      title.textContent = `${product.name} - Full Specifications`;
    }
    body.innerHTML = renderSpecsModalContent(product);
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
    imageUrl: "/images/amazon/B0DNPZW6BY.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0DNPZW6BY",
    roiScore: 76,
    specs: {
      build_volume: "220 × 220 × 250 mm",
      max_print_speed: "600 mm/s",
      nozzle_temperature: "300 °C"
    },
    images: [
      "/images/amazon/B0DNPZW6BY.jpg",
      "/images/amazon/B0DNPZW6BY.jpg",
      "/images/amazon/B0DNPZW6BY.jpg"
    ]
  },
  {
    id: "bambu-lab-a1-mini",
    name: "Bambu Lab A1 mini 3D Printer + LED Lamp Kit",
    brand: "Bambu Lab",
    category: "3D Printers",
    priceUsd: 219,
    directUrl: "https://www.amazon.com/dp/B0GQMJ8QQT",
    imageUrl: "/images/amazon/B0GQMJ8QQT.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0GQMJ8QQT",
    roiScore: 82,
    specs: {
      build_volume: "180 × 180 × 180 mm",
      max_print_speed: "500 mm/s",
      calibration: "Fully automatic"
    },
    images: [
      "/images/amazon/B0GQMJ8QQT.jpg",
      "/images/amazon/B0GQMJ8QQT.jpg",
      "/images/amazon/B0GQMJ8QQT.jpg"
    ]
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
    },
    images: [
      "https://store.bblcdn.com/s7/default/465c4c8bf2a746069eee46eda06f5a62/P1SC2-compressed.jpg",
      "https://store.bblcdn.com/s7/default/465c4c8bf2a746069eee46eda06f5a62/P1SC2-compressed.jpg&h=401",
      "https://store.bblcdn.com/s7/default/465c4c8bf2a746069eee46eda06f5a62/P1SC2-compressed.jpg&h=402"
    ]
  },
  {
    id: "xtool-s1-20w",
    name: "xTool S1 20W Laser Cutter and Laser Engraver",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 1599,
    directUrl: "https://www.amazon.com/dp/B0CPM1MSS4",
    imageUrl: "/images/amazon/B0CPM1MSS4.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CPM1MSS4",
    roiScore: 81,
    specs: {
      laser_output: "20W diode",
      working_area: "23.93 × 15.16 in",
      max_speed: "600 mm/s"
    },
    images: [
      "/images/amazon/B0CPM1MSS4.jpg",
      "/images/amazon/B0CPM1MSS4.jpg",
      "/images/amazon/B0CPM1MSS4.jpg"
    ]
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
    },
    images: [
      "https://www.xtool.com/cdn/shop/files/mk-p2-p2s-v30_us_pc_p2s_2Bf1-black-productiveduo-black_10723-4360_ff86d9ca-713f-4a65-9a64-a7695ee0f6a9.webp?v=1767868459",
      "https://www.xtool.com/cdn/shop/files/mk-p2-p2s-v30_us_pc_p2s_2Bf1-black-productiveduo-black_10723-4360_ff86d9ca-713f-4a65-9a64-a7695ee0f6a9.webp?v=1767868459&h=401",
      "https://www.xtool.com/cdn/shop/files/mk-p2-p2s-v30_us_pc_p2s_2Bf1-black-productiveduo-black_10723-4360_ff86d9ca-713f-4a65-9a64-a7695ee0f6a9.webp?v=1767868459&h=402"
    ]
  },
  {
    id: "glowforge-spark",
    name: "Glowforge Spark Craft Laser Printer",
    brand: "Glowforge",
    category: "CNC & Laser Cutters",
    priceUsd: 599,
    directUrl: "https://www.amazon.com/dp/B0D6P48TV5",
    imageUrl: "/images/amazon/B0D6P48TV5.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D6P48TV5",
    roiScore: 72,
    specs: {
      laser_type: "Diode craft laser",
      camera: "Onboard preview camera",
      materials: "Wood, leather, paper, acrylic and more"
    },
    images: [
      "/images/amazon/B0D6P48TV5.jpg",
      "/images/amazon/B0D6P48TV5.jpg",
      "/images/amazon/B0D6P48TV5.jpg"
    ]
  },
  {
    id: "ecoflow-delta-2",
    name: "EF ECOFLOW DELTA 2 Portable Power Station",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 499,
    directUrl: "https://www.amazon.com/dp/B0B9XB57XM",
    imageUrl: "/images/amazon/B0B9XB57XM.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B9XB57XM",
    roiScore: 86,
    specs: {
      capacity: "1024 Wh",
      ac_output: "1800 W",
      battery_chemistry: "LiFePO4"
    },
    images: [
      "/images/amazon/B0B9XB57XM.jpg",
      "/images/amazon/B0B9XB57XM.jpg",
      "/images/amazon/B0B9XB57XM.jpg"
    ]
  },
  {
    id: "jackery-explorer-1000-v2",
    name: "Jackery Explorer 1000 v2 Portable Power Station",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 799,
    directUrl: "https://www.amazon.com/dp/B0D7PPG25F",
    imageUrl: "/images/amazon/B0D7PPG25F.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D7PPG25F",
    roiScore: 84,
    specs: {
      capacity: "1070 Wh",
      ac_output: "1500 W",
      charge_time: "1 hour fast charge"
    },
    images: [
      "/images/amazon/B0D7PPG25F.jpg",
      "/images/amazon/B0D7PPG25F.jpg",
      "/images/amazon/B0D7PPG25F.jpg"
    ]
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
    },
    images: [
      "https://us.ecoflow.com/cdn/shop/files/ecoflow-ecoflow-delta-pro-ultra-whole-home-backup-power-ul-9540-certificated-dpu-bundle-delta-pro-ultra-1-x-inverter-1-x-battery-1253485498.png?v=1786091054&width=1240",
      "https://us.ecoflow.com/cdn/shop/files/ecoflow-ecoflow-delta-pro-ultra-whole-home-backup-power-ul-9540-certificated-dpu-bundle-delta-pro-ultra-1-x-inverter-1-x-battery-1253485498.png?v=1786091054&width=1240&h=401",
      "https://us.ecoflow.com/cdn/shop/files/ecoflow-ecoflow-delta-pro-ultra-whole-home-backup-power-ul-9540-certificated-dpu-bundle-delta-pro-ultra-1-x-inverter-1-x-battery-1253485498.png?v=1786091054&width=1240&h=402"
    ]
  },
  {
    id: "flir-one-edge-pro",
    name: "FLIR ONE Edge Pro Wireless Thermal Imaging Camera",
    brand: "FLIR",
    category: "Thermal & Mapping Drones",
    priceUsd: 459,
    directUrl: "https://www.amazon.com/dp/B0BLJD6Q5G",
    imageUrl: "/images/amazon/B0BLJD6Q5G.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0BLJD6Q5G",
    roiScore: 79,
    specs: {
      native_thermal_resolution: "160 × 120",
      super_resolution: "480 × 360",
      connectivity: "Bluetooth"
    },
    images: [
      "/images/amazon/B0BLJD6Q5G.jpg",
      "/images/amazon/B0BLJD6Q5G.jpg",
      "/images/amazon/B0BLJD6Q5G.jpg"
    ]
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
    },
    images: [
      "https://www-cdn.djiits.com/dps/1829a0d110ac80c641f7d22569e71796.svg",
      "https://www-cdn.djiits.com/dps/1829a0d110ac80c641f7d22569e71796.svg&h=401",
      "https://www-cdn.djiits.com/dps/1829a0d110ac80c641f7d22569e71796.svg&h=402"
    ]
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
    },
    images: [
      "https://www-cdn.djiits.com/dps/8d0d498b1e8af614016dd919e753b1f3.svg",
      "https://www-cdn.djiits.com/dps/8d0d498b1e8af614016dd919e753b1f3.svg&h=401",
      "https://www-cdn.djiits.com/dps/8d0d498b1e8af614016dd919e753b1f3.svg&h=402"
    ]
  },
  {
    id: "gaggia-classic-evo-pro",
    name: "Gaggia Classic Evo Pro Espresso Machine",
    brand: "Gaggia",
    category: "Prosumer Espresso",
    priceUsd: 499,
    directUrl: "https://www.amazon.com/dp/B086H1W384",
    imageUrl: "/images/amazon/B086H1W384.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B086H1W384",
    roiScore: 83,
    specs: {
      grouphead: "58 mm commercial style",
      extraction_pressure: "9 bar",
      steam_wand: "Commercial steam wand"
    },
    images: [
      "/images/amazon/B086H1W384.jpg",
      "/images/amazon/B086H1W384.jpg",
      "/images/amazon/B086H1W384.jpg"
    ]
  },
  {
    id: "breville-bambino-plus",
    name: "Breville Bambino Plus Espresso Machine",
    brand: "Breville",
    category: "Prosumer Espresso",
    priceUsd: 499.95,
    directUrl: "https://www.amazon.com/dp/B07JVD78TT",
    imageUrl: "/images/amazon/B07JVD78TT.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B07JVD78TT",
    roiScore: 80,
    specs: {
      heat_up_time: "3 seconds",
      portafilter: "54 mm",
      steam_wand: "Automatic microfoam"
    },
    images: [
      "/images/amazon/B07JVD78TT.jpg",
      "/images/amazon/B07JVD78TT.jpg",
      "/images/amazon/B07JVD78TT.jpg"
    ]
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
    },
    images: [
      "https://home.lamarzoccousa.com/wp-content/uploads/2023/11/Micra-White-Front.png",
      "https://home.lamarzoccousa.com/wp-content/uploads/2023/11/Micra-White-Front.png&h=401",
      "https://home.lamarzoccousa.com/wp-content/uploads/2023/11/Micra-White-Front.png&h=402"
    ]
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
    },
    images: [
      "https://home.lamarzoccousa.com/wp-content/uploads/2024/02/Nera-mat-front-e1713981623547.png",
      "https://home.lamarzoccousa.com/wp-content/uploads/2024/02/Nera-mat-front-e1713981623547.png&h=401",
      "https://home.lamarzoccousa.com/wp-content/uploads/2024/02/Nera-mat-front-e1713981623547.png&h=402"
    ]
  },
  {
    id: "segway-ninebot-max-g2",
    name: "Segway Ninebot MAX G2 Electric KickScooter",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 999.99,
    directUrl: "https://www.amazon.com/dp/B0C65CMKTK",
    imageUrl: "/images/amazon/B0C65CMKTK.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C65CMKTK",
    roiScore: 78,
    specs: {
      peak_motor_power: "1000 W",
      max_range: "43 miles",
      top_speed: "22 mph"
    },
    images: [
      "/images/amazon/B0C65CMKTK.jpg",
      "/images/amazon/B0C65CMKTK.jpg",
      "/images/amazon/B0C65CMKTK.jpg"
    ]
  },
  {
    id: "razor-mx650-dirt-rocket",
    name: "Razor MX650 Dirt Rocket Electric Motocross Bike",
    brand: "Razor",
    category: "Utility EVs",
    priceUsd: 879.99,
    directUrl: "https://www.amazon.com/dp/B01LZ2OCKW",
    imageUrl: "/images/amazon/B01LZ2OCKW.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B01LZ2OCKW",
    roiScore: 69,
    specs: {
      battery: "36 V sealed lead acid",
      top_speed: "17 mph",
      suspension: "Front and rear"
    },
    images: [
      "/images/amazon/B01LZ2OCKW.jpg",
      "/images/amazon/B01LZ2OCKW.jpg",
      "/images/amazon/B01LZ2OCKW.jpg"
    ]
  },
  {
    id: "segway-zt3-pro",
    name: "Segway ZT3 Pro Electric Scooter",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 849.99,
    directUrl: "https://www.amazon.com/dp/B0DDTFMPS6",
    imageUrl: "/images/amazon/B0DDTFMPS6.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0DDTFMPS6",
    roiScore: 77,
    specs: {
      peak_motor_power: "1600 W",
      max_range: "43.5 miles",
      top_speed: "24.9 mph"
    },
    images: [
      "/images/amazon/B0DDTFMPS6.jpg",
      "/images/amazon/B0DDTFMPS6.jpg",
      "/images/amazon/B0DDTFMPS6.jpg"
    ]
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
    },
    images: [
      "https://aventon-images.imgix.net/files/01_Abound-LR_Stealth_Side_1-bike.jpg?v=1737999400&auto=compress,format",
      "https://aventon-images.imgix.net/files/01_Abound-LR_Stealth_Side_1-bike.jpg?v=1737999400&auto=compress,format&h=401",
      "https://aventon-images.imgix.net/files/01_Abound-LR_Stealth_Side_1-bike.jpg?v=1737999400&auto=compress,format&h=402"
    ]
  },
  {
    id: "bambu-lab-x1-carbon",
    name: "Bambu Lab X1-Carbon Combo 3D Printer",
    brand: "Bambu Lab",
    category: "3D Printers",
    priceUsd: 1449,
    directUrl: "https://us.store.bambulab.com/products/x1-carbon-combo",
    imageUrl: "https://store.bblcdn.com/s7/default/b50e0eb867aa41b2aa2f5f1f9ef949b2/X1CC-compressed.jpg",
    affiliateNetwork: "awin",
    merchantId: "46345",
    roiScore: 95,
    specs: {
      build_volume: "256 × 256 × 256 mm",
      max_speed: "500 mm/s",
      ai_features: "Dual auto bed leveling & AI lidar",
      enclosure: "All-metal enclosed with carbon filter"
    },
    images: [
      "https://store.bblcdn.com/s7/default/b50e0eb867aa41b2aa2f5f1f9ef949b2/X1CC-compressed.jpg",
      "https://store.bblcdn.com/s7/default/b50e0eb867aa41b2aa2f5f1f9ef949b2/X1CC-compressed.jpg&h=401",
      "https://store.bblcdn.com/s7/default/b50e0eb867aa41b2aa2f5f1f9ef949b2/X1CC-compressed.jpg&h=402"
    ]
  },
  {
    id: "bambu-lab-a1-combo",
    name: "Bambu Lab A1 3D Printer Combo",
    brand: "Bambu Lab",
    category: "3D Printers",
    priceUsd: 559,
    directUrl: "https://us.store.bambulab.com/products/a1",
    imageUrl: "https://store.bblcdn.com/s7/default/5e12f68972ca413ea3fb9c8a994ef764/A1_Combo-compressed.jpg",
    affiliateNetwork: "awin",
    merchantId: "46345",
    roiScore: 90,
    specs: {
      build_volume: "256 × 256 × 256 mm",
      max_speed: "500 mm/s",
      multi_color: "AMS lite 4-color printing",
      noise_level: "Under 48 dB silent mode"
    },
    images: [
      "https://store.bblcdn.com/s7/default/5e12f68972ca413ea3fb9c8a994ef764/A1_Combo-compressed.jpg",
      "https://store.bblcdn.com/s7/default/5e12f68972ca413ea3fb9c8a994ef764/A1_Combo-compressed.jpg&h=401",
      "https://store.bblcdn.com/s7/default/5e12f68972ca413ea3fb9c8a994ef764/A1_Combo-compressed.jpg&h=402"
    ]
  },
  {
    id: "prusa-mk4s",
    name: "Original Prusa MK4S 3D Printer",
    brand: "Prusa Research",
    category: "3D Printers",
    priceUsd: 799,
    directUrl: "https://www.prusa3d.com/product/original-prusa-mk4s-3d-printer-4/",
    imageUrl: "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 92,
    specs: {
      build_volume: "250 × 210 × 220 mm",
      extruder: "Nextruder with 360-degree high-flow cooling",
      bed_leveling: "Loadcell sensor perfect first layer",
      connectivity: "Prusa Connect & Wi-Fi"
    },
    images: [
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "prusa-xl-5-toolhead",
    name: "Original Prusa XL 5-Toolhead 3D Printer",
    brand: "Prusa Research",
    category: "3D Printers",
    priceUsd: 3499,
    directUrl: "https://www.prusa3d.com/product/original-prusa-xl-5-toolhead-semi-assembled/",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      build_volume: "360 × 360 × 360 mm",
      toolchanger: "5 independent toolheads zero waste",
      kinematics: "CoreXY industrial architecture",
      modular_bed: "16 individually controlled segments"
    },
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "creality-k1-max",
    name: "Creality K1 Max AI High-Speed 3D Printer",
    brand: "Creality",
    category: "3D Printers",
    priceUsd: 899,
    directUrl: "https://www.amazon.com/dp/B0C8V468W5",
    imageUrl: "/images/amazon/B0C8V468W5.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C8V468W5",
    roiScore: 87,
    specs: {
      build_volume: "300 × 300 × 300 mm",
      max_print_speed: "600 mm/s",
      ai_features: "AI lidar and camera detection",
      filtration: "Dual air purifier with HEPA"
    },
    images: [
      "/images/amazon/B0C8V468W5.jpg",
      "/images/amazon/B0C8V468W5.jpg",
      "/images/amazon/B0C8V468W5.jpg"
    ]
  },
  {
    id: "creality-ender-3-v3-plus",
    name: "Creality Ender-3 V3 Plus CoreXZ 3D Printer",
    brand: "Creality",
    category: "3D Printers",
    priceUsd: 479,
    directUrl: "https://www.amazon.com/dp/B0D5CS73R4",
    imageUrl: "/images/amazon/B0D5CS73R4.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D5CS73R4",
    roiScore: 84,
    specs: {
      build_volume: "300 × 300 × 330 mm",
      kinematics: "CoreXZ up to 600 mm/s",
      hotend: "60W ceramic heater 300°C",
      structure: "Die-cast aluminum alloy frame"
    },
    images: [
      "/images/amazon/B0D5CS73R4.jpg",
      "/images/amazon/B0D5CS73R4.jpg",
      "/images/amazon/B0D5CS73R4.jpg"
    ]
  },
  {
    id: "elegoo-saturn-4-ultra",
    name: "ELEGOO Saturn 4 Ultra 12K Resin 3D Printer",
    brand: "ELEGOO",
    category: "3D Printers",
    priceUsd: 429,
    directUrl: "https://www.amazon.com/dp/B0D1FT3B3P",
    imageUrl: "/images/amazon/B0D1FT3B3P.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D1FT3B3P",
    roiScore: 91,
    specs: {
      xy_resolution: "12K mono LCD (11520 × 5120)",
      build_volume: "218.88 × 122.88 × 220 mm",
      technology: "Tilt release technology",
      ai_camera: "Real-time monitoring and failure detection"
    },
    images: [
      "/images/amazon/B0D1FT3B3P.jpg",
      "/images/amazon/B0D1FT3B3P.jpg",
      "/images/amazon/B0D1FT3B3P.jpg"
    ]
  },
  {
    id: "elegoo-neptune-4-max",
    name: "ELEGOO Neptune 4 Max Fast FDM 3D Printer",
    brand: "ELEGOO",
    category: "3D Printers",
    priceUsd: 470,
    directUrl: "https://www.amazon.com/dp/B0CHDG9Q2K",
    imageUrl: "/images/amazon/B0CHDG9Q2K.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CHDG9Q2K",
    roiScore: 86,
    specs: {
      build_volume: "420 × 420 × 480 mm",
      max_speed: "500 mm/s with Klipper",
      hotend: "300°C high-temp dual-gear direct drive",
      cooling: "Segmented cooling auxiliary fans"
    },
    images: [
      "/images/amazon/B0CHDG9Q2K.jpg",
      "/images/amazon/B0CHDG9Q2K.jpg",
      "/images/amazon/B0CHDG9Q2K.jpg"
    ]
  },
  {
    id: "elegoo-mars-5-ultra",
    name: "ELEGOO Mars 5 Ultra 9K Resin 3D Printer",
    brand: "ELEGOO",
    category: "3D Printers",
    priceUsd: 309,
    directUrl: "https://www.amazon.com/dp/B0D7B24YJ8",
    imageUrl: "/images/amazon/B0D7B24YJ8.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D7B24YJ8",
    roiScore: 88,
    specs: {
      screen: "7-inch 9K mono LCD (8520 × 4320)",
      build_volume: "153.36 × 77.76 × 165 mm",
      leveling: "One-click automatic self-check",
      speed: "Up to 150 mm/h with tilt release"
    },
    images: [
      "/images/amazon/B0D7B24YJ8.jpg",
      "/images/amazon/B0D7B24YJ8.jpg",
      "/images/amazon/B0D7B24YJ8.jpg"
    ]
  },
  {
    id: "anycubic-kobra-3-combo",
    name: "Anycubic Kobra 3 Combo Multi-Color 3D Printer",
    brand: "Anycubic",
    category: "3D Printers",
    priceUsd: 549,
    directUrl: "https://www.amazon.com/dp/B0D4V5K7R7",
    imageUrl: "/images/amazon/B0D4V5K7R7.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0D4V5K7R7",
    roiScore: 87,
    specs: {
      build_volume: "250 × 250 × 260 mm",
      multi_color: "Anycubic Color Engine Pro 4-to-8 colors",
      max_speed: "600 mm/s",
      drying: "Integrated active filament drying in ACE Pro"
    },
    images: [
      "/images/amazon/B0D4V5K7R7.jpg",
      "/images/amazon/B0D4V5K7R7.jpg",
      "/images/amazon/B0D4V5K7R7.jpg"
    ]
  },
  {
    id: "anycubic-photon-mono-m5s-pro",
    name: "Anycubic Photon Mono M5s Pro 14K Resin 3D Printer",
    brand: "Anycubic",
    category: "3D Printers",
    priceUsd: 499,
    directUrl: "https://www.amazon.com/dp/B0CP979NZK",
    imageUrl: "/images/amazon/B0CP979NZK.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CP979NZK",
    roiScore: 85,
    specs: {
      screen: "10.1-inch 14K mono LCD (13312 × 5120)",
      build_volume: "223.78 × 126.38 × 200 mm",
      heater: "Air heater & purifier integrated unit",
      leveling: "Leveling-free mechanical sensor"
    },
    images: [
      "/images/amazon/B0CP979NZK.jpg",
      "/images/amazon/B0CP979NZK.jpg",
      "/images/amazon/B0CP979NZK.jpg"
    ]
  },
  {
    id: "formlabs-form-4",
    name: "Formlabs Form 4 SLA 3D Printer",
    brand: "Formlabs",
    category: "3D Printers",
    priceUsd: 4399,
    directUrl: "https://formlabs.com/3d-printers/form-4/",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      technology: "Low Force Display (LFD) print engine",
      build_volume: "200 × 125 × 210 mm",
      print_speed: "Blazing fast 100 mm/h print speeds",
      materials: "Over 35 industry-grade engineering resins"
    },
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "snapmaker-artisan-3-in-1",
    name: "Snapmaker Artisan 3-in-1 3D Printer",
    brand: "Snapmaker",
    category: "3D Printers",
    priceUsd: 2799,
    directUrl: "https://us.snapmaker.com/products/snapmaker-artisan-3-in-1-3d-printer",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "18942",
    roiScore: 88,
    specs: {
      work_area: "400 × 400 × 400 mm",
      modules: "Dual extrusion 3D, 10W laser, 200W CNC",
      linear_rails: "Industrial grade steel linear modules",
      display: "7-inch ultra-wide touchscreen"
    },
    images: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "snapmaker-j1s-idex",
    name: "Snapmaker J1s High-Speed IDEX 3D Printer",
    brand: "Snapmaker",
    category: "3D Printers",
    priceUsd: 1299,
    directUrl: "https://www.amazon.com/dp/B0CKTBG89Y",
    imageUrl: "/images/amazon/B0CKTBG89Y.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CKTBG89Y",
    roiScore: 84,
    specs: {
      build_volume: "300 × 200 × 200 mm",
      idex_modes: "Copy mode, mirror mode, dual material",
      max_speed: "350 mm/s with vibration compensation",
      hotend: "300°C all-metal direct drive"
    },
    images: [
      "/images/amazon/B0CKTBG89Y.jpg",
      "/images/amazon/B0CKTBG89Y.jpg",
      "/images/amazon/B0CKTBG89Y.jpg"
    ]
  },
  {
    id: "qidi-tech-q1-pro",
    name: "QIDI Tech Q1 Pro Enclosed 3D Printer",
    brand: "QIDI Tech",
    category: "3D Printers",
    priceUsd: 469,
    directUrl: "https://www.amazon.com/dp/B0CYQ7W4G1",
    imageUrl: "/images/amazon/B0CYQ7W4G1.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CYQ7W4G1",
    roiScore: 90,
    specs: {
      build_volume: "245 × 245 × 245 mm",
      chamber_heater: "Active chamber heating up to 60°C",
      max_nozzle_temp: "350°C bimetal high flow nozzle",
      materials: "ABS, ASA, PA-CF, PC, PET-CF"
    },
    images: [
      "/images/amazon/B0CYQ7W4G1.jpg",
      "/images/amazon/B0CYQ7W4G1.jpg",
      "/images/amazon/B0CYQ7W4G1.jpg"
    ]
  },
  {
    id: "qidi-tech-x-max-3",
    name: "QIDI Tech X-Max 3 High-Speed 3D Printer",
    brand: "QIDI Tech",
    category: "3D Printers",
    priceUsd: 899,
    directUrl: "https://www.amazon.com/dp/B0C39YTH3B",
    imageUrl: "/images/amazon/B0C39YTH3B.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C39YTH3B",
    roiScore: 86,
    specs: {
      build_volume: "325 × 325 × 315 mm",
      chamber_heater: "Active 65°C heated build chamber",
      speed: "600 mm/s with 20000 mm/s² acceleration",
      frame: "All-metal enclosed with carbon rod X-axis"
    },
    images: [
      "/images/amazon/B0C39YTH3B.jpg",
      "/images/amazon/B0C39YTH3B.jpg",
      "/images/amazon/B0C39YTH3B.jpg"
    ]
  },
  {
    id: "flashforge-adventurer-5m-pro",
    name: "Flashforge Adventurer 5M Pro 3D Printer",
    brand: "Flashforge",
    category: "3D Printers",
    priceUsd: 499,
    directUrl: "https://www.amazon.com/dp/B0CJ545K3M",
    imageUrl: "/images/amazon/B0CJ545K3M.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CJ545K3M",
    roiScore: 85,
    specs: {
      build_volume: "220 × 220 × 220 mm",
      max_speed: "600 mm/s CoreXY structure",
      quick_swap: "3-second toolless quick-release nozzle",
      air_filter: "Dual filtration system HEPA13 & carbon"
    },
    images: [
      "/images/amazon/B0CJ545K3M.jpg",
      "/images/amazon/B0CJ545K3M.jpg",
      "/images/amazon/B0CJ545K3M.jpg"
    ]
  },
  {
    id: "xtool-f1-ultra",
    name: "xTool F1 Ultra 20W Fiber & 20W Diode Dual Laser",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 3999,
    directUrl: "https://www.xtool.com/products/xtool-f1-ultra-laser-engraver",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "175642",
    roiScore: 93,
    specs: {
      laser_sources: "20W fiber (1064nm) & 20W diode (455nm)",
      working_speed: "10000 mm/s galvo system",
      working_area: "220 × 220 mm with camera preview",
      materials: "All metals, plastics, wood, leather, stone"
    },
    images: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "xtool-d1-pro-20w",
    name: "xTool D1 Pro 20W Higher Accuracy Laser Engraver",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 899,
    directUrl: "https://www.amazon.com/dp/B0B68X19B5",
    imageUrl: "/images/amazon/B0B68X19B5.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B68X19B5",
    roiScore: 86,
    specs: {
      optical_power: "20W quad-diode laser beam",
      working_area: "430 × 400 mm",
      engraving_speed: "400 mm/s",
      accuracy: "0.08 × 0.06 mm ultra-fine laser spot"
    },
    images: [
      "/images/amazon/B0B68X19B5.jpg",
      "/images/amazon/B0B68X19B5.jpg",
      "/images/amazon/B0B68X19B5.jpg"
    ]
  },
  {
    id: "xtool-m1-ultra",
    name: "xTool M1 Ultra 4-in-1 Craft Machine",
    brand: "xTool",
    category: "CNC & Laser Cutters",
    priceUsd: 1499,
    directUrl: "https://www.xtool.com/products/xtool-m1-ultra-craft-machine",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "175642",
    roiScore: 91,
    specs: {
      multitask_heads: "Laser, blade cutting, inkjet color print, pen",
      laser_power: "10W or 20W diode laser module",
      safety_class: "Class 1 FDA certified enclosure",
      materials: "Wood, acrylic, vinyl, fabric, leather, cardboard"
    },
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "glowforge-pro",
    name: "Glowforge Pro 45W CO2 Laser Cutter",
    brand: "Glowforge",
    category: "CNC & Laser Cutters",
    priceUsd: 6995,
    directUrl: "https://glowforge.com/products/glowforge-pro",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 84,
    specs: {
      laser_tube: "45W custom CO2 laser tube",
      passthrough: "Pro passthrough slot for infinite length",
      cooling: "Solid-state thermoelectric Peltier cooling",
      optics: "Dual high-speed autofocus optical cameras"
    },
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "glowforge-aura",
    name: "Glowforge Aura Craft Laser Machine",
    brand: "Glowforge",
    category: "CNC & Laser Cutters",
    priceUsd: 999,
    directUrl: "https://www.amazon.com/dp/B0CC9L9W7T",
    imageUrl: "/images/amazon/B0CC9L9W7T.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CC9L9W7T",
    roiScore: 80,
    specs: {
      laser_type: "6W diode craft laser",
      cutting_area: "12 × 12 in work surface",
      camera: "Aura Vision live work area alignment",
      safety: "Fully enclosed Class 1 safety rating"
    },
    images: [
      "/images/amazon/B0CC9L9W7T.jpg",
      "/images/amazon/B0CC9L9W7T.jpg",
      "/images/amazon/B0CC9L9W7T.jpg"
    ]
  },
  {
    id: "omtech-polar-50w",
    name: "OMTech Polar 50W Desktop CO2 Laser Cutter",
    brand: "OMTech",
    category: "CNC & Laser Cutters",
    priceUsd: 2499,
    directUrl: "https://omtechlaser.com/products/polar-50w-desktop-laser-cutter-engraver",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      laser_tube: "50W CO2 glass laser tube",
      working_area: "510 × 300 mm bed size",
      dual_cameras: "5MP panoramic dual overhead cameras",
      cooling: "Built-in internal water chiller & air assist"
    },
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "omtech-k40-40w",
    name: "OMTech 40W CO2 Laser Engraver K40+",
    brand: "OMTech",
    category: "CNC & Laser Cutters",
    priceUsd: 529,
    directUrl: "https://www.amazon.com/dp/B08V5CY522",
    imageUrl: "/images/amazon/B08V5CY522.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08V5CY522",
    roiScore: 88,
    specs: {
      laser_power: "40W CO2 gas laser tube",
      engraving_area: "300 × 200 mm workbed",
      control_board: "LightBurn and LaserGRBL compatible",
      pointer: "Red dot guidance pointer"
    },
    images: [
      "/images/amazon/B08V5CY522.jpg",
      "/images/amazon/B08V5CY522.jpg",
      "/images/amazon/B08V5CY522.jpg"
    ]
  },
  {
    id: "omtech-80w-co2",
    name: "OMTech 80W CO2 Laser Engraver with Autofocus",
    brand: "OMTech",
    category: "CNC & Laser Cutters",
    priceUsd: 3699,
    directUrl: "https://www.amazon.com/dp/B07R8N6CGX",
    imageUrl: "/images/amazon/B07R8N6CGX.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B07R8N6CGX",
    roiScore: 87,
    specs: {
      laser_power: "80W high-efficiency CO2 tube",
      work_bed: "700 × 500 mm motorized Z-table",
      autofocus: "Automatic distance touch probe",
      controller: "Ruida digital DSP controller"
    },
    images: [
      "/images/amazon/B07R8N6CGX.jpg",
      "/images/amazon/B07R8N6CGX.jpg",
      "/images/amazon/B07R8N6CGX.jpg"
    ]
  },
  {
    id: "shapeoko-5-pro",
    name: "Carbide 3D Shapeoko 5 Pro 4x4 CNC Router",
    brand: "Carbide 3D",
    category: "CNC & Laser Cutters",
    priceUsd: 3750,
    directUrl: "https://carbide3d.com/shapeoko5pro/",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 92,
    specs: {
      cutting_area: "1220 × 1220 × 150 mm (4 × 4 ft)",
      drive_system: "Ballscrews on all axes & linear rails",
      hybrid_table: "T-slot hold-down table with MDF slats",
      controller: "Carbide Motion GRBL v5 industrial board"
    },
    images: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "shapeoko-4-pro",
    name: "Carbide 3D Shapeoko Pro XXL CNC Router",
    brand: "Carbide 3D",
    category: "CNC & Laser Cutters",
    priceUsd: 2800,
    directUrl: "https://carbide3d.com/shapeoko-pro/",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 90,
    specs: {
      cutting_area: "838 × 838 × 101 mm (33 × 33 in)",
      rails: "15mm linear rails on X, Y, and Z axes",
      spindle_support: "Standard trim router or VFD spindle",
      dust_collection: "Sweepy 2.0 precision dust boot"
    },
    images: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "onefinity-foreman-elite",
    name: "Onefinity Elite Foreman CNC Machine",
    brand: "Onefinity",
    category: "CNC & Laser Cutters",
    priceUsd: 2980,
    directUrl: "https://www.onefinitycnc.com/product-page/elite-series-foreman",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 91,
    specs: {
      cutting_area: "1220 × 1220 mm (48 × 48 in)",
      axes_tubes: "35mm hollow steel shafts & 16mm ballscrews",
      closed_loop: "MASSO G3 touch CNC controller with closed-loop steppers",
      materials: "Hardwoods, plastics, brass, aluminum"
    },
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "bantam-tools-desktop-cnc",
    name: "Bantam Tools Desktop CNC Milling Machine",
    brand: "Bantam Tools",
    category: "CNC & Laser Cutters",
    priceUsd: 6499,
    directUrl: "https://www.bantamtools.com/desktop-cnc-milling-machine",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 86,
    specs: {
      spindle_speed: "10000 - 28000 RPM precision ER-11",
      working_volume: "178 × 229 × 89 mm",
      rapid_rates: "250 in/min rapid positioning",
      aluminum_ready: "Optimized for prototyping aluminum 6061-T6"
    },
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "makera-carvera",
    name: "Makera Carvera Desktop Auto-Tool Changing CNC",
    brand: "Makera",
    category: "CNC & Laser Cutters",
    priceUsd: 4999,
    directUrl: "https://www.makera.com/products/carvera",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 92,
    specs: {
      tool_changer: "6-tool automatic tool changer (ATC)",
      laser_module: "Integrated 2.5W diode laser head",
      auto_leveling: "Built-in auto-probing & auto-dust collection",
      enclosure: "Fully enclosed metal housing with window"
    },
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "sculpfun-s30-ultra-33w",
    name: "SCULPFUN S30 Ultra 33W Laser Engraver",
    brand: "SCULPFUN",
    category: "CNC & Laser Cutters",
    priceUsd: 899,
    directUrl: "https://www.amazon.com/dp/B0C3CYW98K",
    imageUrl: "/images/amazon/B0C3CYW98K.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C3CYW98K",
    roiScore: 84,
    specs: {
      optical_power: "33W quad-diode laser beam",
      engraving_area: "600 × 600 mm oversized work area",
      air_assist: "Auto air assist pump with 32-bit motherboard",
      replaceable_lens: "Innovative replaceable protective optical lens"
    },
    images: [
      "/images/amazon/B0C3CYW98K.jpg",
      "/images/amazon/B0C3CYW98K.jpg",
      "/images/amazon/B0C3CYW98K.jpg"
    ]
  },
  {
    id: "atomstack-a40-pro",
    name: "Atomstack A40 Pro 48W Laser Engraver",
    brand: "Atomstack",
    category: "CNC & Laser Cutters",
    priceUsd: 1199,
    directUrl: "https://www.amazon.com/dp/B0CG5G7D7H",
    imageUrl: "/images/amazon/B0CG5G7D7H.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CG5G7D7H",
    roiScore: 85,
    specs: {
      optical_power: "48W / 24W switchable power output",
      speed: "30000 mm/min high-speed engraving",
      linear_rail: "Tank-track cable chain and linear guide",
      cutting_capacity: "Cuts 20mm paulownia wood in one pass"
    },
    images: [
      "/images/amazon/B0CG5G7D7H.jpg",
      "/images/amazon/B0CG5G7D7H.jpg",
      "/images/amazon/B0CG5G7D7H.jpg"
    ]
  },
  {
    id: "creality-falcon2-40w",
    name: "Creality Falcon2 40W Optical Output Laser Cutter",
    brand: "Creality",
    category: "CNC & Laser Cutters",
    priceUsd: 1099,
    directUrl: "https://www.amazon.com/dp/B0CFQJ7K2G",
    imageUrl: "/images/amazon/B0CFQJ7K2G.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CFQJ7K2G",
    roiScore: 86,
    specs: {
      laser_power: "40W optical output (8 × 5.5W diodes)",
      work_area: "400 × 415 mm working bed",
      monitoring: "Triple monitoring system: flame, lens, airflow",
      pass_cutting: "Cuts 20mm wood and 0.15mm stainless steel"
    },
    images: [
      "/images/amazon/B0CFQJ7K2G.jpg",
      "/images/amazon/B0CFQJ7K2G.jpg",
      "/images/amazon/B0CFQJ7K2G.jpg"
    ]
  },
  {
    id: "foxalien-masuter-pro",
    name: "FoxAlien Masuter Pro CNC Router Machine",
    brand: "FoxAlien",
    category: "CNC & Laser Cutters",
    priceUsd: 599,
    directUrl: "https://www.amazon.com/dp/B09V7N86L4",
    imageUrl: "/images/amazon/B09V7N86L4.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B09V7N86L4",
    roiScore: 83,
    specs: {
      working_area: "400 × 400 × 60 mm",
      structure: "All-aluminum frame with linear guide rails",
      spindle: "300W high-speed spindle included",
      compatibility: "Compatible with GRBL software and offline controller"
    },
    images: [
      "/images/amazon/B09V7N86L4.jpg",
      "/images/amazon/B09V7N86L4.jpg",
      "/images/amazon/B09V7N86L4.jpg"
    ]
  },
  {
    id: "ecoflow-delta-pro-3",
    name: "EcoFlow DELTA Pro 3 Portable Power Station 4000W",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 3699,
    directUrl: "https://us.ecoflow.com/products/delta-pro-3-portable-power-station",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "awin",
    merchantId: "59181",
    roiScore: 94,
    specs: {
      capacity: "4096 Wh LiFePO4 battery",
      ac_output: "4000W continuous (120V/240V dual voltage)",
      solar_input: "2600W dual solar charging port",
      expandability: "Expandable up to 48 kWh home system"
    },
    images: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "ecoflow-delta-2-max",
    name: "EcoFlow DELTA 2 Max 2048Wh Solar Generator",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 1399,
    directUrl: "https://www.amazon.com/dp/B0C36RBNTX",
    imageUrl: "/images/amazon/B0C36RBNTX.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C36RBNTX",
    roiScore: 91,
    specs: {
      capacity: "2048 Wh LiFePO4 (expandable to 6144 Wh)",
      ac_output: "2400W continuous (3400W X-Boost)",
      solar_input: "1000W dual MPPT solar input",
      cycle_life: "3000 cycles to 80%+ capacity"
    },
    images: [
      "/images/amazon/B0C36RBNTX.jpg",
      "/images/amazon/B0C36RBNTX.jpg",
      "/images/amazon/B0C36RBNTX.jpg"
    ]
  },
  {
    id: "ecoflow-river-2-pro",
    name: "EcoFlow River 2 Pro 768Wh Power Station",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 599,
    directUrl: "https://www.amazon.com/dp/B0B9XL7T58",
    imageUrl: "/images/amazon/B0B9XL7T58.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B9XL7T58",
    roiScore: 88,
    specs: {
      capacity: "768 Wh LFP battery",
      ac_output: "800W pure sine wave (1600W X-Boost)",
      charge_speed: "0-100% in 70 minutes via AC",
      weight: "17.2 lbs ultra-portable form factor"
    },
    images: [
      "/images/amazon/B0B9XL7T58.jpg",
      "/images/amazon/B0B9XL7T58.jpg",
      "/images/amazon/B0B9XL7T58.jpg"
    ]
  },
  {
    id: "bluetti-ac200l",
    name: "BLUETTI AC200L Portable Power Station 2048Wh",
    brand: "BLUETTI",
    category: "Off-Grid Solar & Power",
    priceUsd: 1399,
    directUrl: "https://www.amazon.com/dp/B0CNGZ2V9M",
    imageUrl: "/images/amazon/B0CNGZ2V9M.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CNGZ2V9M",
    roiScore: 92,
    specs: {
      capacity: "2048 Wh LiFePO4 battery pack",
      ac_output: "2400W continuous (3600W Power Lifting)",
      solar_charging: "1200W max solar input",
      ups_speed: "20ms uninterruptible power supply"
    },
    images: [
      "/images/amazon/B0CNGZ2V9M.jpg",
      "/images/amazon/B0CNGZ2V9M.jpg",
      "/images/amazon/B0CNGZ2V9M.jpg"
    ]
  },
  {
    id: "bluetti-ac300-b300",
    name: "BLUETTI AC300 + B300 3072Wh Home Battery Backup",
    brand: "BLUETTI",
    category: "Off-Grid Solar & Power",
    priceUsd: 2299,
    directUrl: "https://www.amazon.com/dp/B09M8MVV2M",
    imageUrl: "/images/amazon/B09M8MVV2M.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B09M8MVV2M",
    roiScore: 90,
    specs: {
      system_type: "100% modular inverter and battery system",
      inverter_output: "3000W continuous pure sine wave",
      battery_unit: "B300 3072 Wh LiFePO4 module",
      solar_capacity: "2400W dual MPPT solar controllers"
    },
    images: [
      "/images/amazon/B09M8MVV2M.jpg",
      "/images/amazon/B09M8MVV2M.jpg",
      "/images/amazon/B09M8MVV2M.jpg"
    ]
  },
  {
    id: "bluetti-ac180",
    name: "BLUETTI AC180 Portable Power Station 1152Wh",
    brand: "BLUETTI",
    category: "Off-Grid Solar & Power",
    priceUsd: 799,
    directUrl: "https://www.amazon.com/dp/B0C399T51F",
    imageUrl: "/images/amazon/B0C399T51F.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C399T51F",
    roiScore: 89,
    specs: {
      capacity: "1152 Wh LiFePO4 battery",
      ac_output: "1800W continuous (2700W Power Lifting)",
      turbo_charge: "0-80% in 45 minutes with 1440W AC",
      solar_intake: "500W MPPT solar input"
    },
    images: [
      "/images/amazon/B0C399T51F.jpg",
      "/images/amazon/B0C399T51F.jpg",
      "/images/amazon/B0C399T51F.jpg"
    ]
  },
  {
    id: "bluetti-ep500-pro",
    name: "BLUETTI EP500Pro 5100Wh Mobile Power Station",
    brand: "BLUETTI",
    category: "Off-Grid Solar & Power",
    priceUsd: 3999,
    directUrl: "https://www.bluettipower.com/products/ep500pro-solar-power-station",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 88,
    specs: {
      capacity: "5100 Wh LiFePO4 battery pack",
      inverter: "3000W pure sine wave inverter",
      solar_input: "2400W dual MPPT solar input",
      mobility: "Heavy-duty built-in transport wheels"
    },
    images: [
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "jackery-explorer-2000-plus",
    name: "Jackery Explorer 2000 Plus Expandable Power Station",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 1999,
    directUrl: "https://www.amazon.com/dp/B0C4DF8W1Y",
    imageUrl: "/images/amazon/B0C4DF8W1Y.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C4DF8W1Y",
    roiScore: 89,
    specs: {
      capacity: "2042.8 Wh LiFePO4 (expandable to 24 kWh)",
      ac_output: "3000W continuous (6000W surge)",
      solar_charge: "2-hour ultra-fast solar charging (1200W)",
      cycle_life: "4000 cycles to 70%+ capacity"
    },
    images: [
      "/images/amazon/B0C4DF8W1Y.jpg",
      "/images/amazon/B0C4DF8W1Y.jpg",
      "/images/amazon/B0C4DF8W1Y.jpg"
    ]
  },
  {
    id: "jackery-explorer-3000-pro",
    name: "Jackery Explorer 3000 Pro 3024Wh Power Station",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 2499,
    directUrl: "https://www.amazon.com/dp/B0BY2H12C7",
    imageUrl: "/images/amazon/B0BY2H12C7.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0BY2H12C7",
    roiScore: 86,
    specs: {
      capacity: "3024 Wh lithium-ion battery",
      ac_output: "3000W pure sine wave (6000W peak)",
      wall_charge: "Fast AC charging in 2.4 hours",
      quiet_mode: "Whisper quiet operation under 30 dB"
    },
    images: [
      "/images/amazon/B0BY2H12C7.jpg",
      "/images/amazon/B0BY2H12C7.jpg",
      "/images/amazon/B0BY2H12C7.jpg"
    ]
  },
  {
    id: "anker-solix-f3800",
    name: "Anker SOLIX F3800 3.84kWh Home Power Station",
    brand: "Anker",
    category: "Off-Grid Solar & Power",
    priceUsd: 3999,
    directUrl: "https://www.amazon.com/dp/B0CLGB2R5M",
    imageUrl: "/images/amazon/B0CLGB2R5M.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CLGB2R5M",
    roiScore: 94,
    specs: {
      battery: "3840 Wh LFP (expandable to 26.9 kWh)",
      ac_power: "6000W 120V/240V split-phase output",
      ev_charging: "Direct EV charging with NEMA 14-50 port",
      solar_in: "2400W dual MPPT solar input"
    },
    images: [
      "/images/amazon/B0CLGB2R5M.jpg",
      "/images/amazon/B0CLGB2R5M.jpg",
      "/images/amazon/B0CLGB2R5M.jpg"
    ]
  },
  {
    id: "anker-solix-f2000",
    name: "Anker SOLIX F2000 (PowerHouse 767) 2048Wh Station",
    brand: "Anker",
    category: "Off-Grid Solar & Power",
    priceUsd: 1699,
    directUrl: "https://www.amazon.com/dp/B0B9XKVDF9",
    imageUrl: "/images/amazon/B0B9XKVDF9.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B9XKVDF9",
    roiScore: 90,
    specs: {
      capacity: "2048 Wh InfiniPower LiFePO4",
      ac_output: "2400W pure sine wave (TT-30 RV port)",
      solar_charging: "1000W max solar input",
      durability: "Unibody drop-proof structural frame"
    },
    images: [
      "/images/amazon/B0B9XKVDF9.jpg",
      "/images/amazon/B0B9XKVDF9.jpg",
      "/images/amazon/B0B9XKVDF9.jpg"
    ]
  },
  {
    id: "anker-solix-c1000",
    name: "Anker SOLIX C1000 1056Wh Portable Power Station",
    brand: "Anker",
    category: "Off-Grid Solar & Power",
    priceUsd: 799,
    directUrl: "https://www.amazon.com/dp/B0C4DFQW1N",
    imageUrl: "/images/amazon/B0C4DFQW1N.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0C4DFQW1N",
    roiScore: 92,
    specs: {
      capacity: "1056 Wh LFP (expandable to 2112 Wh)",
      ac_output: "1800W continuous (2400W SurgePad)",
      recharge_time: "100% full charge in 58 minutes",
      ups_switch: "Sub-20ms ultra-fast UPS switchover"
    },
    images: [
      "/images/amazon/B0C4DFQW1N.jpg",
      "/images/amazon/B0C4DFQW1N.jpg",
      "/images/amazon/B0C4DFQW1N.jpg"
    ]
  },
  {
    id: "goal-zero-yeti-pro-4000",
    name: "Goal Zero Yeti PRO 4000 Solar Generator",
    brand: "Goal Zero",
    category: "Off-Grid Solar & Power",
    priceUsd: 3999,
    directUrl: "https://www.goalzero.com/products/yeti-pro-4000-power-station",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 87,
    specs: {
      capacity: "3993 Wh LiFePO4 battery pack",
      ac_power: "3600W continuous (7200W surge) 120V/240V",
      solar_in: "3000W dual high-voltage solar MPPTs",
      connectivity: "Goal Zero Yeti App 3.0 control"
    },
    images: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "goal-zero-yeti-1500x",
    name: "Goal Zero Yeti 1500X Lithium Power Station",
    brand: "Goal Zero",
    category: "Off-Grid Solar & Power",
    priceUsd: 1499,
    directUrl: "https://www.amazon.com/dp/B08DFW9Z38",
    imageUrl: "/images/amazon/B08DFW9Z38.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08DFW9Z38",
    roiScore: 83,
    specs: {
      capacity: "1516 Wh NMC lithium-ion",
      inverter: "2000W pure sine wave (3500W surge)",
      ports: "60W USB-C PD, high-power 12V 30A Anderson",
      solar_mppt: "600W integrated MPPT charge module"
    },
    images: [
      "/images/amazon/B08DFW9Z38.jpg",
      "/images/amazon/B08DFW9Z38.jpg",
      "/images/amazon/B08DFW9Z38.jpg"
    ]
  },
  {
    id: "renogy-lycan-5000",
    name: "Renogy LYCAN 5000 Power Box Solar Generator",
    brand: "Renogy",
    category: "Off-Grid Solar & Power",
    priceUsd: 4299,
    directUrl: "https://www.renogy.com/lycan-5000-power-box/",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 88,
    specs: {
      capacity: "4608 Wh LFP (expandable up to 19.2 kWh)",
      ac_power: "3500W continuous pure sine wave output",
      solar_charging: "4400W fast solar charging capacity",
      cabinet: "Rugged IP55 outdoor rated steel cabinet"
    },
    images: [
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "renogy-3000w-inverter-charger",
    name: "Renogy 3000W 12V Pure Sine Wave Inverter Charger",
    brand: "Renogy",
    category: "Off-Grid Solar & Power",
    priceUsd: 649,
    directUrl: "https://www.amazon.com/dp/B07N1R2D72",
    imageUrl: "/images/amazon/B07N1R2D72.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B07N1R2D72",
    roiScore: 89,
    specs: {
      inverter_output: "3000W continuous / 9000W peak",
      charger: "75A 4-stage smart battery charger",
      transfer_switch: "Automatic 10ms transfer switch",
      efficiency: "Over 90% power conversion efficiency"
    },
    images: [
      "/images/amazon/B07N1R2D72.jpg",
      "/images/amazon/B07N1R2D72.jpg",
      "/images/amazon/B07N1R2D72.jpg"
    ]
  },
  {
    id: "pecron-e3600lfp",
    name: "Pecron E3600LFP 3072Wh 3600W Expandable Power Station",
    brand: "Pecron",
    category: "Off-Grid Solar & Power",
    priceUsd: 1699,
    directUrl: "https://www.amazon.com/dp/B0CJ517N4R",
    imageUrl: "/images/amazon/B0CJ517N4R.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CJ517N4R",
    roiScore: 87,
    specs: {
      capacity: "3072 Wh LiFePO4 battery pack",
      ac_output: "3600W pure sine wave (7000W surge)",
      solar_input: "2000W max solar input dual MPPT",
      expansion: "Supports up to 2 extra battery packs (9.2 kWh)"
    },
    images: [
      "/images/amazon/B0CJ517N4R.jpg",
      "/images/amazon/B0CJ517N4R.jpg",
      "/images/amazon/B0CJ517N4R.jpg"
    ]
  },
  {
    id: "dji-matrice-350-rtk",
    name: "DJI Matrice 350 RTK Flagship Enterprise Drone",
    brand: "DJI Enterprise",
    category: "Thermal & Mapping Drones",
    priceUsd: 11500,
    directUrl: "https://enterprise.dji.com/matrice-350-rtk",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "248631",
    roiScore: 95,
    specs: {
      flight_time: "55 minutes max flight time",
      payload_capacity: "2.7 kg multi-payload support",
      ingress_protection: "IP55 all-weather rating",
      transmission: "O3 Enterprise 20 km range"
    },
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "dji-matrice-30t",
    name: "DJI Matrice 30T Thermal All-Weather Drone",
    brand: "DJI Enterprise",
    category: "Thermal & Mapping Drones",
    priceUsd: 13999,
    directUrl: "https://enterprise.dji.com/matrice-30",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "248631",
    roiScore: 94,
    specs: {
      thermal_camera: "640 × 512 radiometric sensor",
      zoom_camera: "48MP 1/2-inch CMOS 16× optical zoom",
      laser_rangefinder: "1200 m measurement range",
      weather_rating: "IP55 operating from -20°C to 50°C"
    },
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "dji-mavic-3-thermal",
    name: "DJI Mavic 3 Thermal (M3T) Enterprise Drone",
    brand: "DJI Enterprise",
    category: "Thermal & Mapping Drones",
    priceUsd: 5498,
    directUrl: "https://enterprise.dji.com/mavic-3-enterprise",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "248631",
    roiScore: 96,
    specs: {
      thermal_resolution: "640 × 512 @ 30fps thermal camera",
      visual_cameras: "48MP wide camera & 12MP 56× hybrid zoom",
      flight_duration: "45 minutes inspection time",
      rtk_accuracy: "Centimeter-level positioning with RTK module"
    },
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "dji-inspire-3",
    name: "DJI Inspire 3 8K Full-Frame Cinema Drone",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 16499,
    directUrl: "https://www.dji.com/inspire-3",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 88,
    specs: {
      camera: "Zenmuse X9-8K Air full-frame gimbal camera",
      video_specs: "8K/75fps ProRes RAW & 8K/25fps CinemaDNG",
      positioning: "Centimeter-level RTK waypoint navigation",
      max_speed: "94 km/h high-speed cinema tracking"
    },
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "dji-air-3s-fly-more",
    name: "DJI Air 3S Fly More Combo with RC 2",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1599,
    directUrl: "https://www.amazon.com/dp/B0DGD9X4KG",
    imageUrl: "/images/amazon/B0DGD9X4KG.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0DGD9X4KG",
    roiScore: 93,
    specs: {
      dual_cameras: "1-inch CMOS primary & 1/1.3-inch medium tele",
      obstacle_sensing: "Nightscape omnidirectional obstacle sensing with LiDAR",
      flight_time: "45 minutes maximum flight time",
      video: "4K/60fps HDR and 4K/120fps video"
    },
    images: [
      "/images/amazon/B0DGD9X4KG.jpg",
      "/images/amazon/B0DGD9X4KG.jpg",
      "/images/amazon/B0DGD9X4KG.jpg"
    ]
  },
  {
    id: "dji-mini-4-pro-rc2",
    name: "DJI Mini 4 Pro Fly More Combo Plus with RC 2",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1159,
    directUrl: "https://www.amazon.com/dp/B0CGLG2613",
    imageUrl: "/images/amazon/B0CGLG2613.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CGLG2613",
    roiScore: 91,
    specs: {
      weight_class: "Sub-249g ultra-lightweight design",
      obstacle_sensing: "Omnidirectional active obstacle sensing",
      camera: "4K/60fps HDR true vertical shooting",
      transmission: "DJI O4 20 km FHD video transmission"
    },
    images: [
      "/images/amazon/B0CGLG2613.jpg",
      "/images/amazon/B0CGLG2613.jpg",
      "/images/amazon/B0CGLG2613.jpg"
    ]
  },
  {
    id: "dji-avata-2-fly-more",
    name: "DJI Avata 2 Fly More Combo 3-Battery FPV Drone",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1199,
    directUrl: "https://www.amazon.com/dp/B0CW17P63L",
    imageUrl: "/images/amazon/B0CW17P63L.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CW17P63L",
    roiScore: 89,
    specs: {
      sensor: "1/1.3-inch CMOS ultra-wide 155° FOV camera",
      video: "4K/60fps HDR with 10-bit D-Log M color",
      goggles: "DJI Goggles 3 with real-view PiP",
      safety: "Integrated propeller guard & turtle mode"
    },
    images: [
      "/images/amazon/B0CW17P63L.jpg",
      "/images/amazon/B0CW17P63L.jpg",
      "/images/amazon/B0CW17P63L.jpg"
    ]
  },
  {
    id: "autel-evo-max-4t",
    name: "Autel Robotics EVO Max 4T Autonomous Enterprise Drone",
    brand: "Autel Robotics",
    category: "Thermal & Mapping Drones",
    priceUsd: 8999,
    directUrl: "https://shop.autelrobotics.com/products/evo-max-4t",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 91,
    specs: {
      sensors: "640 × 512 thermal, 50MP wide, 48MP zoom, laser rangefinder",
      navigation: "A-Mesh 1.0 autonomous network & anti-jamming",
      flight_time: "42 minutes non-stop mission duration",
      weather: "IP43 rugged weather resistance"
    },
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "autel-evo-ii-dual-640t-v3",
    name: "Autel EVO II Dual 640T V3 Enterprise Thermal Drone",
    brand: "Autel Robotics",
    category: "Thermal & Mapping Drones",
    priceUsd: 6499,
    directUrl: "https://www.amazon.com/dp/B0BQ5647M6",
    imageUrl: "/images/amazon/B0BQ5647M6.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0BQ5647M6",
    roiScore: 90,
    specs: {
      thermal_core: "640 × 512 @ 30Hz radiometric core",
      visual_sensor: "50MP 1/1.28-inch RYYB CMOS sensor",
      transmission: "SkyLink 2.0 15 km video transmission",
      smart_controller: "7.9-inch 2000-nit high-brightness screen"
    },
    images: [
      "/images/amazon/B0BQ5647M6.jpg",
      "/images/amazon/B0BQ5647M6.jpg",
      "/images/amazon/B0BQ5647M6.jpg"
    ]
  },
  {
    id: "autel-evo-ii-pro-v3",
    name: "Autel EVO II Pro V3 6K Rugged Drone",
    brand: "Autel Robotics",
    category: "Thermal & Mapping Drones",
    priceUsd: 2099,
    directUrl: "https://www.amazon.com/dp/B0BQ5658N7",
    imageUrl: "/images/amazon/B0BQ5658N7.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0BQ5658N7",
    roiScore: 87,
    specs: {
      camera: "1-inch 20MP Sony CMOS sensor 6K video",
      aperture: "Adjustable aperture f/2.8 to f/11",
      obstacle_avoidance: "360-degree omnidirectional sensing",
      flight_time: "40 minutes maximum flight time"
    },
    images: [
      "/images/amazon/B0BQ5658N7.jpg",
      "/images/amazon/B0BQ5658N7.jpg",
      "/images/amazon/B0BQ5658N7.jpg"
    ]
  },
  {
    id: "skydio-x10-thermal",
    name: "Skydio X10 Autonomous Thermal Enterprise Drone",
    brand: "Skydio",
    category: "Thermal & Mapping Drones",
    priceUsd: 18500,
    directUrl: "https://www.skydio.com/x10",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 92,
    specs: {
      ai_autonomy: "NVIDIA Jetson Orin AI processing engine",
      thermal_sensor: "FLIR Boson+ 640 × 512 radiometric thermal",
      zoom: "64MP telephoto camera with 1/1.7-inch sensor",
      night_flight: "Zero-light autonomy with active infrared illumination"
    },
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "skydio-2-plus-pro",
    name: "Skydio 2+ Pro Kit Autonomous Drone",
    brand: "Skydio",
    category: "Thermal & Mapping Drones",
    priceUsd: 2199,
    directUrl: "https://www.skydio.com/skydio-2-plus-enterprise",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 85,
    specs: {
      tracking: "360-degree autonomous tracking & obstacle avoidance",
      camera: "4K/60fps HDR video with 12MP photos",
      flight_engine: "6 navigational 4K visual sensors",
      range: "6 km range with Skydio Enterprise Controller"
    },
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "parrot-anafi-usa-gov",
    name: "Parrot ANAFI USA Enterprise Thermal Drone",
    brand: "Parrot",
    category: "Thermal & Mapping Drones",
    priceUsd: 7500,
    directUrl: "https://www.parrot.com/en/drones/anafi-usa",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      zoom: "32× optical and digital zoom capability",
      thermal_imager: "FLIR Boson 320 × 256 long-wave infrared",
      security: "WPA2 encryption & zero data sharing without consent",
      deployment: "Hand launch and recovery in 55 seconds"
    },
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "flir-e8-pro",
    name: "FLIR E8 Pro Infrared Camera with MSX 320x240",
    brand: "FLIR",
    category: "Thermal & Mapping Drones",
    priceUsd: 2999,
    directUrl: "https://www.amazon.com/dp/B0CL5N53M8",
    imageUrl: "/images/amazon/B0CL5N53M8.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CL5N53M8",
    roiScore: 88,
    specs: {
      thermal_resolution: "320 × 240 (76800 pixels)",
      msx_technology: "Multi-Spectral Dynamic Imaging overlay",
      touchscreen: "3.5-inch 640 × 480 touchscreen with Wi-Fi",
      temp_range: "-20°C to 550°C measurement range"
    },
    images: [
      "/images/amazon/B0CL5N53M8.jpg",
      "/images/amazon/B0CL5N53M8.jpg",
      "/images/amazon/B0CL5N53M8.jpg"
    ]
  },
  {
    id: "flir-e96-advanced-thermal",
    name: "FLIR E96 Advanced Thermal Imaging Camera 640x480",
    brand: "FLIR",
    category: "Thermal & Mapping Drones",
    priceUsd: 12999,
    directUrl: "https://www.amazon.com/dp/B08MB7VXZ9",
    imageUrl: "/images/amazon/B08MB7VXZ9.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08MB7VXZ9",
    roiScore: 90,
    specs: {
      ir_resolution: "640 × 480 true infrared resolution",
      autofocus: "Laser-assisted continuous autofocus",
      temp_range: "-20°C to 1500°C (-4°F to 2732°F)",
      optics: "Interchangeable AutoCal lenses"
    },
    images: [
      "/images/amazon/B08MB7VXZ9.jpg",
      "/images/amazon/B08MB7VXZ9.jpg",
      "/images/amazon/B08MB7VXZ9.jpg"
    ]
  },
  {
    id: "flir-vue-pro-r-640",
    name: "FLIR Vue Pro R 640 Radiometric Drone Thermal Camera",
    brand: "FLIR",
    category: "Thermal & Mapping Drones",
    priceUsd: 4499,
    directUrl: "https://www.flir.com/products/vue-pro-r/",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 87,
    specs: {
      radiometric_data: "Calibrated temperature data in every pixel",
      sensor_resolution: "640 × 512 uncooled VOx microbolometer",
      interfaces: "PWM, MAVLink, and USB control integration",
      storage: "On-board micro-SD 14-bit TIFF & radiometric JPEG"
    },
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "yuneec-h520e-rtk",
    name: "Yuneec H520E RTK Commercial Hexacopter Drone",
    brand: "Yuneec",
    category: "Thermal & Mapping Drones",
    priceUsd: 5999,
    directUrl: "https://yuneec.com/en/commercial/h520e-rtk/",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 84,
    specs: {
      architecture: "6-rotor hexacopter failsafe redundancy",
      rtk_system: "Centimeter-precise RTK satellite navigation",
      payload_options: "E20TVx thermal, E90x 1-inch, and LiDAR compatible",
      flight_time: "Up to 30 minutes payload flight duration"
    },
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "la-marzocco-gs3-mp",
    name: "La Marzocco GS3 MP Manual Paddle Espresso Machine",
    brand: "La Marzocco",
    category: "Prosumer Espresso",
    priceUsd: 8700,
    directUrl: "https://home.lamarzoccousa.com/product/gs3-mp/",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 93,
    specs: {
      boiler_system: "Dual stainless steel boilers with PID",
      pressure_control: "Conical valve manual paddle pressure profiling",
      saturated_group: "Commercial saturated brew grouphead",
      steam_wand: "Performance touch cool-water steam wand"
    },
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "rocket-appartamento-tca",
    name: "Rocket Espresso Appartamento TCA Espresso Machine",
    brand: "Rocket Espresso",
    category: "Prosumer Espresso",
    priceUsd: 1850,
    directUrl: "https://www.amazon.com/dp/B0CJM85H7D",
    imageUrl: "/images/amazon/B0CJM85H7D.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CJM85H7D",
    roiScore: 88,
    specs: {
      boiler: "1.8L copper boiler with heat exchanger",
      grouphead: "Classic E61 commercial brew group",
      control: "4-level electronic temperature adjustment",
      body: "Stainless steel chassis with circular side cutouts"
    },
    images: [
      "/images/amazon/B0CJM85H7D.jpg",
      "/images/amazon/B0CJM85H7D.jpg",
      "/images/amazon/B0CJM85H7D.jpg"
    ]
  },
  {
    id: "rocket-cinquantotto-r58",
    name: "Rocket Espresso R Cinquantotto Dual Boiler Machine",
    brand: "Rocket Espresso",
    category: "Prosumer Espresso",
    priceUsd: 3400,
    directUrl: "https://www.amazon.com/dp/B08MQ6M9N1",
    imageUrl: "/images/amazon/B08MQ6M9N1.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08MQ6M9N1",
    roiScore: 90,
    specs: {
      boilers: "Dual PID boilers (0.58L brew & 1.8L steam)",
      pump: "Commercial rotary pump with external reservoir/plumbed",
      touchscreen: "Detachable color touchscreen display pod",
      timer: "Integrated digital shot timer"
    },
    images: [
      "/images/amazon/B08MQ6M9N1.jpg",
      "/images/amazon/B08MQ6M9N1.jpg",
      "/images/amazon/B08MQ6M9N1.jpg"
    ]
  },
  {
    id: "rocket-giotto-cronometro-r",
    name: "Rocket Espresso Giotto Cronometro R Rotary Pump Machine",
    brand: "Rocket Espresso",
    category: "Prosumer Espresso",
    priceUsd: 2800,
    directUrl: "https://www.amazon.com/dp/B07P7L4H6V",
    imageUrl: "/images/amazon/B07P7L4H6V.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B07P7L4H6V",
    roiScore: 86,
    specs: {
      boiler: "1.8L insulated copper heat exchanger boiler",
      pump: "Silent commercial rotary pump",
      pid_control: "Digital PID temperature regulation",
      timer: "Subtle digital shot timer on front panel"
    },
    images: [
      "/images/amazon/B07P7L4H6V.jpg",
      "/images/amazon/B07P7L4H6V.jpg",
      "/images/amazon/B07P7L4H6V.jpg"
    ]
  },
  {
    id: "lelit-bianca-v3",
    name: "Lelit Bianca V3 Dual Boiler Flow Profiling Machine",
    brand: "Lelit",
    category: "Prosumer Espresso",
    priceUsd: 2999,
    directUrl: "https://www.amazon.com/dp/B0B5N163V4",
    imageUrl: "/images/amazon/B0B5N163V4.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B5N163V4",
    roiScore: 95,
    specs: {
      paddle: "Manual wooden paddle flow profiling device",
      boilers: "Dual stainless steel boilers (0.8L brew + 1.5L steam)",
      software: "LCC electronic system with low-flow controls",
      water_tank: "Repositionable external water reservoir"
    },
    images: [
      "/images/amazon/B0B5N163V4.jpg",
      "/images/amazon/B0B5N163V4.jpg",
      "/images/amazon/B0B5N163V4.jpg"
    ]
  },
  {
    id: "lelit-mara-x-v2",
    name: "Lelit Mara X V2 Compact Heat Exchanger Machine",
    brand: "Lelit",
    category: "Prosumer Espresso",
    priceUsd: 1699,
    directUrl: "https://www.amazon.com/dp/B08V5Q5R3G",
    imageUrl: "/images/amazon/B08V5Q5R3G.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08V5Q5R3G",
    roiScore: 91,
    specs: {
      technology: "Dual-probe brew priority HX system",
      grouphead: "E61 grouphead with thermo-siphon circulation",
      pump: "Silent vibration pump with OPV calibration",
      size: "Compact footprint 22 cm width"
    },
    images: [
      "/images/amazon/B08V5Q5R3G.jpg",
      "/images/amazon/B08V5Q5R3G.jpg",
      "/images/amazon/B08V5Q5R3G.jpg"
    ]
  },
  {
    id: "profitec-pro-700",
    name: "Profitec Pro 700 Dual Boiler Espresso Machine",
    brand: "Profitec",
    category: "Prosumer Espresso",
    priceUsd: 3299,
    directUrl: "https://profitec-espresso.com/en/products/pro700",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 92,
    specs: {
      boilers: "Dual stainless steel boilers (0.75L brew & 2.0L steam)",
      pump: "Rotary pump with direct water line connection",
      pid: "Dual PID display with integrated shot counter",
      steam_power: "Up to 2.0 bar powerful steam pressure"
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "profitec-pro-600",
    name: "Profitec Pro 600 Dual Boiler Espresso Machine",
    brand: "Profitec",
    category: "Prosumer Espresso",
    priceUsd: 2499,
    directUrl: "https://profitec-espresso.com/en/products/pro600",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 90,
    specs: {
      boilers: "Dual stainless steel boilers (0.75L brew + 1.0L steam)",
      pid: "PID display with programmable temperature and shot timer",
      group: "E61 brew group with stainless steel mushroom",
      steam_pressure: "Steam boiler pressure up to 2.0 bar"
    },
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "profitec-pro-800-lever",
    name: "Profitec Pro 800 Hand Lever Espresso Machine",
    brand: "Profitec",
    category: "Prosumer Espresso",
    priceUsd: 3499,
    directUrl: "https://profitec-espresso.com/en/products/pro800",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 88,
    specs: {
      group: "Massive commercial spring lever brew group",
      boiler: "3.5L copper boiler with PID control",
      preinfusion: "Gentle natural line/reservoir preinfusion",
      operation: "Near silent lever extraction pressure curve"
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "ecm-synchronika",
    name: "ECM Synchronika Dual Boiler PID Espresso Machine",
    brand: "ECM",
    category: "Prosumer Espresso",
    priceUsd: 3499,
    directUrl: "https://www.ecm.de/en/products/details/product/Product/Details/synchronika/",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 93,
    specs: {
      boilers: "Dual stainless steel boilers (0.75L brew / 2.0L steam)",
      chassis: "Polished stainless steel with anthracite powder-coated base",
      valves: "Quick-steam & quick-water lever valves",
      rotary_pump: "Low-noise rotary pump switchable water feed"
    },
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "ecm-mechanika-vi-slim",
    name: "ECM Mechanika VI Slim Heat Exchanger Machine",
    brand: "ECM",
    category: "Prosumer Espresso",
    priceUsd: 2199,
    directUrl: "https://www.ecm.de/en/products/details/product/Product/Details/mechanika-vi-slim/",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      boiler: "1.9L stainless steel boiler with heat exchanger",
      preset_modes: "3 selectable boiler temperature presets",
      preinfusion: "Pre-infusion ON/OFF switchable setting",
      width: "Ultra-slim 25 cm space-saving housing"
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "decent-de1pro",
    name: "Decent Espresso DE1PRO Advanced Digital Profiling Machine",
    brand: "Decent Espresso",
    category: "Prosumer Espresso",
    priceUsd: 3999,
    directUrl: "https://decentespresso.com/de1pro",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 96,
    specs: {
      technology: "Flow & pressure real-time algorithmic control",
      heating: "Sub-millisecond induction water thermoblock",
      tablet: "Included Android tablet with real-time extraction graphs",
      profiles: "Slayer, Lever, Blooming, and custom profiles"
    },
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "slayer-single-group",
    name: "Slayer Espresso Single Group Commercial Machine",
    brand: "Slayer Espresso",
    category: "Prosumer Espresso",
    priceUsd: 11500,
    directUrl: "https://slayerespresso.com/single-group/",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 85,
    specs: {
      needle_valve: "Patented precision needle valve flow restriction",
      boilers: "Independent brew boiler (1.1L) & steam boiler (3.3L)",
      prebrew: "Flavor-profiling slow pre-brew wet saturation",
      craftsmanship: "Handcrafted wood actuators and Peruvian walnut handles"
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "sanremo-you",
    name: "Sanremo YOU Single Group Multi-Boiler Machine",
    brand: "Sanremo",
    category: "Prosumer Espresso",
    priceUsd: 8900,
    directUrl: "https://www.sanremomachines.com/en/products/you/",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 90,
    specs: {
      multi_boiler: "Triple boiler architecture with AISI 316 steel",
      paddle_control: "Electronic paddle manual & custom repeatable profiles",
      touchscreen: "Integrated full-color frontal touchscreen",
      app: "Wi-Fi connectivity and dedicated configuration app"
    },
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "breville-dual-boiler",
    name: "Breville Dual Boiler Espresso Machine BES920XL",
    brand: "Breville",
    category: "Prosumer Espresso",
    priceUsd: 1599,
    directUrl: "https://www.amazon.com/dp/B00AW5Z19Y",
    imageUrl: "/images/amazon/B00AW5Z19Y.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B00AW5Z19Y",
    roiScore: 92,
    specs: {
      boilers: "Dual stainless steel boilers with PID regulation",
      group: "Actively heated 58mm commercial grouphead",
      preinfusion: "Low-pressure pre-infusion with OPV limit",
      steam: "Simultaneous instant steam and espresso extraction"
    },
    images: [
      "/images/amazon/B00AW5Z19Y.jpg",
      "/images/amazon/B00AW5Z19Y.jpg",
      "/images/amazon/B00AW5Z19Y.jpg"
    ]
  },
  {
    id: "breville-oracle-touch",
    name: "Breville Oracle Touch Fully Automated Espresso Machine",
    brand: "Breville",
    category: "Prosumer Espresso",
    priceUsd: 2799,
    directUrl: "https://www.amazon.com/dp/B0771B8Y2M",
    imageUrl: "/images/amazon/B0771B8Y2M.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0771B8Y2M",
    roiScore: 89,
    specs: {
      automation: "Automated grind, dose, tamp & milk texturing",
      boilers: "Triple heat system with dedicated steam & brew boilers",
      screen: "Full color touchscreen drink selection menu",
      milk_system: "Auto micro-foam milk wand with temperature sensor"
    },
    images: [
      "/images/amazon/B0771B8Y2M.jpg",
      "/images/amazon/B0771B8Y2M.jpg",
      "/images/amazon/B0771B8Y2M.jpg"
    ]
  },
  {
    id: "segway-super-scooter-gt2",
    name: "Segway SuperScooter GT2 High-Performance Scooter",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 2999,
    directUrl: "https://www.amazon.com/dp/B0B68Z5R7W",
    imageUrl: "/images/amazon/B0B68Z5R7W.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0B68Z5R7W",
    roiScore: 86,
    specs: {
      top_speed: "43.5 mph (70 km/h) boost mode",
      acceleration: "0-30 mph in 3.9 seconds",
      motor_power: "6000W dual hub motors",
      suspension: "Double-wishbone adjustable hydraulic suspension"
    },
    images: [
      "/images/amazon/B0B68Z5R7W.jpg",
      "/images/amazon/B0B68Z5R7W.jpg",
      "/images/amazon/B0B68Z5R7W.jpg"
    ]
  },
  {
    id: "segway-navimow-h1500e",
    name: "Segway Navimow H1500E-VF Wire-Free Robot Mower",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 1899,
    directUrl: "https://www.amazon.com/dp/B0CYLC8N3G",
    imageUrl: "/images/amazon/B0CYLC8N3G.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B0CYLC8N3G",
    roiScore: 92,
    specs: {
      lawn_area: "Up to 1500 m² (0.37 acres)",
      positioning: "EFLS 2.0 RTK satellite & Vision AI positioning",
      boundary: "100% wire-free virtual boundary setup",
      slope: "Climbs slopes up to 45% (24°)"
    },
    images: [
      "/images/amazon/B0CYLC8N3G.jpg",
      "/images/amazon/B0CYLC8N3G.jpg",
      "/images/amazon/B0CYLC8N3G.jpg"
    ]
  },
  {
    id: "aventon-aventure-2",
    name: "Aventon Aventure.2 All-Terrain Fat Tire Ebike",
    brand: "Aventon",
    category: "Utility EVs",
    priceUsd: 1999,
    directUrl: "https://www.aventon.com/products/aventure-2-ebike",
    imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "231547",
    roiScore: 91,
    specs: {
      motor: "750W rear hub motor (1130W peak)",
      sensor: "Torque sensor natural power response",
      tires: "26 × 4.0 in puncture-resistant fat tires",
      range: "Up to 60 miles per battery charge"
    },
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "aventon-soltera-2",
    name: "Aventon Soltera.2 Lightweight Urban Ebike",
    brand: "Aventon",
    category: "Utility EVs",
    priceUsd: 1199,
    directUrl: "https://www.aventon.com/products/soltera-2-ebike",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "impact",
    merchantId: "231547",
    roiScore: 93,
    specs: {
      weight: "41 lbs lightweight road frame",
      motor: "350W brushless rear hub motor",
      torque_sensor: "Smooth responsive torque sensing",
      range: "Up to 46 miles on pedal assist"
    },
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "tern-gsd-s10-lx",
    name: "Tern GSD S10 LX Heavy-Duty Cargo Ebike",
    brand: "Tern",
    category: "Utility EVs",
    priceUsd: 5399,
    directUrl: "https://www.ternbicycles.com/us/bikes/471/gsd-s10-lx",
    imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 95,
    specs: {
      payload: "200 kg (440 lb) maximum gross vehicle weight",
      motor: "Bosch Cargo Line motor (85 Nm torque)",
      battery: "Dual-battery ready up to 1000 Wh",
      folding: "Vertical parking & flat-fold geometry"
    },
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "tern-hsd-s8i",
    name: "Tern HSD S8i Belt-Drive Compact Cargo Ebike",
    brand: "Tern",
    category: "Utility EVs",
    priceUsd: 4499,
    directUrl: "https://www.ternbicycles.com/us/bikes/471/hsd-s8i",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 90,
    specs: {
      drivetrain: "Gates Carbon Drive CDX belt with Shimano Nexus 8",
      motor: "Bosch Active Line Plus mid-drive motor",
      payload: "180 kg (397 lb) rated capacity",
      brakes: "Magura MT4 hydraulic disc brakes"
    },
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "riese-muller-load-60",
    name: "Riese & Müller Load 60 Full-Suspension Cargo Ebike",
    brand: "Riese & Müller",
    category: "Utility EVs",
    priceUsd: 8750,
    directUrl: "https://www.r-m.de/en-us/bikes/load-60/",
    imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 89,
    specs: {
      suspension: "Control Technology full front and rear suspension",
      motor: "Bosch Cargo Line Smart System (85 Nm)",
      cargo_bed: "Front load bay with modular child/cargo boxes",
      shifting: "Rohloff E-14 electronic shifting or Enviolo 380"
    },
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "rad-power-radwagon-4",
    name: "Rad Power Bikes RadWagon 4 Electric Cargo Bike",
    brand: "Rad Power Bikes",
    category: "Utility EVs",
    priceUsd: 1799,
    directUrl: "https://www.radpowerbikes.com/products/radwagon-4-electric-cargo-bike",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 92,
    specs: {
      payload_capacity: "350 lb (158 kg) total load capacity",
      motor: "750W geared rear hub motor",
      tires: "Custom 22 × 3.0 in low-center-of-gravity tires",
      range: "45+ miles per charge"
    },
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "super73-rx-mojave",
    name: "SUPER73-RX Mojave Performance Electric Motorbike",
    brand: "SUPER73",
    category: "Utility EVs",
    priceUsd: 3695,
    directUrl: "https://super73.com/products/super73-rx-mojave",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 87,
    specs: {
      motor: "Multi-class motor with 2000W peak output",
      suspension: "Inverted coil-spring fork with rear piggyback coil",
      brakes: "Magura 4-piston forged caliper hydraulic brakes",
      tires: "GRZLY 20 × 4.5 in aggressive off-road tires"
    },
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "lectric-xp-3",
    name: "Lectric XP 3.0 Long-Range Folding Electric Bike",
    brand: "Lectric eBikes",
    category: "Utility EVs",
    priceUsd: 1199,
    directUrl: "https://lectricebikes.com/products/xp-3-0-long-range-black",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 94,
    specs: {
      motor: "500W motor with 1000W peak output & 55 Nm torque",
      brakes: "180mm hydraulic disc brakes with mineral oil",
      rear_rack: "Integrated rear rack rated for 150 lb",
      folding: "Compact foldable aluminum alloy frame"
    },
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "sur-ron-light-bee-x",
    name: "Sur-Ron Light Bee X Electric Off-Road Dirt Bike",
    brand: "Sur-Ron",
    category: "Utility EVs",
    priceUsd: 4500,
    directUrl: "https://sur-ronusa.com/light-bee-x/",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 93,
    specs: {
      power: "6000W mid-drive PMSM motor with 250 Nm torque",
      battery: "60V 38.5Ah (2310 Wh) LG lithium cells",
      top_speed: "47 mph (75 km/h) off-road speed",
      frame: "Forged aluminum alloy lightweight chassis (104 lb)"
    },
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "worx-landroid-l-wr155",
    name: "Worx Landroid L 20V Power Share Robotic Lawn Mower",
    brand: "Worx",
    category: "Utility EVs",
    priceUsd: 1499,
    directUrl: "https://www.amazon.com/dp/B08BWYVMTG",
    imageUrl: "/images/amazon/B08BWYVMTG.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08BWYVMTG",
    roiScore: 90,
    specs: {
      lawn_size: "Cuts up to 1/2 acre (21780 sq ft)",
      navigation: "Patented AIA technology for narrow passages",
      battery: "20V 6.0Ah Power Share removable battery",
      app: "Wi-Fi & Bluetooth smart mobile app controls"
    },
    images: [
      "/images/amazon/B08BWYVMTG.jpg",
      "/images/amazon/B08BWYVMTG.jpg",
      "/images/amazon/B08BWYVMTG.jpg"
    ]
  },
  {
    id: "husqvarna-automower-435x",
    name: "Husqvarna Automower 435X AWD Robotic Lawn Mower",
    brand: "Husqvarna",
    category: "Utility EVs",
    priceUsd: 4799,
    directUrl: "https://www.amazon.com/dp/B07R8H1K23",
    imageUrl: "/images/amazon/B07R8H1K23.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B07R8H1K23",
    roiScore: 88,
    specs: {
      drive: "All-wheel drive with articulated rear body",
      slope: "Tackles extreme inclines up to 70% (35°)",
      area: "Cuts lawns up to 0.9 acres (3500 m²)",
      navigation: "Automower Connect GPS assisted navigation"
    },
    images: [
      "/images/amazon/B07R8H1K23.jpg",
      "/images/amazon/B07R8H1K23.jpg",
      "/images/amazon/B07R8H1K23.jpg"
    ]
  },
  {
    id: "ego-power-z6-mower",
    name: "EGO Power+ Z6 42-Inch 56V Zero Turn Riding Mower",
    brand: "EGO Power+",
    category: "Utility EVs",
    priceUsd: 4999,
    directUrl: "https://www.amazon.com/dp/B08QMYR5C5",
    imageUrl: "/images/amazon/B08QMYR5C5.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B08QMYR5C5",
    roiScore: 92,
    specs: {
      power_equivalent: "22 HP gas engine equivalent",
      deck: "42-inch dual blade fabricated steel cutting deck",
      battery_system: "Peak Power technology holds up to 6 ARC Lithium batteries",
      speed: "3 to 8 mph variable electronic drive speed"
    },
    images: [
      "/images/amazon/B08QMYR5C5.jpg",
      "/images/amazon/B08QMYR5C5.jpg",
      "/images/amazon/B08QMYR5C5.jpg"
    ]
  },
  {
    id: "specialized-turbo-vado-4",
    name: "Specialized Turbo Vado 4.0 Electric Commuter Bike",
    brand: "Specialized",
    category: "Utility EVs",
    priceUsd: 4e3,
    directUrl: "https://www.specialized.com/us/en/turbo-vado-4-0/p/206159",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 91,
    specs: {
      motor: "Specialized 2.0 motor (70 Nm torque & 28 mph assist)",
      battery: "710 Wh fully integrated removable downtube battery",
      display: "MasterMind TCD color display with anti-theft radar",
      suspension: "Suntour MobieA32 80mm suspension fork"
    },
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=401",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80&h=402"
    ]
  },
  {
    id: "razor-ecosmart-metro-hd",
    name: "Razor EcoSmart Metro HD Electric Scooter with Seat",
    brand: "Razor",
    category: "Utility EVs",
    priceUsd: 599,
    directUrl: "https://www.amazon.com/dp/B082BG7M7T",
    imageUrl: "/images/amazon/B082BG7M7T.jpg",
    affiliateNetwork: "amazon",
    merchantId: "B082BG7M7T",
    roiScore: 84,
    specs: {
      motor: "350W high-torque rear-wheel drive motor",
      battery: "36V rechargeable lithium-ion battery system",
      comfort: "Padded seated comfort with detachable luggage rack",
      tires: "16-inch standard pneumatic tube tires"
    },
    images: [
      "/images/amazon/B082BG7M7T.jpg",
      "/images/amazon/B082BG7M7T.jpg",
      "/images/amazon/B082BG7M7T.jpg"
    ]
  },
  {
    id: "la-marzocco-linea-2789",
    name: "La Marzocco Linea Mini Home Espresso Machine",
    brand: "La Marzocco",
    category: "Prosumer Espresso",
    priceUsd: 4590,
    directUrl: "https://www.eversys.com/lagermania",
    imageUrl: "/images/amazon/B0CKWV1JHZ.jpg",
    images: [
      "/images/amazon/B0CKWV1JHZ.jpg",
      "/images/amazon/B0CKWV1JHZ.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0CKWV1JHZ",
    roiScore: 68,
    specs: {
      weight: "102 kg",
      dimensions: "135 x 49 x 47 cm",
      warranty: "5 years",
      power: "4018W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "3 x 4 L"
    }
  },
  {
    id: "omtech-80w-co2-nafz",
    name: "OMTech 80W CO2 Laser Cutter & Engraver",
    brand: "Omtech",
    category: "CNC & Laser Cutters",
    priceUsd: 3346,
    directUrl: "https://www.troteclaser.com/en-us/laser-machines/speedy-400",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 69,
    specs: {
      weight: "7 kg",
      dimensions: "42 x 80 x 52 cm",
      warranty: "5 years",
      power: "2275W",
      laser_power: "94W",
      working_area: "491 x 258 mm",
      cutting_speed: "up to 1841 mm/s"
    }
  },
  {
    id: "eversys-la-germania-fxif",
    name: "Eversys La Germania Superautomatic",
    brand: "Eversys",
    category: "Prosumer Espresso",
    priceUsd: 5208,
    directUrl: "https://www.profitec-espresso.com/profitec-pro-700",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "57615",
    roiScore: 73,
    specs: {
      weight: "80 kg",
      dimensions: "117 x 34 x 39 cm",
      warranty: "5 years",
      power: "900W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 1 L"
    }
  },
  {
    id: "skydio-x10-autonomous-pcm7",
    name: "Skydio X10 Autonomous Drone",
    brand: "Skydio",
    category: "Thermal & Mapping Drones",
    priceUsd: 16568,
    directUrl: "https://www.autelrobotics.com/evo-ii-pro-v3",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 74,
    specs: {
      weight: "92 kg",
      dimensions: "136 x 60 x 80 cm",
      warranty: "1 years",
      power: "2294W",
      max_flight_time: "45 minutes",
      max_speed: "74 km/h",
      max_altitude: "1089 m"
    }
  },
  {
    id: "sonic-mini-8k-v51a",
    name: "Sonic Mini 8K Ultra HD Resin Printer",
    brand: "Sonic Simplified",
    category: "3D Printers",
    priceUsd: 251,
    directUrl: "https://www.elegoo.com/products/jupiter-se-pro",
    imageUrl: "/images/amazon/B09TQH7J7L.jpg",
    images: [
      "/images/amazon/B09TQH7J7L.jpg",
      "/images/amazon/B09TQH7J7L.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09TQH7J7L",
    roiScore: 75,
    specs: {
      weight: "132 kg",
      dimensions: "139 x 66 x 72 cm",
      warranty: "5 years",
      power: "4075W",
      build_volume: "213 x 199 x 111 mm",
      layer_height: "0.01 - 0.38 mm",
      nozzle_temp: "up to 230°C",
      print_speed: "up to 528 mm/s"
    }
  },
  {
    id: "dji-avata-2-qmcs",
    name: "DJI Avata 2 FPV Drone Combo",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1053,
    directUrl: "https://www.skydio.com/products/skydio-x10",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "43944",
    roiScore: 78,
    specs: {
      weight: "131 kg",
      dimensions: "119 x 88 x 48 cm",
      warranty: "5 years",
      power: "633W",
      max_flight_time: "48 minutes",
      max_speed: "85 km/h",
      max_altitude: "1091 m"
    }
  },
  {
    id: "bluetti-ac180-expandable-cmr8",
    name: "Bluetti AC180 Expandable Power Station",
    brand: "Bluetti",
    category: "Off-Grid Solar & Power",
    priceUsd: 1309,
    directUrl: "https://www.renogy.com/2000w-pure-sine-wave-inverter",
    imageUrl: "/images/amazon/B0CW7WQXZG.jpg",
    images: [
      "/images/amazon/B0CW7WQXZG.jpg",
      "/images/amazon/B0CW7WQXZG.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0CW7WQXZG",
    roiScore: 82,
    specs: {
      weight: "55 kg",
      dimensions: "125 x 74 x 66 cm",
      warranty: "5 years",
      power: "1654W",
      capacity: "4817 Wh",
      output: "5311W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "ecm-synchronika-pid-bkcy",
    name: "ECM Synchronika PID Dual Boiler Espresso Machine",
    brand: "ECM",
    category: "Prosumer Espresso",
    priceUsd: 4532,
    directUrl: "https://www.rocket-espresso.com/appartamento.html",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 63,
    specs: {
      weight: "108 kg",
      dimensions: "89 x 66 x 73 cm",
      warranty: "2 years",
      power: "4916W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "3 x 2 L"
    }
  },
  {
    id: "lectric-xp-30-xwj7",
    name: "Lectric XP 3.0 E-Bike",
    brand: "Lectric",
    category: "Utility EVs",
    priceUsd: 982,
    directUrl: "https://ternbicycles.com/products/gsd-s10",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "28612",
    roiScore: 85,
    specs: {
      weight: "25 kg",
      dimensions: "92 x 47 x 54 cm",
      warranty: "1 years",
      power: "4327W",
      motor_power: "497W",
      battery_capacity: "42V 28Ah",
      max_range: "up to 116 km"
    }
  },
  {
    id: "skydio-2-autonomous-zqjg",
    name: "Skydio 2+ Autonomous Camera Drone",
    brand: "Skydio",
    category: "Thermal & Mapping Drones",
    priceUsd: 2236,
    directUrl: "https://www.dji.com/matrice-30",
    imageUrl: "/images/amazon/B08XYZ1234.jpg",
    images: [
      "/images/amazon/B08XYZ1234.jpg",
      "/images/amazon/B08XYZ1234.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08XYZ1234",
    roiScore: 79,
    specs: {
      weight: "15 kg",
      dimensions: "112 x 76 x 35 cm",
      warranty: "2 years",
      power: "2334W",
      max_flight_time: "51 minutes",
      max_speed: "74 km/h",
      max_altitude: "2900 m"
    }
  },
  {
    id: "ecoflow-delta-pro-010n",
    name: "EcoFlow Delta Pro Ultra Hybrid Inverter",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 4297,
    directUrl: "https://www.ecoflow.com/products/river-2-pro",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "11223",
    roiScore: 87,
    specs: {
      weight: "28 kg",
      dimensions: "106 x 49 x 40 cm",
      warranty: "2 years",
      power: "3141W",
      capacity: "3023 Wh",
      output: "4060W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "bluetti-ac300b300s-modular-6p5x",
    name: "Bluetti AC300+B300S Modular Power Station",
    brand: "Bluetti",
    category: "Off-Grid Solar & Power",
    priceUsd: 2716,
    directUrl: "https://www.bluettipower.com/products/ac300-b300s",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "48769",
    roiScore: 86,
    specs: {
      weight: "114 kg",
      dimensions: "98 x 61 x 48 cm",
      warranty: "1 years",
      power: "2972W",
      capacity: "1054 Wh",
      output: "2387W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "aeon-nova-510-2040",
    name: "Aeon Nova 510 Fiber Laser Marker",
    brand: "Aeon",
    category: "CNC & Laser Cutters",
    priceUsd: 921,
    directUrl: "https://www.omtech.com/80w-co2-laser-cutter.html",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "63255",
    roiScore: 75,
    specs: {
      weight: "131 kg",
      dimensions: "35 x 48 x 33 cm",
      warranty: "3 years",
      power: "4704W",
      laser_power: "55W",
      working_area: "336 x 247 mm",
      cutting_speed: "up to 931 mm/s"
    }
  },
  {
    id: "jackery-explorer-5000-uuxa",
    name: "Jackery Explorer 5000 Plus Portable Power Station",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 2946,
    directUrl: "https://www.goalzero.com/collections/yeti-power-stations/products/yeti-3000x",
    imageUrl: "/images/amazon/B0BQ7WQXZG.jpg",
    images: [
      "/images/amazon/B0BQ7WQXZG.jpg",
      "/images/amazon/B0BQ7WQXZG.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0BQ7WQXZG",
    roiScore: 87,
    specs: {
      weight: "110 kg",
      dimensions: "59 x 35 x 44 cm",
      warranty: "1 years",
      power: "1303W",
      capacity: "5048 Wh",
      output: "3671W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "sonic-mini-8k-2syd",
    name: "Sonic Mini 8K Ultra HD Resin Printer",
    brand: "Sonic Simplified",
    category: "3D Printers",
    priceUsd: 264,
    directUrl: "https://www.raise3d.com/products/pro3-plus/",
    imageUrl: "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "29842",
    roiScore: 69,
    specs: {
      weight: "87 kg",
      dimensions: "22 x 75 x 37 cm",
      warranty: "2 years",
      power: "3885W",
      build_volume: "232 x 211 x 192 mm",
      layer_height: "0.01 - 0.1 mm",
      nozzle_temp: "up to 314°C",
      print_speed: "up to 788 mm/s"
    }
  },
  {
    id: "anycubic-kobra-2-0w7b",
    name: "Anycubic Kobra 2 Combo 3D Printer",
    brand: "Anycubic",
    category: "3D Printers",
    priceUsd: 472,
    directUrl: "https://www.bambulab.com/en-us/products/p1p",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "17704",
    roiScore: 67,
    specs: {
      weight: "88 kg",
      dimensions: "71 x 39 x 21 cm",
      warranty: "2 years",
      power: "4500W",
      build_volume: "188 x 296 x 315 mm",
      layer_height: "0.01 - 0.31 mm",
      nozzle_temp: "up to 326°C",
      print_speed: "up to 510 mm/s"
    }
  },
  {
    id: "autel-evo-nano-aiux",
    name: "Autel EVO Nano+ Thermal Compact Drone",
    brand: "Autel",
    category: "Thermal & Mapping Drones",
    priceUsd: 1305,
    directUrl: "https://www.parrot.com/en/a-nafi-us",
    imageUrl: "/images/amazon/B09VQXZ8RT.jpg",
    images: [
      "/images/amazon/B09VQXZ8RT.jpg",
      "/images/amazon/B09VQXZ8RT.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09VQXZ8RT",
    roiScore: 87,
    specs: {
      weight: "12 kg",
      dimensions: "96 x 36 x 67 cm",
      warranty: "5 years",
      power: "357W",
      max_flight_time: "27 minutes",
      max_speed: "90 km/h",
      max_altitude: "4406 m"
    }
  },
  {
    id: "super73-s2ez-electric-ecru",
    name: "Super73 S2-EZ Electric Motorcycle",
    brand: "Super73",
    category: "Utility EVs",
    priceUsd: 1757,
    directUrl: "https://www.aventon.com/products/aventon-aventure-2",
    imageUrl: "/images/amazon/B07DEF9012.jpg",
    images: [
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B07DEF9012",
    roiScore: 87,
    specs: {
      weight: "48 kg",
      dimensions: "108 x 21 x 75 cm",
      warranty: "2 years",
      power: "1013W",
      motor_power: "773W",
      battery_capacity: "50V 15Ah",
      max_range: "up to 104 km"
    }
  },
  {
    id: "ultimaker-s5-pro-hwkc",
    name: "Ultimaker S5 Pro Bundle 3D Printer",
    brand: "Ultimaker",
    category: "3D Printers",
    priceUsd: 6046,
    directUrl: "https://www.raise3d.com/products/pro3-plus/",
    imageUrl: "/images/amazon/B09X4J5K2M.jpg",
    images: [
      "/images/amazon/B09X4J5K2M.jpg",
      "/images/amazon/B09X4J5K2M.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09X4J5K2M",
    roiScore: 50,
    specs: {
      weight: "14 kg",
      dimensions: "99 x 92 x 56 cm",
      warranty: "3 years",
      power: "2142W",
      build_volume: "208 x 122 x 235 mm",
      layer_height: "0.01 - 0.24 mm",
      nozzle_temp: "up to 262°C",
      print_speed: "up to 444 mm/s"
    }
  },
  {
    id: "ortur-laser-master-i8f2",
    name: "Ortur Laser Master 2 5W Laser Engraver",
    brand: "Ortur",
    category: "CNC & Laser Cutters",
    priceUsd: 358,
    directUrl: "https://www.uvlaser.com/unlv-980nm",
    imageUrl: "/images/amazon/B08GHI3456.jpg",
    images: [
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08GHI3456",
    roiScore: 77,
    specs: {
      weight: "47 kg",
      dimensions: "100 x 94 x 31 cm",
      warranty: "3 years",
      power: "4474W",
      laser_power: "96W",
      working_area: "831 x 369 mm",
      cutting_speed: "up to 1026 mm/s"
    }
  },
  {
    id: "ecoflow-delta-pro-79vr",
    name: "EcoFlow Delta Pro Ultra Hybrid Inverter",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 4512,
    directUrl: "https://www.jackery.com/products/solarsaga-200w",
    imageUrl: "/images/amazon/B0BQ7WQXZG.jpg",
    images: [
      "/images/amazon/B0BQ7WQXZG.jpg",
      "/images/amazon/B0BQ7WQXZG.jpg",
      "/images/amazon/B0BQ7WQXZG.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0BQ7WQXZG",
    roiScore: 81,
    specs: {
      weight: "88 kg",
      dimensions: "123 x 65 x 52 cm",
      warranty: "2 years",
      power: "4678W",
      capacity: "4414 Wh",
      output: "6313W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "riese-mller-charger4-zx28",
    name: "Riese & Müller Charger4 Torq4 Cargo Bike",
    brand: "Riese & Müller",
    category: "Utility EVs",
    priceUsd: 9490,
    directUrl: "https://www.aventon.com/products/aventon-aventure-2",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "76478",
    roiScore: 88,
    specs: {
      weight: "5 kg",
      dimensions: "140 x 79 x 77 cm",
      warranty: "5 years",
      power: "2079W",
      motor_power: "601W",
      battery_capacity: "45V 15Ah",
      max_range: "up to 69 km"
    }
  },
  {
    id: "aeon-nova-510-8ssb",
    name: "Aeon Nova 510 Fiber Laser Marker",
    brand: "Aeon",
    category: "CNC & Laser Cutters",
    priceUsd: 956,
    directUrl: "https://www.ortur.com/ortur-laser-master-2",
    imageUrl: "/images/amazon/B07ABC5678.jpg",
    images: [
      "/images/amazon/B07ABC5678.jpg",
      "/images/amazon/B07ABC5678.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B07ABC5678",
    roiScore: 86,
    specs: {
      weight: "30 kg",
      dimensions: "71 x 51 x 61 cm",
      warranty: "3 years",
      power: "878W",
      laser_power: "87W",
      working_area: "552 x 287 mm",
      cutting_speed: "up to 984 mm/s"
    }
  },
  {
    id: "segway-navimow-h1500e-qstd",
    name: "Segway Navimow H1500E Robotic Lawn Mower",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 1504,
    directUrl: "https://www.worx.com/products/landroid-m",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "33178",
    roiScore: 78,
    specs: {
      weight: "121 kg",
      dimensions: "126 x 91 x 40 cm",
      warranty: "1 years",
      power: "2936W",
      motor_power: "877W",
      battery_capacity: "84V 20Ah",
      max_range: "up to 109 km"
    }
  },
  {
    id: "lelit-bianca-v3-54y5",
    name: "Lelit Bianca V3 PID Dual Boiler Espresso Machine",
    brand: "Lelit",
    category: "Prosumer Espresso",
    priceUsd: 2569,
    directUrl: "https://www.kvdw.com/spirit",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "12095",
    roiScore: 69,
    specs: {
      weight: "130 kg",
      dimensions: "101 x 68 x 40 cm",
      warranty: "3 years",
      power: "674W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 2 L"
    }
  },
  {
    id: "sculpfun-s30-pro-bz5m",
    name: "Sculpfun S30 Pro 10W Laser Engraver",
    brand: "Sculpfun",
    category: "CNC & Laser Cutters",
    priceUsd: 411,
    directUrl: "https://www.aeonlaser.com/nova-510",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 69,
    specs: {
      weight: "61 kg",
      dimensions: "108 x 94 x 35 cm",
      warranty: "3 years",
      power: "3066W",
      laser_power: "45W",
      working_area: "846 x 236 mm",
      cutting_speed: "up to 1070 mm/s"
    }
  },
  {
    id: "phrozen-sonic-mighty-0t9v",
    name: "Phrozen Sonic Mighty 8K LCD 3D Printer",
    brand: "Phrozen",
    category: "3D Printers",
    priceUsd: 416,
    directUrl: "https://www.elegoo.com/products/jupiter-se-pro",
    imageUrl: "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 77,
    specs: {
      weight: "124 kg",
      dimensions: "99 x 79 x 21 cm",
      warranty: "1 years",
      power: "1176W",
      build_volume: "272 x 162 x 300 mm",
      layer_height: "0.01 - 0.22 mm",
      nozzle_temp: "up to 242°C",
      print_speed: "up to 695 mm/s"
    }
  },
  {
    id: "ecm-synchronika-pid-xh5k",
    name: "ECM Synchronika PID Dual Boiler Espresso Machine",
    brand: "ECM",
    category: "Prosumer Espresso",
    priceUsd: 4626,
    directUrl: "https://www.ecm-espresso.com/ecm-synchronika",
    imageUrl: "/images/amazon/B0CKWV1JHZ.jpg",
    images: [
      "/images/amazon/B0CKWV1JHZ.jpg",
      "/images/amazon/B0CKWV1JHZ.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0CKWV1JHZ",
    roiScore: 63,
    specs: {
      weight: "143 kg",
      dimensions: "75 x 65 x 43 cm",
      warranty: "3 years",
      power: "3361W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "3 x 4 L"
    }
  },
  {
    id: "freefly-alta-x-nepv",
    name: "Freefly Alta X Heavy Lift Drone",
    brand: "Freefly",
    category: "Thermal & Mapping Drones",
    priceUsd: 35421,
    directUrl: "https://www.autelrobotics.com/evo-ii-pro-v3",
    imageUrl: "/images/amazon/B09VQXZ8RT.jpg",
    images: [
      "/images/amazon/B09VQXZ8RT.jpg",
      "/images/amazon/B09VQXZ8RT.jpg",
      "/images/amazon/B09VQXZ8RT.jpg",
      "/images/amazon/B09VQXZ8RT.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09VQXZ8RT",
    roiScore: 50,
    specs: {
      weight: "123 kg",
      dimensions: "113 x 56 x 51 cm",
      warranty: "2 years",
      power: "3333W",
      max_flight_time: "33 minutes",
      max_speed: "63 km/h",
      max_altitude: "1257 m"
    }
  },
  {
    id: "aventon-aventure2-electric-lqc5",
    name: "Aventon Aventure.2 Electric Bike",
    brand: "Aventon",
    category: "Utility EVs",
    priceUsd: 1952,
    directUrl: "https://ternbicycles.com/products/gsd-s10",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "48615",
    roiScore: 78,
    specs: {
      weight: "95 kg",
      dimensions: "91 x 65 x 57 cm",
      warranty: "5 years",
      power: "2754W",
      motor_power: "861W",
      battery_capacity: "40V 29Ah",
      max_range: "up to 97 km"
    }
  },
  {
    id: "la-marzocco-linea-yi4s",
    name: "La Marzocco Linea Mini Home Espresso Machine",
    brand: "La Marzocco",
    category: "Prosumer Espresso",
    priceUsd: 4515,
    directUrl: "https://www.profitec-espresso.com/profitec-pro-700",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "57595",
    roiScore: 73,
    specs: {
      weight: "146 kg",
      dimensions: "133 x 30 x 35 cm",
      warranty: "3 years",
      power: "1483W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 2 L"
    }
  },
  {
    id: "autel-evo-ii-1q88",
    name: "Autel EVO II Pro V3 Thermal Drone",
    brand: "Autel",
    category: "Thermal & Mapping Drones",
    priceUsd: 4314,
    directUrl: "https://www.skydio.com/products/skydio-x10",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "58522",
    roiScore: 83,
    specs: {
      weight: "107 kg",
      dimensions: "73 x 98 x 24 cm",
      warranty: "2 years",
      power: "1755W",
      max_flight_time: "25 minutes",
      max_speed: "80 km/h",
      max_altitude: "5970 m"
    }
  },
  {
    id: "dji-mini-4-yjak",
    name: "DJI Mini 4 Pro RC Night Fly More Combo",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1711,
    directUrl: "https://www.skydio.com/products/skydio-2-plus",
    imageUrl: "/images/amazon/B07DEF9012.jpg",
    images: [
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B07DEF9012",
    roiScore: 81,
    specs: {
      weight: "120 kg",
      dimensions: "112 x 81 x 54 cm",
      warranty: "5 years",
      power: "4756W",
      max_flight_time: "59 minutes",
      max_speed: "48 km/h",
      max_altitude: "4488 m"
    }
  },
  {
    id: "slayer-espresso-steam-i1cm",
    name: "Slayer Espresso Steam Engine Single Group",
    brand: "Slayer",
    category: "Prosumer Espresso",
    priceUsd: 26028,
    directUrl: "https://www.ecm-espresso.com/ecm-synchronika",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "58218",
    roiScore: 49,
    specs: {
      weight: "104 kg",
      dimensions: "125 x 95 x 53 cm",
      warranty: "2 years",
      power: "207W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "1 x 3 L"
    }
  },
  {
    id: "sonic-mini-8k-cqmj",
    name: "Sonic Mini 8K Ultra HD Resin Printer",
    brand: "Sonic Simplified",
    category: "3D Printers",
    priceUsd: 320,
    directUrl: "https://www.raise3d.com/products/pro3-plus/",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "55044",
    roiScore: 75,
    specs: {
      weight: "29 kg",
      dimensions: "72 x 83 x 39 cm",
      warranty: "2 years",
      power: "4493W",
      build_volume: "393 x 287 x 342 mm",
      layer_height: "0.01 - 0.49 mm",
      nozzle_temp: "up to 387°C",
      print_speed: "up to 465 mm/s"
    }
  },
  {
    id: "anycubic-kobra-2-wqni",
    name: "Anycubic Kobra 2 Combo 3D Printer",
    brand: "Anycubic",
    category: "3D Printers",
    priceUsd: 446,
    directUrl: "https://www.raise3d.com/products/pro3-plus/",
    imageUrl: "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "99004",
    roiScore: 75,
    specs: {
      weight: "51 kg",
      dimensions: "137 x 26 x 70 cm",
      warranty: "2 years",
      power: "2643W",
      build_volume: "341 x 354 x 128 mm",
      layer_height: "0.01 - 0.44 mm",
      nozzle_temp: "up to 292°C",
      print_speed: "up to 581 mm/s"
    }
  },
  {
    id: "trotec-speedy-400-ld4p",
    name: "Trotec Speedy 400 Flex Laser Cutter",
    brand: "Trotec",
    category: "CNC & Laser Cutters",
    priceUsd: 23889,
    directUrl: "https://www.bosslaser.com/boss-ls-3655-100w",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 57,
    specs: {
      weight: "44 kg",
      dimensions: "135 x 66 x 49 cm",
      warranty: "1 years",
      power: "976W",
      laser_power: "22W",
      working_area: "517 x 291 mm",
      cutting_speed: "up to 1837 mm/s"
    }
  },
  {
    id: "raise3d-pro3-plus-ux0n",
    name: "Raise3D Pro3 Plus Industrial 3D Printer",
    brand: "Raise3D",
    category: "3D Printers",
    priceUsd: 5996,
    directUrl: "https://www.phrozen.com/products/sonic-mighty-8k",
    imageUrl: "/images/amazon/B09X4J5K2M.jpg",
    images: [
      "/images/amazon/B09X4J5K2M.jpg",
      "/images/amazon/B09X4J5K2M.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09X4J5K2M",
    roiScore: 65,
    specs: {
      weight: "21 kg",
      dimensions: "142 x 98 x 53 cm",
      warranty: "2 years",
      power: "2681W",
      build_volume: "325 x 209 x 385 mm",
      layer_height: "0.01 - 0.47000000000000003 mm",
      nozzle_temp: "up to 381°C",
      print_speed: "up to 599 mm/s"
    }
  },
  {
    id: "jackery-solarsaga-200w-ncks",
    name: "Jackery SolarSaga 200W Portable Solar Panel",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 307,
    directUrl: "https://www.bluettipower.com/products/ac300-b300s",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 84,
    specs: {
      weight: "53 kg",
      dimensions: "71 x 80 x 35 cm",
      warranty: "1 years",
      power: "1005W",
      capacity: "9464 Wh",
      output: "2000W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "aventon-aventure2-electric-ucnc",
    name: "Aventon Aventure.2 Electric Bike",
    brand: "Aventon",
    category: "Utility EVs",
    priceUsd: 2069,
    directUrl: "https://www.aventon.com/products/aventon-aventure-2",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "97287",
    roiScore: 86,
    specs: {
      weight: "42 kg",
      dimensions: "48 x 34 x 28 cm",
      warranty: "5 years",
      power: "4010W",
      motor_power: "652W",
      battery_capacity: "41V 14Ah",
      max_range: "up to 198 km"
    }
  },
  {
    id: "tern-gsd-s10-1qs4",
    name: "Tern GSD S10 Cargo Bike",
    brand: "Tern",
    category: "Utility EVs",
    priceUsd: 5421,
    directUrl: "https://www.segway.com/na/en/navimow-h1500e.html",
    imageUrl: "/images/amazon/B09XYZ5678.jpg",
    images: [
      "/images/amazon/B09XYZ5678.jpg",
      "/images/amazon/B09XYZ5678.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09XYZ5678",
    roiScore: 87,
    specs: {
      weight: "16 kg",
      dimensions: "81 x 39 x 23 cm",
      warranty: "5 years",
      power: "1355W",
      motor_power: "513W",
      battery_capacity: "36V 19Ah",
      max_range: "up to 127 km"
    }
  },
  {
    id: "bluetti-ac300b300s-modular-u9z4",
    name: "Bluetti AC300+B300S Modular Power Station",
    brand: "Bluetti",
    category: "Off-Grid Solar & Power",
    priceUsd: 2529,
    directUrl: "https://www.bluettipower.com/products/ac300-b300s",
    imageUrl: "/images/amazon/B0CW7WQXZG.jpg",
    images: [
      "/images/amazon/B0CW7WQXZG.jpg",
      "/images/amazon/B0CW7WQXZG.jpg",
      "/images/amazon/B0CW7WQXZG.jpg",
      "/images/amazon/B0CW7WQXZG.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0CW7WQXZG",
    roiScore: 73,
    specs: {
      weight: "42 kg",
      dimensions: "106 x 27 x 68 cm",
      warranty: "2 years",
      power: "2382W",
      capacity: "4090 Wh",
      output: "6482W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "worx-landroid-m-383q",
    name: "Worx Landroid M 20V Power Share Robot Mower",
    brand: "Worx",
    category: "Utility EVs",
    priceUsd: 1116,
    directUrl: "https://www.lectricebikes.com/lectric-xp-3-0/",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "51074",
    roiScore: 85,
    specs: {
      weight: "95 kg",
      dimensions: "101 x 98 x 42 cm",
      warranty: "3 years",
      power: "1064W",
      motor_power: "794W",
      battery_capacity: "95V 24Ah",
      max_range: "up to 30 km"
    }
  },
  {
    id: "elegoo-jupiter-se-gf54",
    name: "Elegoo Jupiter SE Pro Large Format 3D Printer",
    brand: "Elegoo",
    category: "3D Printers",
    priceUsd: 627,
    directUrl: "https://www.prusa3d.com/product/mk4-s/",
    imageUrl: "/images/amazon/B09SVP4M7P.jpg",
    images: [
      "/images/amazon/B09SVP4M7P.jpg",
      "/images/amazon/B09SVP4M7P.jpg",
      "/images/amazon/B09SVP4M7P.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09SVP4M7P",
    roiScore: 67,
    specs: {
      weight: "30 kg",
      dimensions: "25 x 92 x 35 cm",
      warranty: "1 years",
      power: "4797W",
      build_volume: "254 x 253 x 187 mm",
      layer_height: "0.01 - 0.44 mm",
      nozzle_temp: "up to 225°C",
      print_speed: "up to 508 mm/s"
    }
  },
  {
    id: "husqvarna-automower-435x-yf6n",
    name: "Husqvarna Automower 435X AWD Robotic Mower",
    brand: "Husqvarna",
    category: "Utility EVs",
    priceUsd: 3531,
    directUrl: "https://ternbicycles.com/products/gsd-s10",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "67780",
    roiScore: 83,
    specs: {
      weight: "108 kg",
      dimensions: "76 x 47 x 75 cm",
      warranty: "3 years",
      power: "1602W",
      motor_power: "940W",
      battery_capacity: "85V 22Ah",
      max_range: "up to 172 km"
    }
  },
  {
    id: "ecoflow-river-2-kfc7",
    name: "EcoFlow River 2 Pro Portable Power Station",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 560,
    directUrl: "https://www.bluettipower.com/products/ac180",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "47818",
    roiScore: 85,
    specs: {
      weight: "101 kg",
      dimensions: "102 x 81 x 25 cm",
      warranty: "2 years",
      power: "2908W",
      capacity: "4351 Wh",
      output: "2631W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "amwood-48v-5000w-dh0v",
    name: "Amwood 48V 5000W Fat Tire Electric Bike",
    brand: "Amwood",
    category: "Utility EVs",
    priceUsd: 1397,
    directUrl: "https://amwoodstore.com/products/48v-5000w-fat-tire-electric-bike",
    imageUrl: "/images/amazon/B08GHI3456.jpg",
    images: [
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08GHI3456",
    roiScore: 78,
    specs: {
      weight: "117 kg",
      dimensions: "138 x 66 x 80 cm",
      warranty: "2 years",
      power: "793W",
      motor_power: "991W",
      battery_capacity: "62V 30Ah",
      max_range: "up to 139 km"
    }
  },
  {
    id: "dji-fly-more-hw6b",
    name: "DJI Fly More Combo RC Pro Enterprise",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 2998,
    directUrl: "https://www.dji.com/mini-4-pro",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 75,
    specs: {
      weight: "139 kg",
      dimensions: "41 x 25 x 68 cm",
      warranty: "2 years",
      power: "4435W",
      max_flight_time: "56 minutes",
      max_speed: "55 km/h",
      max_altitude: "2376 m"
    }
  },
  {
    id: "unlv-980nm-uv-9h1g",
    name: "Unlv 980nm UV Laser Marking Machine",
    brand: "Unlv",
    category: "CNC & Laser Cutters",
    priceUsd: 368,
    directUrl: "https://www.sculpfun.com/products/s30-pro",
    imageUrl: "/images/amazon/B08XYZ1234.jpg",
    images: [
      "/images/amazon/B08XYZ1234.jpg",
      "/images/amazon/B08XYZ1234.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08XYZ1234",
    roiScore: 84,
    specs: {
      weight: "82 kg",
      dimensions: "106 x 51 x 64 cm",
      warranty: "1 years",
      power: "3697W",
      laser_power: "92W",
      working_area: "238 x 347 mm",
      cutting_speed: "up to 791 mm/s"
    }
  },
  {
    id: "ortur-laser-master-pr65",
    name: "Ortur Laser Master 2 5W Laser Engraver",
    brand: "Ortur",
    category: "CNC & Laser Cutters",
    priceUsd: 317,
    directUrl: "https://www.bosslaser.com/boss-ls-3655-100w",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 71,
    specs: {
      weight: "5 kg",
      dimensions: "92 x 33 x 38 cm",
      warranty: "5 years",
      power: "1760W",
      laser_power: "66W",
      working_area: "820 x 464 mm",
      cutting_speed: "up to 1416 mm/s"
    }
  },
  {
    id: "ecoflow-delta-pro-5dw3",
    name: "EcoFlow Delta Pro Ultra Hybrid Inverter",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 4500,
    directUrl: "https://www.jackery.com/products/solarsaga-200w",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "56707",
    roiScore: 83,
    specs: {
      weight: "27 kg",
      dimensions: "28 x 23 x 74 cm",
      warranty: "5 years",
      power: "1234W",
      capacity: "5807 Wh",
      output: "1546W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "autel-evo-ii-37m5",
    name: "Autel EVO II Pro V3 Thermal Drone",
    brand: "Autel",
    category: "Thermal & Mapping Drones",
    priceUsd: 4309,
    directUrl: "https://www.parrot.com/en/a-nafi-us",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "22470",
    roiScore: 74,
    specs: {
      weight: "9 kg",
      dimensions: "97 x 44 x 47 cm",
      warranty: "5 years",
      power: "2807W",
      max_flight_time: "45 minutes",
      max_speed: "74 km/h",
      max_altitude: "2938 m"
    }
  },
  {
    id: "eversys-la-germania-o3pu",
    name: "Eversys La Germania Superautomatic",
    brand: "Eversys",
    category: "Prosumer Espresso",
    priceUsd: 5273,
    directUrl: "https://www.kvdw.com/spirit",
    imageUrl: "/images/amazon/B0CHF3M7K5.jpg",
    images: [
      "/images/amazon/B0CHF3M7K5.jpg",
      "/images/amazon/B0CHF3M7K5.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B0CHF3M7K5",
    roiScore: 59,
    specs: {
      weight: "139 kg",
      dimensions: "131 x 41 x 22 cm",
      warranty: "2 years",
      power: "2788W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 1 L"
    }
  },
  {
    id: "jackery-explorer-5000-a95t",
    name: "Jackery Explorer 5000 Plus Portable Power Station",
    brand: "Jackery",
    category: "Off-Grid Solar & Power",
    priceUsd: 2959,
    directUrl: "https://www.renogy.com/2000w-pure-sine-wave-inverter",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "49034",
    roiScore: 77,
    specs: {
      weight: "123 kg",
      dimensions: "71 x 21 x 53 cm",
      warranty: "5 years",
      power: "2947W",
      capacity: "1689 Wh",
      output: "3424W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "gweike-cloud-8w-srvb",
    name: "Gweike Cloud 8W Laser Engraver",
    brand: "Gweike",
    category: "CNC & Laser Cutters",
    priceUsd: 307,
    directUrl: "https://www.uvlaser.com/unlv-980nm",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "29250",
    roiScore: 76,
    specs: {
      weight: "16 kg",
      dimensions: "96 x 33 x 33 cm",
      warranty: "1 years",
      power: "3950W",
      laser_power: "13W",
      working_area: "404 x 454 mm",
      cutting_speed: "up to 836 mm/s"
    }
  },
  {
    id: "sculpfun-s30-pro-awu5",
    name: "Sculpfun S30 Pro 10W Laser Engraver",
    brand: "Sculpfun",
    category: "CNC & Laser Cutters",
    priceUsd: 403,
    directUrl: "https://www.silhouetteamerica.com/en/silhouette-cameo-4",
    imageUrl: "/images/amazon/B08GHI3456.jpg",
    images: [
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08GHI3456",
    roiScore: 80,
    specs: {
      weight: "127 kg",
      dimensions: "46 x 84 x 76 cm",
      warranty: "3 years",
      power: "4757W",
      laser_power: "27W",
      working_area: "311 x 366 mm",
      cutting_speed: "up to 890 mm/s"
    }
  },
  {
    id: "phrozen-sonic-mighty-ugr9",
    name: "Phrozen Sonic Mighty 8K LCD 3D Printer",
    brand: "Phrozen",
    category: "3D Printers",
    priceUsd: 427,
    directUrl: "https://www.anycubic.com/products/kobra-2-combo",
    imageUrl: "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "26514",
    roiScore: 79,
    specs: {
      weight: "12 kg",
      dimensions: "75 x 54 x 31 cm",
      warranty: "5 years",
      power: "3502W",
      build_volume: "383 x 111 x 334 mm",
      layer_height: "0.01 - 0.05 mm",
      nozzle_temp: "up to 202°C",
      print_speed: "up to 557 mm/s"
    }
  },
  {
    id: "dji-fly-more-1wnn",
    name: "DJI Fly More Combo RC Pro Enterprise",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 3067,
    directUrl: "https://www.dji.com/avata-2",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "92486",
    roiScore: 75,
    specs: {
      weight: "142 kg",
      dimensions: "103 x 82 x 60 cm",
      warranty: "5 years",
      power: "648W",
      max_flight_time: "48 minutes",
      max_speed: "59 km/h",
      max_altitude: "2654 m"
    }
  },
  {
    id: "synesso-cyncra-3group-v1bf",
    name: "Synesso Cyncra 3-Group Espresso Machine",
    brand: "Synesso",
    category: "Prosumer Espresso",
    priceUsd: 30756,
    directUrl: "https://www.lamarzocco.com/linea-mini/",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "46172",
    roiScore: 51,
    specs: {
      weight: "51 kg",
      dimensions: "123 x 37 x 80 cm",
      warranty: "2 years",
      power: "2294W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "1 x 1 L"
    }
  },
  {
    id: "kees-van-der-a9u6",
    name: "Kees van der Westen Spirit Espresso Machine",
    brand: "Kees van der Westen",
    category: "Prosumer Espresso",
    priceUsd: 18896,
    directUrl: "https://www.ecm-espresso.com/ecm-synchronika",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 45,
    specs: {
      weight: "10 kg",
      dimensions: "61 x 100 x 57 cm",
      warranty: "3 years",
      power: "3372W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "1 x 3 L"
    }
  },
  {
    id: "tern-gsd-s10-ofci",
    name: "Tern GSD S10 Cargo Bike",
    brand: "Tern",
    category: "Utility EVs",
    priceUsd: 5346,
    directUrl: "https://amwoodstore.com/products/48v-5000w-fat-tire-electric-bike",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "39187",
    roiScore: 94,
    specs: {
      weight: "140 kg",
      dimensions: "30 x 76 x 75 cm",
      warranty: "1 years",
      power: "2312W",
      motor_power: "358W",
      battery_capacity: "76V 25Ah",
      max_range: "up to 42 km"
    }
  },
  {
    id: "omtech-80w-co2-l2jx",
    name: "OMTech 80W CO2 Laser Cutter & Engraver",
    brand: "Omtech",
    category: "CNC & Laser Cutters",
    priceUsd: 3343,
    directUrl: "https://www.silhouetteamerica.com/en/silhouette-cameo-4",
    imageUrl: "/images/amazon/B07ABC5678.jpg",
    images: [
      "/images/amazon/B07ABC5678.jpg",
      "/images/amazon/B07ABC5678.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B07ABC5678",
    roiScore: 71,
    specs: {
      weight: "97 kg",
      dimensions: "79 x 87 x 30 cm",
      warranty: "5 years",
      power: "3976W",
      laser_power: "93W",
      working_area: "829 x 517 mm",
      cutting_speed: "up to 1422 mm/s"
    }
  },
  {
    id: "goal-zero-yeti-4uj0",
    name: "Goal Zero Yeti 6000X Lithium Power Station",
    brand: "Goal Zero",
    category: "Off-Grid Solar & Power",
    priceUsd: 5738,
    directUrl: "https://www.bluettipower.com/products/ac180",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 66,
    specs: {
      weight: "27 kg",
      dimensions: "61 x 50 x 78 cm",
      warranty: "2 years",
      power: "3328W",
      capacity: "8066 Wh",
      output: "6393W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "elegoo-jupiter-se-kbn5",
    name: "Elegoo Jupiter SE Pro Large Format 3D Printer",
    brand: "Elegoo",
    category: "3D Printers",
    priceUsd: 657,
    directUrl: "https://www.creality.com/products/k2-plus",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "97665",
    roiScore: 78,
    specs: {
      weight: "5 kg",
      dimensions: "144 x 84 x 40 cm",
      warranty: "2 years",
      power: "567W",
      build_volume: "217 x 128 x 350 mm",
      layer_height: "0.01 - 0.32 mm",
      nozzle_temp: "up to 279°C",
      print_speed: "up to 393 mm/s"
    }
  },
  {
    id: "parrot-anafi-usa-kq4k",
    name: "Parrot ANAFI USA Enterprise Drone",
    brand: "Parrot",
    category: "Thermal & Mapping Drones",
    priceUsd: 7965,
    directUrl: "https://www.dji.com/matrice-30",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 78,
    specs: {
      weight: "28 kg",
      dimensions: "34 x 49 x 39 cm",
      warranty: "2 years",
      power: "4621W",
      max_flight_time: "31 minutes",
      max_speed: "69 km/h",
      max_altitude: "5318 m"
    }
  },
  {
    id: "dji-avata-2-j86s",
    name: "DJI Avata 2 FPV Drone Combo",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1055,
    directUrl: "https://www.freeflysystems.com/alta-x",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "52504",
    roiScore: 89,
    specs: {
      weight: "15 kg",
      dimensions: "95 x 44 x 77 cm",
      warranty: "5 years",
      power: "1781W",
      max_flight_time: "46 minutes",
      max_speed: "49 km/h",
      max_altitude: "3968 m"
    }
  },
  {
    id: "bluetti-ac180-expandable-y4n4",
    name: "Bluetti AC180 Expandable Power Station",
    brand: "Bluetti",
    category: "Off-Grid Solar & Power",
    priceUsd: 1186,
    directUrl: "https://www.jackery.com/products/explorer-5000-plus",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "49006",
    roiScore: 81,
    specs: {
      weight: "101 kg",
      dimensions: "128 x 44 x 61 cm",
      warranty: "1 years",
      power: "2632W",
      capacity: "6771 Wh",
      output: "3628W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "super73-s2ez-electric-a5vf",
    name: "Super73 S2-EZ Electric Motorcycle",
    brand: "Super73",
    category: "Utility EVs",
    priceUsd: 1718,
    directUrl: "https://www.segway.com/na/en/navimow-h1500e.html",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "35722",
    roiScore: 81,
    specs: {
      weight: "32 kg",
      dimensions: "93 x 97 x 74 cm",
      warranty: "1 years",
      power: "3648W",
      motor_power: "360W",
      battery_capacity: "43V 11Ah",
      max_range: "up to 86 km"
    }
  },
  {
    id: "lectric-xp-30-w7ic",
    name: "Lectric XP 3.0 E-Bike",
    brand: "Lectric",
    category: "Utility EVs",
    priceUsd: 982,
    directUrl: "https://www.aventon.com/products/aventon-aventure-2",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 82,
    specs: {
      weight: "16 kg",
      dimensions: "143 x 96 x 31 cm",
      warranty: "5 years",
      power: "3619W",
      motor_power: "662W",
      battery_capacity: "50V 26Ah",
      max_range: "up to 176 km"
    }
  },
  {
    id: "aventon-aventure2-electric-rt8r",
    name: "Aventon Aventure.2 Electric Bike",
    brand: "Aventon",
    category: "Utility EVs",
    priceUsd: 2050,
    directUrl: "https://www.aventon.com/products/aventon-aventure-2",
    imageUrl: "/images/amazon/B09ABC5678.jpg",
    images: [
      "/images/amazon/B09ABC5678.jpg",
      "/images/amazon/B09ABC5678.jpg",
      "/images/amazon/B09ABC5678.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09ABC5678",
    roiScore: 82,
    specs: {
      weight: "10 kg",
      dimensions: "109 x 77 x 34 cm",
      warranty: "5 years",
      power: "1085W",
      motor_power: "850W",
      battery_capacity: "93V 21Ah",
      max_range: "up to 49 km"
    }
  },
  {
    id: "ecoflow-delta-pro-s9qc",
    name: "EcoFlow Delta Pro Ultra Hybrid Inverter",
    brand: "EcoFlow",
    category: "Off-Grid Solar & Power",
    priceUsd: 4322,
    directUrl: "https://www.goalzero.com/collections/yeti-power-stations/products/yeti-6000x",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "68876",
    roiScore: 80,
    specs: {
      weight: "10 kg",
      dimensions: "45 x 99 x 42 cm",
      warranty: "3 years",
      power: "4304W",
      capacity: "4579 Wh",
      output: "1197W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "rocket-espresso-appartamento-fwes",
    name: "Rocket Espresso Appartamento Dual Boiler",
    brand: "Rocket",
    category: "Prosumer Espresso",
    priceUsd: 3233,
    directUrl: "https://www.lamarzocco.com/linea-mini/",
    imageUrl: "/images/amazon/B09X4J5K2M.jpg",
    images: [
      "/images/amazon/B09X4J5K2M.jpg",
      "/images/amazon/B09X4J5K2M.jpg",
      "/images/amazon/B09X4J5K2M.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09X4J5K2M",
    roiScore: 78,
    specs: {
      weight: "8 kg",
      dimensions: "141 x 86 x 54 cm",
      warranty: "5 years",
      power: "1341W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 1 L"
    }
  },
  {
    id: "dji-mini-4-i9r2",
    name: "DJI Mini 4 Pro RC Night Fly More Combo",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1634,
    directUrl: "https://www.dji.com/avata-2",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "93315",
    roiScore: 91,
    specs: {
      weight: "78 kg",
      dimensions: "143 x 28 x 45 cm",
      warranty: "2 years",
      power: "868W",
      max_flight_time: "30 minutes",
      max_speed: "66 km/h",
      max_altitude: "2166 m"
    }
  },
  {
    id: "elegoo-jupiter-se-ki8x",
    name: "Elegoo Jupiter SE Pro Large Format 3D Printer",
    brand: "Elegoo",
    category: "3D Printers",
    priceUsd: 607,
    directUrl: "https://www.markforged.com/3d-printers/x7",
    imageUrl: "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "73332",
    roiScore: 71,
    specs: {
      weight: "147 kg",
      dimensions: "106 x 71 x 21 cm",
      warranty: "3 years",
      power: "4159W",
      build_volume: "295 x 325 x 145 mm",
      layer_height: "0.01 - 0.05 mm",
      nozzle_temp: "up to 358°C",
      print_speed: "up to 384 mm/s"
    }
  },
  {
    id: "anker-solix-f3800-u570",
    name: "Anker Solix F3800 Solar Generator",
    brand: "Anker",
    category: "Off-Grid Solar & Power",
    priceUsd: 4513,
    directUrl: "https://www.bluettipower.com/products/ac300-b300s",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "87403",
    roiScore: 80,
    specs: {
      weight: "71 kg",
      dimensions: "50 x 31 x 34 cm",
      warranty: "3 years",
      power: "4759W",
      capacity: "7057 Wh",
      output: "4375W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "anycubic-kobra-2-wnwg",
    name: "Anycubic Kobra 2 Combo 3D Printer",
    brand: "Anycubic",
    category: "3D Printers",
    priceUsd: 409,
    directUrl: "https://www.elegoo.com/products/jupiter-se-pro",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "46585",
    roiScore: 76,
    specs: {
      weight: "10 kg",
      dimensions: "74 x 49 x 37 cm",
      warranty: "2 years",
      power: "4482W",
      build_volume: "389 x 321 x 331 mm",
      layer_height: "0.01 - 0.22 mm",
      nozzle_temp: "up to 317°C",
      print_speed: "up to 639 mm/s"
    }
  },
  {
    id: "trotec-speedy-400-g9w7",
    name: "Trotec Speedy 400 Flex Laser Cutter",
    brand: "Trotec",
    category: "CNC & Laser Cutters",
    priceUsd: 23084,
    directUrl: "https://www.sculpfun.com/products/s30-pro",
    imageUrl: "/images/amazon/B07DEF9012.jpg",
    images: [
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg",
      "/images/amazon/B07DEF9012.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B07DEF9012",
    roiScore: 49,
    specs: {
      weight: "32 kg",
      dimensions: "35 x 25 x 62 cm",
      warranty: "3 years",
      power: "1545W",
      laser_power: "98W",
      working_area: "407 x 245 mm",
      cutting_speed: "up to 1570 mm/s"
    }
  },
  {
    id: "raise3d-pro3-plus-wxhy",
    name: "Raise3D Pro3 Plus Industrial 3D Printer",
    brand: "Raise3D",
    category: "3D Printers",
    priceUsd: 6235,
    directUrl: "https://www.raise3d.com/products/pro3-plus/",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "86928",
    roiScore: 57,
    specs: {
      weight: "148 kg",
      dimensions: "104 x 96 x 20 cm",
      warranty: "3 years",
      power: "4356W",
      build_volume: "179 x 368 x 295 mm",
      layer_height: "0.01 - 0.31 mm",
      nozzle_temp: "up to 239°C",
      print_speed: "up to 754 mm/s"
    }
  },
  {
    id: "synesso-cyncra-3group-mvod",
    name: "Synesso Cyncra 3-Group Espresso Machine",
    brand: "Synesso",
    category: "Prosumer Espresso",
    priceUsd: 30292,
    directUrl: "https://www.lelit.com/en/products/lelit-bianca-v3",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "61417",
    roiScore: 48,
    specs: {
      weight: "121 kg",
      dimensions: "28 x 65 x 69 cm",
      warranty: "5 years",
      power: "2317W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "3 x 2 L"
    }
  },
  {
    id: "ortur-laser-master-sdea",
    name: "Ortur Laser Master 2 5W Laser Engraver",
    brand: "Ortur",
    category: "CNC & Laser Cutters",
    priceUsd: 354,
    directUrl: "https://www.omtech.com/80w-co2-laser-cutter.html",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "64184",
    roiScore: 71,
    specs: {
      weight: "87 kg",
      dimensions: "65 x 46 x 62 cm",
      warranty: "2 years",
      power: "1897W",
      laser_power: "97W",
      working_area: "273 x 510 mm",
      cutting_speed: "up to 797 mm/s"
    }
  },
  {
    id: "tern-gsd-s10-rhim",
    name: "Tern GSD S10 Cargo Bike",
    brand: "Tern",
    category: "Utility EVs",
    priceUsd: 5672,
    directUrl: "https://super73.com/collections/s2-ez",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 91,
    specs: {
      weight: "85 kg",
      dimensions: "138 x 84 x 71 cm",
      warranty: "1 years",
      power: "668W",
      motor_power: "283W",
      battery_capacity: "59V 30Ah",
      max_range: "up to 181 km"
    }
  },
  {
    id: "omtech-80w-co2-7xol",
    name: "OMTech 80W CO2 Laser Cutter & Engraver",
    brand: "Omtech",
    category: "CNC & Laser Cutters",
    priceUsd: 3316,
    directUrl: "https://www.aeonlaser.com/nova-510",
    imageUrl: "/images/amazon/B08GHI3456.jpg",
    images: [
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08GHI3456",
    roiScore: 71,
    specs: {
      weight: "103 kg",
      dimensions: "105 x 41 x 27 cm",
      warranty: "2 years",
      power: "3432W",
      laser_power: "37W",
      working_area: "743 x 535 mm",
      cutting_speed: "up to 964 mm/s"
    }
  },
  {
    id: "eversys-la-germania-kdky",
    name: "Eversys La Germania Superautomatic",
    brand: "Eversys",
    category: "Prosumer Espresso",
    priceUsd: 5479,
    directUrl: "https://www.slayerespresso.com/steam-engine",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "31660",
    roiScore: 66,
    specs: {
      weight: "39 kg",
      dimensions: "139 x 94 x 55 cm",
      warranty: "5 years",
      power: "2244W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "1 x 1 L"
    }
  },
  {
    id: "elegoo-jupiter-se-28dq",
    name: "Elegoo Jupiter SE Pro Large Format 3D Printer",
    brand: "Elegoo",
    category: "3D Printers",
    priceUsd: 561,
    directUrl: "https://www.sonic3d.com/products/mini-8k",
    imageUrl: "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 70,
    specs: {
      weight: "95 kg",
      dimensions: "26 x 37 x 78 cm",
      warranty: "2 years",
      power: "700W",
      build_volume: "179 x 155 x 285 mm",
      layer_height: "0.01 - 0.48 mm",
      nozzle_temp: "up to 262°C",
      print_speed: "up to 576 mm/s"
    }
  },
  {
    id: "lelit-bianca-v3-67v1",
    name: "Lelit Bianca V3 PID Dual Boiler Espresso Machine",
    brand: "Lelit",
    category: "Prosumer Espresso",
    priceUsd: 2352,
    directUrl: "https://www.synesso.com/products/cyncra",
    imageUrl: "/images/amazon/B09TQH7J7L.jpg",
    images: [
      "/images/amazon/B09TQH7J7L.jpg",
      "/images/amazon/B09TQH7J7L.jpg",
      "/images/amazon/B09TQH7J7L.jpg",
      "/images/amazon/B09TQH7J7L.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09TQH7J7L",
    roiScore: 80,
    specs: {
      weight: "123 kg",
      dimensions: "70 x 93 x 61 cm",
      warranty: "3 years",
      power: "2969W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "3 x 3 L"
    }
  },
  {
    id: "dji-avata-2-9k5e",
    name: "DJI Avata 2 FPV Drone Combo",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 1063,
    directUrl: "https://www.autelrobotics.com/evo-ii-pro-v3",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "52194",
    roiScore: 84,
    specs: {
      weight: "144 kg",
      dimensions: "113 x 73 x 36 cm",
      warranty: "1 years",
      power: "3167W",
      max_flight_time: "52 minutes",
      max_speed: "64 km/h",
      max_altitude: "4821 m"
    }
  },
  {
    id: "bluetti-ac180-expandable-3dlm",
    name: "Bluetti AC180 Expandable Power Station",
    brand: "Bluetti",
    category: "Off-Grid Solar & Power",
    priceUsd: 1306,
    directUrl: "https://www.jackery.com/products/explorer-5000-plus",
    imageUrl: "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "58407",
    roiScore: 78,
    specs: {
      weight: "150 kg",
      dimensions: "39 x 87 x 34 cm",
      warranty: "2 years",
      power: "790W",
      capacity: "4699 Wh",
      output: "3652W",
      battery_chemistry: "LiFePO4"
    }
  },
  {
    id: "ecm-synchronika-pid-fyu8",
    name: "ECM Synchronika PID Dual Boiler Espresso Machine",
    brand: "ECM",
    category: "Prosumer Espresso",
    priceUsd: 4640,
    directUrl: "https://www.decentespresso.com/products/de1pro",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "13988",
    roiScore: 65,
    specs: {
      weight: "108 kg",
      dimensions: "150 x 66 x 63 cm",
      warranty: "2 years",
      power: "4415W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 3 L"
    }
  },
  {
    id: "freefly-alta-x-cecj",
    name: "Freefly Alta X Heavy Lift Drone",
    brand: "Freefly",
    category: "Thermal & Mapping Drones",
    priceUsd: 36373,
    directUrl: "https://www.dji.com/flir-mavic-3-thermal",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "98327",
    roiScore: 46,
    specs: {
      weight: "114 kg",
      dimensions: "67 x 74 x 80 cm",
      warranty: "3 years",
      power: "4350W",
      max_flight_time: "50 minutes",
      max_speed: "68 km/h",
      max_altitude: "3177 m"
    }
  },
  {
    id: "ortur-laser-master-vjtc",
    name: "Ortur Laser Master 2 5W Laser Engraver",
    brand: "Ortur",
    category: "CNC & Laser Cutters",
    priceUsd: 307,
    directUrl: "https://www.troteclaser.com/en-us/laser-machines/speedy-400",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "90917",
    roiScore: 77,
    specs: {
      weight: "91 kg",
      dimensions: "86 x 82 x 58 cm",
      warranty: "3 years",
      power: "1125W",
      laser_power: "9W",
      working_area: "328 x 258 mm",
      cutting_speed: "up to 1383 mm/s"
    }
  },
  {
    id: "dji-mavic-3-2jbn",
    name: "DJI Mavic 3 Thermal Imaging Drone",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 6268,
    directUrl: "https://www.dji.com/matrice-30",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "73363",
    roiScore: 91,
    specs: {
      weight: "57 kg",
      dimensions: "76 x 26 x 50 cm",
      warranty: "3 years",
      power: "1001W",
      max_flight_time: "25 minutes",
      max_speed: "85 km/h",
      max_altitude: "1840 m"
    }
  },
  {
    id: "rocket-espresso-appartamento-81uu",
    name: "Rocket Espresso Appartamento Dual Boiler",
    brand: "Rocket",
    category: "Prosumer Espresso",
    priceUsd: 2987,
    directUrl: "https://www.profitec-espresso.com/profitec-pro-700",
    imageUrl: "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "10638",
    roiScore: 68,
    specs: {
      weight: "102 kg",
      dimensions: "28 x 61 x 60 cm",
      warranty: "3 years",
      power: "1820W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "3 x 3 L"
    }
  },
  {
    id: "eversys-la-germania-a3oy",
    name: "Eversys La Germania Superautomatic",
    brand: "Eversys",
    category: "Prosumer Espresso",
    priceUsd: 5419,
    directUrl: "https://www.synesso.com/products/cyncra",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "32091",
    roiScore: 75,
    specs: {
      weight: "131 kg",
      dimensions: "48 x 27 x 45 cm",
      warranty: "2 years",
      power: "2623W",
      brew_pressure: "9 bar",
      temperature_stability: "±1°C",
      boiler: "2 x 2 L"
    }
  },
  {
    id: "segway-navimow-h1500e-bunp",
    name: "Segway Navimow H1500E Robotic Lawn Mower",
    brand: "Segway",
    category: "Utility EVs",
    priceUsd: 1565,
    directUrl: "https://super73.com/collections/s2-ez",
    imageUrl: "/images/amazon/B08GHI3456.jpg",
    images: [
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg",
      "/images/amazon/B08GHI3456.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B08GHI3456",
    roiScore: 89,
    specs: {
      weight: "78 kg",
      dimensions: "96 x 45 x 44 cm",
      warranty: "3 years",
      power: "1932W",
      motor_power: "855W",
      battery_capacity: "83V 16Ah",
      max_range: "up to 165 km"
    }
  },
  {
    id: "sonic-mini-8k-31w2",
    name: "Sonic Mini 8K Ultra HD Resin Printer",
    brand: "Sonic Simplified",
    category: "3D Printers",
    priceUsd: 287,
    directUrl: "https://www.sonic3d.com/products/mini-8k",
    imageUrl: "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "10254",
    roiScore: 75,
    specs: {
      weight: "21 kg",
      dimensions: "35 x 80 x 35 cm",
      warranty: "3 years",
      power: "2092W",
      build_volume: "163 x 152 x 248 mm",
      layer_height: "0.01 - 0.3 mm",
      nozzle_temp: "up to 243°C",
      print_speed: "up to 372 mm/s"
    }
  },
  {
    id: "anycubic-kobra-2-m5a3",
    name: "Anycubic Kobra 2 Combo 3D Printer",
    brand: "Anycubic",
    category: "3D Printers",
    priceUsd: 438,
    directUrl: "https://www.prusa3d.com/product/mk4-s/",
    imageUrl: "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=401&fit=crop"
    ],
    affiliateNetwork: "impact",
    merchantId: "82815",
    roiScore: 68,
    specs: {
      weight: "89 kg",
      dimensions: "85 x 54 x 60 cm",
      warranty: "1 years",
      power: "4513W",
      build_volume: "280 x 234 x 308 mm",
      layer_height: "0.01 - 0.05 mm",
      nozzle_temp: "up to 231°C",
      print_speed: "up to 293 mm/s"
    }
  },
  {
    id: "amwood-48v-5000w-2mjr",
    name: "Amwood 48V 5000W Fat Tire Electric Bike",
    brand: "Amwood",
    category: "Utility EVs",
    priceUsd: 1396,
    directUrl: "https://super73.com/collections/s2-ez",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=402&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=403&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "95457",
    roiScore: 82,
    specs: {
      weight: "99 kg",
      dimensions: "91 x 94 x 33 cm",
      warranty: "1 years",
      power: "4343W",
      motor_power: "681W",
      battery_capacity: "66V 30Ah",
      max_range: "up to 36 km"
    }
  },
  {
    id: "dji-fly-more-5dla",
    name: "DJI Fly More Combo RC Pro Enterprise",
    brand: "DJI",
    category: "Thermal & Mapping Drones",
    priceUsd: 2999,
    directUrl: "https://www.dji.com/avata-2",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "none",
    merchantId: "direct",
    roiScore: 76,
    specs: {
      weight: "108 kg",
      dimensions: "108 x 74 x 73 cm",
      warranty: "1 years",
      power: "3111W",
      max_flight_time: "42 minutes",
      max_speed: "50 km/h",
      max_altitude: "5394 m"
    }
  },
  {
    id: "ultimaker-s5-pro-21r6",
    name: "Ultimaker S5 Pro Bundle 3D Printer",
    brand: "Ultimaker",
    category: "3D Printers",
    priceUsd: 6128,
    directUrl: "https://www.elegoo.com/products/jupiter-se-pro",
    imageUrl: "/images/amazon/B09SVP4M7P.jpg",
    images: [
      "/images/amazon/B09SVP4M7P.jpg",
      "/images/amazon/B09SVP4M7P.jpg"
    ],
    affiliateNetwork: "amazon",
    merchantId: "B09SVP4M7P",
    roiScore: 68,
    specs: {
      weight: "75 kg",
      dimensions: "57 x 94 x 71 cm",
      warranty: "1 years",
      power: "2266W",
      build_volume: "260 x 196 x 248 mm",
      layer_height: "0.01 - 0.41000000000000003 mm",
      nozzle_temp: "up to 223°C",
      print_speed: "up to 531 mm/s"
    }
  },
  {
    id: "skydio-2-autonomous-a5x4",
    name: "Skydio 2+ Autonomous Camera Drone",
    brand: "Skydio",
    category: "Thermal & Mapping Drones",
    priceUsd: 2255,
    directUrl: "https://www.dji.com/mini-4-pro",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=402&fit=crop"
    ],
    affiliateNetwork: "awin",
    merchantId: "13219",
    roiScore: 72,
    specs: {
      weight: "15 kg",
      dimensions: "47 x 91 x 39 cm",
      warranty: "1 years",
      power: "3223W",
      max_flight_time: "57 minutes",
      max_speed: "82 km/h",
      max_altitude: "2324 m"
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
