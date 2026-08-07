import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildProductLink,
  isAffiliateRoutingActive
} from './src/utils/linkBuilder.js';
import { AFFILIATE_CONFIG } from './src/config/affiliates.js';

// Resolve current directory for ES Module compatibility.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hardwarePath = path.join(__dirname, 'src/data/hardware.json');
const products = JSON.parse(fs.readFileSync(hardwarePath, 'utf8'));

const REQUEST_TIMEOUT_MS = Number.parseInt(
  process.env.VERIFY_LINKS_TIMEOUT_MS || '15000',
  10
);
const REQUEST_CONCURRENCY = Math.max(
  1,
  Number.parseInt(process.env.VERIFY_LINKS_CONCURRENCY || '8', 10)
);

/**
 * Cancels a response body so a GET fallback does not retain an image in memory.
 * @param {Response} response
 */
async function discardBody(response) {
  try {
    await response.body?.cancel();
  } catch {
    // The body may already have been consumed or closed. That is safe to ignore.
  }
}

/**
 * Makes one image request and returns a normalized result rather than throwing.
 * @param {string} imageUrl
 * @param {'HEAD' | 'GET'} method
 */
async function requestImage(imageUrl, method) {
  try {
    const response = await fetch(imageUrl, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent': 'Prosumer-Matrix-Link-Validator/1.0'
      }
    });

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const isImage = contentType.startsWith('image/');
    const status = response.status;
    await discardBody(response);

    if (status === 200 && isImage) {
      return { ok: true, method, status, contentType };
    }

    const reason = status !== 200
      ? `HTTP ${status}`
      : `expected an image content type, received ${contentType || 'none'}`;

    return { ok: false, method, status, contentType, reason };
  } catch (error) {
    const isTimeout = error?.name === 'TimeoutError';
    return {
      ok: false,
      method,
      status: null,
      contentType: '',
      reason: isTimeout ? `request timed out after ${REQUEST_TIMEOUT_MS}ms` : error.message
    };
  }
}

/**
 * Checks an image by HEAD first. Some CDNs disallow HEAD, so a GET request is
 * attempted whenever HEAD is not a successful image response.
 * @param {string} imageUrl
 */
async function checkImage(imageUrl) {
  try {
    const parsed = new URL(imageUrl);
    if (parsed.protocol !== 'https:') {
      return { ok: false, method: 'NONE', status: null, reason: 'image URL must use HTTPS' };
    }
  } catch {
    return { ok: false, method: 'NONE', status: null, reason: 'invalid image URL' };
  }

  const headResult = await requestImage(imageUrl, 'HEAD');
  if (headResult.ok) return headResult;

  const getResult = await requestImage(imageUrl, 'GET');
  if (getResult.ok) return { ...getResult, usedGetFallback: true };

  return {
    ...getResult,
    reason: `${getResult.reason}; HEAD fallback: ${headResult.reason}`
  };
}

/**
 * Executes async work with a bounded concurrency, avoiding a request burst for
 * a dataset with hundreds of unique image hosts.
 */
async function mapWithConcurrency(items, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await callback(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(REQUEST_CONCURRENCY, items.length) }, worker)
  );

  return results;
}

/**
 * Ensures the direct OEM URL is valid and that the generated affiliate route
 * preserves it as an encoded deep-link destination.
 * @param {object} product
 */
