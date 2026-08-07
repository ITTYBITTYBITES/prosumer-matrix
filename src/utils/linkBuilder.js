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
 * Builds a product link based on affiliate configuration with safe deep-link
 * encoding and robust fallback to clean direct URLs.
 *
 * @param {Object} product - Hardware product object with affiliateNetwork and merchantId
 * @param {string} [product.directUrl] - Canonical OEM or merchant product URL
 * @param {string} [product.affiliateUrl] - Pre-built affiliate destination URL
 * @param {string} [product.affiliateNetwork] - Affiliate network identifier (impact, awin, amazon, shareasale, none)
 * @param {string} [product.merchantId] - ASIN or network advertiser ID
 * @param {string} [product.impactCampaignId] - Impact campaign ID override
 * @param {string} [product.impactPublisherId] - Impact publisher ID override
 * @param {string} [product.awinMid] - Awin merchant ID override
 * @param {string} [product.awinAffid] - Awin publisher ID override
 * @param {string} [product.asin] - Amazon ASIN override
 * @param {string} [product.amazonTag] - Amazon Associate tag override
 * @param {string} [product.affiliateId] - General affiliate ID override
 * @returns {string} affiliate or clean direct destination URL
 */
export function buildProductLink(product) {
  if (!product || typeof product !== 'object') {
    return '#';
  }

  // Direct clean URL fallback if no affiliate structure exists
  if (!product.affiliateUrl && !product.affiliateNetwork && product.directUrl) {
    return cleanDestinationUrl(product.directUrl) || product.directUrl;
  }

  const destination = cleanDestinationUrl(product.directUrl) || (typeof product.directUrl === 'string' ? product.directUrl.trim() : '');
  const fallbackUrl = product.affiliateUrl || destination || product.directUrl || '#';

  if (!destination && !product.affiliateUrl && !product.directUrl) {
    return '#';
  }

  // A deliberate routing disable or an all-placeholder configuration must never
  // emit a malformed tracking URL.
  if (!AFFILIATE_CONFIG?.ENABLE_AFFILIATE_ROUTING || areAllIdsPlaceholder()) {
    return destination || fallbackUrl;
  }

  const network = (product.affiliateNetwork || '').trim().toLowerCase();

  // If no affiliate network or network is 'none' / 'direct'
  if (!network || network === 'none' || network === 'direct') {
    return destination || fallbackUrl;
  }

  switch (network) {
    case 'impact':
      return buildImpactLink(product, destination) || fallbackUrl;
    case 'awin':
      return buildAwinLink(product, destination) || fallbackUrl;
    case 'amazon':
      return buildAmazonLink(product, destination) || fallbackUrl;
    case 'shareasale':
      return buildShareASaleLink(product, destination) || fallbackUrl;
    default:
      return product.affiliateUrl || destination || fallbackUrl;
  }
}

/**
 * Handle Impact Radius deep-linking with URL encoding and fallback
 * @param {Object} product
 * @param {string} destination
 * @returns {string}
 */
function buildImpactLink(product, destination) {
  const target = destination || cleanDestinationUrl(product?.directUrl) || product?.directUrl;
  const campaignId = String(
    product?.impactCampaignId ||
    (product?.merchantId && product?.merchantId !== 'direct' ? product?.merchantId : '') ||
    '248631'
  ).trim();
  const affiliateId = String(
    product?.affiliateId ||
    product?.impactPublisherId ||
    AFFILIATE_CONFIG?.IMPACT_PUBLISHER_ID ||
    '7575765'
  ).trim();

  // Fallback if target is missing, or IDs are placeholder or invalid
  if (
    !target ||
    !campaignId ||
    campaignId === 'direct' ||
    campaignId.startsWith('PLACEHOLDER') ||
    !affiliateId ||
    affiliateId.startsWith('PLACEHOLDER')
  ) {
    return target || product?.affiliateUrl || '#';
  }

  const encodedCampaign = encodeURIComponent(campaignId);
  const encodedAffiliate = encodeURIComponent(affiliateId);
  const encodedTarget = encodeURIComponent(target);

  return `https://impact.com/c/${encodedCampaign}?affid=${encodedAffiliate}&u=${encodedTarget}`;
}

