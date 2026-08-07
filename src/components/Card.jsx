// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

import { buildProductLink } from '../utils/linkBuilder.js';
import { formatCurrency, formatSpecKey, formatSpecValue } from '../utils/formatUtils.js';
import { renderImageCarouselHtml } from './ImageCarousel.jsx';

export function Card({ product, onSelectProduct } = {}) {
  return {
    render: () => renderCardHtml(product)
  };
}

export function renderCardHtml(product) {
  if (!product) return '';
  const productLink = buildProductLink(product);
  const carouselHtml = renderImageCarouselHtml(product, 0);

  return `
    <div class="mobile-card" data-id="${product.id}">
      <div class="mobile-card-image">
        ${carouselHtml}
      </div>
      <div class="mobile-card-body">
        <h3 class="mobile-card-title cursor-pointer" data-action="specs" data-id="${product.id}">${product.name}</h3>
        <p class="mobile-card-brand">${product.brand}</p>

        <div class="mobile-card-specs" data-action="specs" data-id="${product.id}">
          ${product.specs && Object.entries(product.specs).slice(0, 2).map(([key, val]) => `
            <div class="mobile-spec">
              <span class="mobile-spec-label">${formatSpecKey(key)}</span>
              <span class="mobile-spec-value">${formatSpecValue(val)}</span>
            </div>
          `).join('')}
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
            aria-label="View full specifications for ${product.name}"
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
            aria-label="View ${product.name} in a new tab"
          >
            View Item →
          </a>
        </div>
      </div>
    </div>
  `;
}

export default Card;