function validateRouting(product) {
  let directUrl;
  let generatedUrl;

  try {
    directUrl = new URL(product.directUrl);
  } catch {
    return `invalid directUrl: ${product.directUrl}`;
  }

  if (directUrl.protocol !== 'https:') {
    return `directUrl must use HTTPS: ${product.directUrl}`;
  }

  try {
    generatedUrl = new URL(buildProductLink(product));
  } catch {
    return 'link builder returned an invalid URL';
  }

  // With affiliate routing disabled, every record should safely use its OEM URL.
  if (!isAffiliateRoutingActive()) {
    return generatedUrl.href === directUrl.href
      ? null
      : 'affiliate routing is disabled but the generated URL differs from directUrl';
  }

  switch (product.affiliateNetwork) {
    case 'amazon':
      if (generatedUrl.origin !== 'https://www.amazon.com') {
        return 'Amazon route has an unexpected host';
      }
      if (!generatedUrl.pathname.includes(`/dp/${product.merchantId}/`)) {
        return 'Amazon route does not contain the configured ASIN';
      }
      return generatedUrl.searchParams.get('tag') === AFFILIATE_CONFIG.AMAZON_TAG
        ? null
        : 'Amazon route is missing the configured associate tag';

    case 'awin':
      if (generatedUrl.origin !== 'https://www.awin1.com') {
        return 'Awin route has an unexpected host';
      }
      if (generatedUrl.searchParams.get('awinmid') !== product.merchantId) {
        return 'Awin route does not contain the configured advertiser ID';
      }
      if (generatedUrl.searchParams.get('awinaffid') !== AFFILIATE_CONFIG.AWIN_PUBLISHER_ID) {
        return 'Awin route is missing the configured publisher ID';
      }
      return generatedUrl.searchParams.get('ued') === product.directUrl
        ? null
        : 'Awin route is missing the encoded directUrl destination';

    case 'impact':
      if (generatedUrl.origin !== 'https://impact.com') {
        return 'Impact route has an unexpected host';
      }
      if (generatedUrl.searchParams.get('affid') !== AFFILIATE_CONFIG.IMPACT_PUBLISHER_ID) {
        return 'Impact route is missing the configured publisher ID';
      }
      return generatedUrl.searchParams.get('u') === product.directUrl
        ? null
        : 'Impact route is missing the encoded directUrl destination';

    case 'none':
      return generatedUrl.href === directUrl.href
        ? null
        : 'direct-link record did not resolve to its directUrl';

    default:
      return `unsupported affiliate network: ${product.affiliateNetwork}`;
  }
}

console.log('================================================================================');
console.log(`PROSUMER MATRIX LINK + IMAGE VERIFIER (${products.length} products)`);
console.log('================================================================================');
console.log(`Image check: HEAD with GET fallback; timeout: ${REQUEST_TIMEOUT_MS}ms; concurrency: ${REQUEST_CONCURRENCY}`);

const routingFailures = [];
for (const product of products) {
  const failure = validateRouting(product);
  if (failure) routingFailures.push({ product, failure });
}

const uniqueImageUrls = [...new Set(products.map((product) => product.imageUrl))];
const imageResults = await mapWithConcurrency(uniqueImageUrls, checkImage);
const imageResultsByUrl = new Map(
  uniqueImageUrls.map((imageUrl, index) => [imageUrl, imageResults[index]])
);

const imageFailuresByUrl = new Map();
for (const product of products) {
  const result = imageResultsByUrl.get(product.imageUrl);
  if (!result.ok) {
    const group = imageFailuresByUrl.get(product.imageUrl) || { result, products: [] };
    group.products.push(product);
    imageFailuresByUrl.set(product.imageUrl, group);
  }
}

const imagePassCount = products.length - [...imageFailuresByUrl.values()]
  .reduce((total, group) => total + group.products.length, 0);
const fallbackCount = imageResults.filter((result) => result.usedGetFallback).length;

if (routingFailures.length > 0) {
  console.error('\nRouting failures:');
  for (const { product, failure } of routingFailures) {
    console.error(`❌ LINK ${product.id}: ${failure}`);
  }
}

if (imageFailuresByUrl.size > 0) {
  console.error('\nImage failures:');
  for (const [imageUrl, { result, products: affectedProducts }] of imageFailuresByUrl) {
    const ids = affectedProducts.map((product) => product.id);
    const preview = ids.slice(0, 5).join(', ');
    const remainder = ids.length > 5 ? `, +${ids.length - 5} more` : '';
    const status = result.status ?? 'NETWORK ERROR';
    console.error(`❌ IMAGE ${status} (${affectedProducts.length} product${affectedProducts.length === 1 ? '' : 's'}: ${preview}${remainder})`);
    console.error(`   ${imageUrl}`);
    console.error(`   ${result.reason}`);
  }
}

console.log('\n--------------------------------------------------------------------------------');
console.log(`Routing: ${products.length - routingFailures.length}/${products.length} passed`);
console.log(`Images:  ${imagePassCount}/${products.length} passed (${uniqueImageUrls.length} unique URLs checked; ${fallbackCount} GET fallbacks succeeded)`);
console.log(`Result:  ${routingFailures.length === 0 && imageFailuresByUrl.size === 0 ? 'PASS' : 'FAIL'}`);
console.log('================================================================================');

if (routingFailures.length > 0 || imageFailuresByUrl.size > 0) {
  process.exitCode = 1;
}
