// ============================================================================
// IMAGE PROXY UTILITIES
// ============================================================================
// Provides image URL wrapping for optimized delivery and fallback SVGs
// ============================================================================

/**
 * Builds a self-contained vector card for a product image that failed to load.
 * The SVG is data-URI encoded so it works without another network request and
 * always identifies the exact brand and model the visitor was trying to view.
 *
 * @param {{brand?: string, name?: string}} product
 * @returns {string}
 */
export function getProductImageFallback(product = {}) {
  const brand = truncateLabel(product.brand || 'Prosumer Matrix', 26);
  const model = truncateLabel(product.name || 'Image unavailable', 34);
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
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Wraps an image URL with the Weserv image proxy service for optimization.
 *
 * @param {string} rawUrl - The original image URL
 * @param {number} width - Desired width in pixels (default: 400)
 * @returns {string} - Optimized image URL via Weserv proxy
 */
export function getImageUrl(rawUrl, width = 400) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '';
  }

  // If it's a local image path, just return it directly.
  // GitHub Pages will resolve relative to the root if we use the correct base path.
  if (rawUrl.startsWith('/images/')) {
    // Prefix with the Vite base URL or the repo name for GitHub Pages
    const baseUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.BASE_URL : '/prosumer-matrix/';
    return `${baseUrl.replace(/\/$/, '')}${rawUrl}`;
  }

  // Ensure we have a valid URL
  try {
    new URL(rawUrl);
  } catch {
    return '';
  }

  const encodedUrl = encodeURIComponent(rawUrl);
  const height = Math.round(width * 1); // Maintain aspect ratio
  const baseUrl = 'https://images.weserv.nl/';

  return `${baseUrl}?url=${encodedUrl}&w=${width}&h=${height}&output=webp&q=85`;
}

/**
 * Returns an inline SVG data URI for a category as a fallback icon.
 * Used when images fail to load.
 *
 * @param {string} category - The product category name
 * @returns {string} - Data URI containing inline SVG
 */
export function getCategorySvgFallback(category) {
  const iconMap = {
    '3D Printers': get3dPrinterSvg(),
    'CNC & Laser Cutters': getLaserCutterSvg(),
    'Off-Grid Solar & Power': getSolarSvg(),
    'Thermal & Mapping Drones': getDroneSvg(),
    'Prosumer Espresso': getEspressoSvg(),
    'Utility EVs': getEvmSvg()
  };

  return iconMap[category] || iconMap['3D Printers'];
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