/**
 * Handle Awin deep-linking with URL encoding and fallback
 * @param {Object} product
 * @param {string} destination
 * @returns {string}
 */
function buildAwinLink(product, destination) {
  const target = destination || cleanDestinationUrl(product?.directUrl) || product?.directUrl;
  const merchantId = String(
    product?.awinMid ||
    (product?.merchantId && product?.merchantId !== 'direct' ? product?.merchantId : '') ||
    '46345'
  ).trim();
  const affiliateId = String(
    product?.affiliateId ||
    product?.awinAffid ||
    AFFILIATE_CONFIG?.AWIN_PUBLISHER_ID ||
    '3025417'
  ).trim();

  // Fallback if target is missing, or IDs are placeholder or invalid
  if (
    !target ||
    !merchantId ||
    merchantId === 'direct' ||
    merchantId.startsWith('PLACEHOLDER') ||
    !affiliateId ||
    affiliateId.startsWith('PLACEHOLDER')
  ) {
    return target || product?.affiliateUrl || '#';
  }

  const encodedMerchant = encodeURIComponent(merchantId);
  const encodedAffiliate = encodeURIComponent(affiliateId);
  const encodedTarget = encodeURIComponent(target);

  return `https://www.awin1.com/cread.php?awinmid=${encodedMerchant}&awinaffid=${encodedAffiliate}&ued=${encodedTarget}`;
}

/**
 * Handle Amazon Associates linking with ASIN and tag encoding and fallback
 * @param {Object} product
 * @param {string} destination
 * @returns {string}
 */
function buildAmazonLink(product, destination) {
  const target = destination || cleanDestinationUrl(product?.directUrl) || product?.directUrl;
  const asin = String(product?.asin || product?.merchantId || '').trim();
  const tag = String(product?.amazonTag || AFFILIATE_CONFIG?.AMAZON_TAG || 'prosumatrix-20').trim();

  // Fallback if ASIN or tag is missing, 'direct', or placeholder
  if (
    !asin ||
    asin === 'direct' ||
    asin.startsWith('PLACEHOLDER') ||
    !tag ||
    tag.startsWith('PLACEHOLDER')
  ) {
    return target || product?.affiliateUrl || '#';
  }

  return `https://www.amazon.com/dp/${encodeURIComponent(asin)}/?tag=${encodeURIComponent(tag)}`;
}

/**
 * Handle ShareASale linking with URL encoding and fallback
 * @param {Object} product
 * @param {string} destination
 * @returns {string}
 */
function buildShareASaleLink(product, destination) {
  const target = destination || cleanDestinationUrl(product?.directUrl) || product?.directUrl;
  const merchantId = String(product?.shareasaleMerchantId || product?.merchantId || '').trim();
  const userId = String(product?.affiliateId || product?.shareasaleUserId || AFFILIATE_CONFIG?.SHAREASALE_USER_ID || '').trim();

  if (
    !target ||
    !merchantId ||
    merchantId === 'direct' ||
    merchantId.startsWith('PLACEHOLDER') ||
    !userId ||
    userId.startsWith('PLACEHOLDER')
  ) {
    return target || product?.affiliateUrl || '#';
  }

  const encodedMerchant = encodeURIComponent(merchantId);
  const encodedUser = encodeURIComponent(userId);
  const encodedTarget = encodeURIComponent(target);

  return `https://shareasale.com/r.cfm?b=${encodedMerchant}&u=${encodedUser}&m=${encodedMerchant}&urllink=${encodedTarget}`;
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
    shareasale: 'ShareASale',
    none: 'Direct'
  };

  return names[network?.toLowerCase()] || 'Direct';
}

/** @returns {boolean} */
export function isAffiliateRoutingActive() {
  return !areAllIdsPlaceholder() && Boolean(AFFILIATE_CONFIG?.ENABLE_AFFILIATE_ROUTING);
}
