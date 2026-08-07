// ============================================================================
// LINK BUILDER UTILITIES
// ============================================================================
// Constructs affiliate and direct product URLs based on configuration
// Supports: Amazon, Impact, Awin (includes former ShareASale merchants)
// ============================================================================

import { AFFILIATE_CONFIG, areAllIdsPlaceholder } from '../config/affiliates.js';

/**
 * Builds a product link based on affiliate configuration.
 *
 * - If all affiliate IDs are placeholders, safely degrades to directUrl
 * - If valid IDs exist, constructs affiliate deep-link URLs
 *
 * @param {Object} item - Hardware product object with affiliateNetwork and merchantId
 * @param {string} item.directUrl - Direct OEM URL
 * @param {string} item.affiliateNetwork - Affiliate network identifier
 * @param {string} item.merchantId - Merchant ID for affiliate network
 * @param {string} [item.amazonAsin] - Optional Amazon ASIN
 * @returns {string} - Product URL (affiliate or direct)
 */
export function buildProductLink(item) {
  // Check if affiliate routing is disabled or all IDs are placeholders
  if (!AFFILIATE_CONFIG.ENABLE_AFFILIATE_ROUTING || areAllIdsPlaceholder()) {
    return item.directUrl || '#';
  }

  const network = (item.affiliateNetwork || '').toLowerCase();

  switch (network) {
    case 'impact':
      return buildImpactLink(item);
    case 'awin':
      return buildAwinLink(item);
    case 'amazon':
      return buildAmazonLink(item);
    default:
      return item.directUrl || '#';
  }
}

/**
 * Builds an Impact.com affiliate deep link.
 *
 * @param {Object} item - Product object
 * @returns {string} - Impact affiliate URL
 */
function buildImpactLink(item) {
  const { IMPACT_PUBLISHER_ID } = AFFILIATE_CONFIG;
  const merchantId = encodeURIComponent(item.merchantId || '');
  const publisherId = encodeURIComponent(IMPACT_PUBLISHER_ID);
  const destination = encodeURIComponent(item.directUrl || '');

  // Keep the OEM destination as one encoded query value. Passing an unencoded
  // URL here truncates it at its first "&" or query parameter.
  return `https://impact.com/c/${merchantId}?affid=${publisherId}&u=${destination}`;
}

/**
 * Builds an Awin affiliate deep link.
 *
 * @param {Object} item - Product object
 * @returns {string} - Awin affiliate URL
 */
function buildAwinLink(item) {
  const { AWIN_PUBLISHER_ID } = AFFILIATE_CONFIG;
  const merchantId = encodeURIComponent(item.merchantId || '');
  const publisherId = encodeURIComponent(AWIN_PUBLISHER_ID);
  const destination = encodeURIComponent(item.directUrl || '');

  // awinmid identifies the advertiser, awinaffid identifies this publisher,
  // and ued contains the final merchant URL. Encoding ued is required when a
  // manufacturer URL contains its own query string or ampersands.
  return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${publisherId}&ued=${destination}`;
}

/**
 * Builds an Amazon Associates affiliate link.
 * Format: https://www.amazon.com/dp/{ASIN}/?tag={amazonTag}
 *
 * @param {Object} item - Product object with optional amazonAsin
 * @returns {string} - Amazon affiliate URL
 */
function buildAmazonLink(item) {
  const { AMAZON_TAG } = AFFILIATE_CONFIG;

  // Use dedicated ASIN if provided, otherwise try to extract from merchantId or directUrl
  let asin = item.amazonAsin;

  if (!asin && item.merchantId) {
    // merchantId might be the ASIN
    asin = item.merchantId;
  }

  if (!asin) {
    // Try to extract ASIN from directUrl
    const url = new URL(item.directUrl || '');
    const pathParts = url.pathname.split('/');
    for (const part of pathParts) {
      if (/^[B][0-9A-Z]{9}$/.test(part)) {
        asin = part;
        break;
      }
    }
  }

  // Fallback: use merchantId as ASIN
  if (!asin) {
    asin = item.merchantId || 'UNKNOWN';
  }

  const url = `https://www.amazon.com/dp/${asin}/?tag=${AMAZON_TAG}`;

  return url;
}

/**
 * Gets the display name for an affiliate network.
 *
 * @param {string} network - Network identifier
 * @returns {string} - Human-readable network name
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

/**
 * Determines if affiliate routing is currently active.
 *
 * @returns {boolean} - True if affiliate links will be generated
 */
export function isAffiliateRoutingActive() {
  return !areAllIdsPlaceholder() && AFFILIATE_CONFIG.ENABLE_AFFILIATE_ROUTING;
}
