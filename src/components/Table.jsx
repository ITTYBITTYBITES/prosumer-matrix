// ============================================================================
// MATRIX TABLE COMPONENT
// ============================================================================

import { buildProductLink } from '../utils/linkBuilder.js';
import { getImageUrl, getProductImageFallback } from '../utils/imageProxy.js';
import { formatCurrency, formatSpecKey, formatSpecValue } from '../utils/formatUtils.js';

export function Table({
  products = [],
  sortColumn = 'name',
  sortDirection = 'asc'
} = {}) {
  return { products, sortColumn, sortDirection };
}

export function renderTableHtml(products = [], sortColumn = 'name', sortDirection = 'asc') {
  if (products.length === 0) {
    return `
      <div class="matrix-table-wrapper">
        <table class="matrix-table">
          <tbody>
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
          </tbody>
        </table>
      </div>
    `;
  }

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
                  <svg class="sort-arrow ${sortColumn === 'name' ? 'active' : ''} ${sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M19 12l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
            </th>
            <th class="th-brand" scope="col">
              <div class="th-content">
                <button type="button" class="th-sort-btn" data-column="brand" aria-label="Sort by brand">
                  Brand
                  <svg class="sort-arrow ${sortColumn === 'brand' ? 'active' : ''} ${sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                  <svg class="sort-arrow ${sortColumn === 'priceUsd' ? 'active' : ''} ${sortDirection === 'desc' ? 'desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          ${products.map(product => {
            const productLink = buildProductLink(product);
            const rawList = Array.isArray(product.images) && product.images.length > 0
              ? product.images
              : (product.imageUrl ? [product.imageUrl] : []);
            const firstImage = rawList[0] || product.imageUrl;
            const imageUrl = getImageUrl(firstImage, 80) || firstImage;
            const imageFallback = getProductImageFallback(product);

            return `
              <tr class="matrix-row" data-id="${product.id}" data-category="${product.category}">
                <td class="td-product" data-action="specs" title="Click to view full specifications">
                  <div class="product-cell">
                    <div class="product-thumbnail">
                      <img
                        src="${imageUrl}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.alt='';this.src='${imageFallback}';this.className='max-w-full max-h-full object-contain pointer-events-none';"
                        class="product-image"
                      >
                    </div>
                    <div class="product-info">
                      <h3 class="product-name">${product.name}</h3>
                      <span class="product-brand">${product.brand}</span>
                    </div>
                  </div>
                </td>
                <td class="td-brand">${product.brand}</td>
                <td class="td-specs" data-action="specs" title="Click to view full specifications">
                  <div class="specs-preview">
                    ${product.specs && Object.entries(product.specs).slice(0, 3).map(([key, val]) => `
                      <div class="spec-item">
                        <span class="spec-label">${formatSpecKey(key)}:</span>
                        <span class="spec-val">${formatSpecValue(val)}</span>
                      </div>
                    `).join('')}
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
                      aria-label="View ${product.name} in a new tab"
                    >
                      View Item →
                    </a>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export default Table;
