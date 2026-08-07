// ============================================================================
// FORMAT UTILITIES
// ============================================================================
// Clean formatting for prices, currencies, and technical specifications
// ============================================================================

/**
 * Format price range as "$XXX - $X,XXX" without duplicate currency symbols
 * @param {Array<Object|number>} products - List of product items or prices
 * @returns {string} Clean formatted price range
 */
export function formatPriceRange(products = []) {
  if (!products || products.length === 0) {
    return '$0';
  }

  const prices = products
    .map(p => (typeof p === 'number' ? p : p?.priceUsd))
    .filter(p => typeof p === 'number' && !isNaN(p) && p >= 0);

  if (prices.length === 0) {
    return '$0';
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return `$${min.toLocaleString()}`;
  }

  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

/**
 * Format currency amount cleanly
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Format spec key to Title Case
 * @param {string} key
 * @returns {string}
 */
export function formatSpecKey(key) {
  if (!key) return '';
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Format spec value cleanly
 * @param {any} value
 * @returns {string}
 */
export function formatSpecValue(value) {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export default {
  formatPriceRange,
  formatCurrency,
  formatSpecKey,
  formatSpecValue
};
