// ============================================================================
// LINK BUILDER UTILITIES
// ============================================================================
// Constructs clean affiliate and direct product URLs using the publisher
// credentials configured in src/config/affiliates.js.
// ============================================================================

import { AFFILIATE_CONFIG, areAllIdsPlaceholder } from '../config/affiliates.js';

/**
 * Removes query/hash tracking data and normalizes the path of a destination URL.
 *
 * Affiliate platforms treat the destination as a single query-string value. A
 * canonical, parameter-free URL prevents nested tracking parameters from being
 * truncated or interpreted as parameters for the affiliate network.
 *
 * @param {string} url
 * @returns {string} canonical HTTP(S) destination, or an empty string
 */
export function cleanDestinationUrl(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return '';
  }

  try {
    const destination = new URL(url.trim());
    if (!['http:', 'https:'].includes(destination.protocol)) {
      return '';
    }

    // Product URLs in this dataset are canonical page paths. Discard all query
    // parameters (including utm_*, click IDs, and stale store variants) and
    // fragments rather than passing one network's parameters into another.
    destination.search = '';
    destination.hash = '';

    // Normalize non-root trailing slashes while preserving an origin's root.
    destination.pathname = destination.pathname.replace(/\/+$/, '') || '/';

    return destination.toString();
  } catch {
    return '';
  }
}

/**
 * Builds a product link based on affiliate configuration.
 *
 * @param {Object} product - Hardware product object with affiliateNetwork and merchantId
 * @param {string} product.directUrl - Canonical OEM or merchant product URL
 * @param {string} product.affiliateNetwork - Affiliate network identifier
 * @param {string} product.merchantId - ASIN or network advertiser ID
 * @returns {string} affiliate or clean direct destination URL
 */
export function buildProductLink(product) {
  const destination = cleanDestinationUrl(product?.directUrl);
  if (!destination) {
    return '#';
  }

  // A deliberate routing disable or an all-placeholder configuration must never
  // emit a malformed tracking URL.
  if (!AFFILIATE_CONFIG.ENABLE_AFFILIATE_ROUTING || areAllIdsPlaceholder()) {
    return destination;
  }

  switch ((product?.affiliateNetwork || '').toLowerCase()) {
    case 'impact':
      return buildImpactLink(product, destination);
    case 'awin':
      return buildAwinLink(product, destination);
    case 'amazon':
      return buildAmazonLink(product);
    default:
      return destination;
  }
}

/** @param {Object} product @param {string} destination @returns {string} */
function buildImpactLink(product, destination) {
  const merchantId = encodeURIComponent(product.merchantId || '');
  const affiliateId = encodeURIComponent(AFFILIATE_CONFIG.IMPACT_PUBLISHER_ID);

  return `https://impact.com/c/${merchantId}?affid=${affiliateId}&u=${encodeURIComponent(destination)}`;
}

/** @param {Object} product @param {string} destination @returns {string} */
function buildAwinLink(product, destination) {
  const merchantId = encodeURIComponent(product.merchantId || '');
  const affiliateId = encodeURIComponent(AFFILIATE_CONFIG.AWIN_PUBLISHER_ID);

  return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${affiliateId}&ued=${encodeURIComponent(destination)}`;
}

/** @param {Object} product @returns {string} */
function buildAmazonLink(product) {
  const asin = String(product?.merchantId || '').trim();
  const tag = encodeURIComponent(AFFILIATE_CONFIG.AMAZON_TAG);

  // Keep the generated path deterministic and leave ASIN validation to the
  // benchmark verifier, which can identify bad dataset records explicitly.
  return `https://www.amazon.com/dp/${encodeURIComponent(asin)}/?tag=${tag}`;
}

/**
 * Gets the display name for an affiliate network.
 * @param {string} network
 * @returns {string}
 */
export function getNetworkDisplayName(network) {
  const names = {
    impact: 'Impact',
    awin: 'Awin',
    amazon: 'Amazon',
    none: 'Direct'
  };

  return names[network?.toLowerCase()] || 'Direct';
}

/** @returns {boolean} */
export function isAffiliateRoutingActive() {
  return !areAllIdsPlaceholder() && AFFILIATE_CONFIG.ENABLE_AFFILIATE_ROUTING;
}
