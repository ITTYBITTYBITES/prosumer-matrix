// ============================================================================
// IMAGE CAROUSEL COMPONENT
// ============================================================================
// Handles mobile touch swiping, desktop arrow controls, thumbnail indicator dots,
// aspect-ratio containment (object-contain), and SVG error fallbacks.
// ============================================================================

import { getImageUrl, getProductImageFallback } from '../utils/imageProxy.js';

/**
 * ImageCarousel factory / helper
 */
export function ImageCarousel({
  images = [],
  imageUrl = '',
  title = '',
  brand = '',
  category = '',
  onOpenModal = () => {}
} = {}) {
  const rawList = Array.isArray(images) && images.length > 0
    ? images
    : (imageUrl ? [imageUrl] : []);
  const imageList = rawList.length > 0 ? rawList : ['#placeholder'];

  return {
    imageList,
    title,
    brand,
    category,
    onOpenModal
  };
}

/**
 * Generates the SVG fallback markup for failed image loads.
 * Uses a fixed viewBox with `preserveAspectRatio="xMidYMid meet"` so the
 * vector icon and labels scale uniformly inside any card container —
 * the glyphs never clip at the edges nor overlap the icon.
 * @param {string} brand
 * @param {string} category
 * @returns {string} Data URI SVG
 */
export function getCarouselFallbackSvg(brand = '', category = '') {
  const brandLabel = truncateLabel(brand || 'Hardware', 26);
  const categoryLabel = truncateLabel(category || 'Product', 34);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeXml(brandLabel)} ${escapeXml(categoryLabel)}">
    <rect width="100%" height="100%" fill="#0f172a"/>
    <circle cx="150" cy="75" r="24" fill="#1e293b"/>
    <path d="M142 75l16 0m-8 -8l0 16" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
    <text x="50%" y="125" dominant-baseline="middle" text-anchor="middle" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">${escapeXml(brandLabel)}</text>
    <text x="50%" y="148" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">${escapeXml(categoryLabel)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Attaches a delegated error listener that swaps any failed product image
 * for the brand/category SVG fallback. Uses the capture phase because the
 * `error` event does not bubble, and a `data-fallback-applied` guard so a
 * failing fallback can never re-trigger an infinite swap loop.
 * @param {HTMLElement} root - Container that holds the rendered carousels
 * @returns {void}
 */
export function attachCarouselImageFallback(root) {
  if (!root || typeof root.addEventListener !== 'function') return;

  root.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;

    img.dataset.fallbackApplied = 'true';
    const brand = img.dataset.brand || '';
    const category = img.dataset.category || '';
    img.src = getCarouselFallbackSvg(brand, category);
  }, true);
}

/**
 * HTML renderer for Image Carousel
 * @param {Object} product
 * @param {number} [activeIdx=0]
 * @returns {string} HTML string
 */
export function renderImageCarouselHtml(product, activeIdx = 0) {
  if (!product) return '';

  const rawList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);

  const imageList = rawList.length > 0 ? rawList : ['#placeholder'];
  const currentIndex = Math.min(Math.max(0, activeIdx), imageList.length - 1);
  const currentSrc = imageList[currentIndex];
  const title = product.name || 'Hardware';
  const category = product.category || 'Product';

  const dotsHtml = imageList.length > 1
    ? `
      <div class="carousel-dots" data-product-id="${product.id}">
        ${imageList.map((_, idx) => `
          <button
            type="button"
            class="carousel-dot ${idx === currentIndex ? 'active' : ''}"
            data-carousel-action="dot"
            data-index="${idx}"
            data-product-id="${product.id}"
            aria-label="Go to slide ${idx + 1}"
          ></button>
        `).join('')}
      </div>
    `
    : '';

  const arrowsHtml = imageList.length > 1
    ? `
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
    `
    : '';

  return `
    <div
      class="image-carousel"
      data-product-id="${product.id}"
      data-current-index="${currentIndex}"
      data-total-images="${imageList.length}"
    >
      <div
        class="carousel-display"
        data-action="specs"
        data-product-id="${product.id}"
        title="Click to view full specifications"
      >
        <img
          src="${getImageUrl(currentSrc, 400) || currentSrc}"
          alt="${escapeXml(title)} view ${currentIndex + 1}"
          loading="lazy"
          data-brand="${escapeXml(product.brand || '')}"
          data-category="${escapeXml(product.category || '')}"
          class="carousel-img"
        >
        <span class="mobile-category-badge">${escapeXml(category)}</span>
      </div>
      ${arrowsHtml}
      ${dotsHtml}
    </div>
  `;
}

function escapeXml(text) {
  if (typeof text !== 'string') return String(text ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function truncateLabel(value, maxLength) {
  const text = String(value ?? '');
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export default ImageCarousel;
