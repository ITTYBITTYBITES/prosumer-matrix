// ============================================================================
// SPECS MODAL UTILITIES & RENDERER (Vanilla JS)
// ============================================================================

import { getImageUrl, getProductImageFallback } from '../utils/imageProxy.js';
import { buildProductLink, getNetworkDisplayName } from '../utils/linkBuilder.js';
import { formatCurrency, formatSpecKey, formatSpecValue } from '../utils/formatUtils.js';

/**
 * Render the HTML content for the Specs Modal (Vanilla JS)
 * @param {Object} product - Hardware product data
 * @returns {string} HTML string
 */
export function renderSpecsModalContent(product) {
  if (!product) return '';

  const rawList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);
  const firstImage = rawList[0] || product.imageUrl;
  const imageFallback = getProductImageFallback(product);
  const productLink = buildProductLink(product);
  const networkName = getNetworkDisplayName(product.affiliateNetwork);

  const specsHtml = product.specs && Object.keys(product.specs).length > 0
    ? Object.entries(product.specs).map(([key, value]) => `
      <div class="specs-row">
        <span class="specs-key">${escapeHtml(formatSpecKey(key))}</span>
        <span class="specs-value">${escapeHtml(formatSpecValue(value))}</span>
      </div>
    `).join('')
    : '<p class="no-specs">No specifications available</p>';

  // Multi-image Carousel or single hero image
  const hasCarousel = rawList.length > 1;
  const carouselHtml = hasCarousel
    ? `
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
              class="specs-thumb-btn ${idx === 0 ? 'active' : ''}"
              data-img-src="${getImageUrl(img, 400) || img}"
              aria-label="View thumbnail ${idx + 1}"
            >
              <img src="${getImageUrl(img, 100) || img}" alt="Thumb ${idx + 1}" onerror="this.onerror=null;this.src='${imageFallback}';">
            </button>
          `).join('')}
        </div>
      </div>
    `
    : '';

  const heroHtml = !hasCarousel
    ? `
      <div class="specs-hero-image">
        <img
          src="${getImageUrl(firstImage, 360) || firstImage}"
          alt="${escapeHtml(product.name)}"
          onerror="this.onerror=null;this.src='${imageFallback}';"
          class="specs-image"
        >
      </div>
    `
    : '';

  return `
    ${carouselHtml}
    <div class="specs-header">
      ${heroHtml}
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
          <span class="roi-value">${product.roiScore || 'N/A'}/100</span>
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
  if (typeof text !== 'string') return String(text ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export {
  formatSpecKey,
  formatSpecValue
};

export default {
  renderSpecsModalContent,
  formatSpecKey,
  formatSpecValue
};
