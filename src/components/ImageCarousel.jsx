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
 * Generates the SVG fallback markup for failed image loads
 * @param {string} brand
 * @param {string} category
 * @returns {string} Data URI SVG
 */
export function getCarouselFallbackSvg(brand = '', category = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
    <rect width="100%" height="100%" fill="#0f172a"/>
    <circle cx="150" cy="80" r="28" fill="#1e293b"/>
    <text x="50%" y="130" dominant-baseline="middle" text-anchor="middle" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">${escapeXml(brand || 'Hardware')}</text>
    <text x="50%" y="152" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="sans-serif">${escapeXml(category || 'Product')}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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
  const imageFallback = getCarouselFallbackSvg(product.brand, product.category);
  const title = product.name || 'Hardware';
  const brand = product.brand || 'Prosumer';
  const category = product.category || 'Product';

  const dotsHtml = imageList.length > 1
    ? `
      <div class="carousel-dots absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-auto" data-product-id="${product.id}">
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
          onerror="this.onerror=null;this.src='${imageFallback}';"
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
  if (typeof text !== 'string') return String(text ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default ImageCarousel;
