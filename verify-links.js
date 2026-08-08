import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildProductLink,
  cleanDestinationUrl
} from './src/utils/linkBuilder.js';
import { AFFILIATE_CONFIG } from './src/config/affiliates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/data/hardware.json'), 'utf8')
);

const REQUEST_TIMEOUT_MS = Number.parseInt(process.env.VERIFY_LINKS_TIMEOUT_MS || '15000', 10);
const REQUEST_CONCURRENCY = Math.max(1, Number.parseInt(process.env.VERIFY_LINKS_CONCURRENCY || '4', 10));
const SKIP_NETWORK = process.env.VERIFY_LINKS_SKIP_NETWORK === '1';
const EXPECTED_PRODUCT_COUNT = 220;
const REQUIRED_CATEGORIES = [
  '3D Printers',
  'CNC & Laser Cutters',
  'Off-Grid Solar & Power',
  'Thermal & Mapping Drones',
  'Prosumer Espresso',
  'Utility EVs'
];

function assertBenchmarkShape() {
  const failures = [];

  if (products.length < EXPECTED_PRODUCT_COUNT) {
    failures.push(`dataset must contain at least ${EXPECTED_PRODUCT_COUNT} products; found ${products.length}`);
  }

  for (const category of REQUIRED_CATEGORIES) {
    const inCategory = products.filter((product) => product.category === category);
    if (inCategory.length === 0) {
      failures.push(`missing required category: ${category}`);
    }
  }

  const seenIds = new Set();
  for (const product of products) {
    if (!product.id || !/^[a-z0-9-]+$/.test(product.id)) {
      failures.push(`${product.id || 'unnamed'}: ID must match regex ^[a-z0-9-]+$`);
    }
    if (seenIds.has(product.id)) {
      failures.push(`${product.id}: duplicate product ID detected`);
    }
    seenIds.add(product.id);

    if (product.affiliateNetwork === 'amazon') {
      if (!/^[A-Z0-9]{10}$/.test(product.merchantId)) {
        failures.push(`${product.id}: Amazon merchantId must be a 10-character ASIN`);
      }
      const expectedImage = `/images/amazon/${product.merchantId}.jpg`;
      if (product.imageUrl !== expectedImage) {
        failures.push(`${product.id}: Amazon imageUrl does not use the deterministic ASIN helper`);
      }
    }

    if (['awin', 'impact'].includes(product.affiliateNetwork) && !/^\d+$/.test(product.merchantId)) {
      failures.push(`${product.id}: ${product.affiliateNetwork} merchantId must be numeric`);
    }

    if (product.affiliateNetwork === 'none' && product.merchantId !== 'direct') {
      failures.push(`${product.id}: direct records must use merchantId "direct"`);
    }

    if (product.imageUrl && (product.imageUrl.includes('pixel.glitch.me') || product.imageUrl.includes('via.placeholder.com'))) {
      failures.push(`${product.id}: placeholder image domain detected`);
    }
  }

  return failures;
}

function validateGeneratedRoute(product) {
  const cleanDestination = cleanDestinationUrl(product.directUrl);
  const generated = buildProductLink(product);

  if (!cleanDestination) {
    return { ok: false, generated, reason: 'directUrl is not a valid HTTP(S) URL' };
  }

  try {
    const link = new URL(generated);
    switch (product.affiliateNetwork) {
      case 'amazon':
        if (link.origin !== 'https://www.amazon.com' || link.pathname !== `/dp/${product.merchantId}/`) {
          return { ok: false, generated, reason: 'Amazon path does not contain the configured ASIN' };
        }
        if (link.searchParams.get('tag') !== AFFILIATE_CONFIG.AMAZON_TAG) {
          return { ok: false, generated, reason: 'Amazon route is missing the configured associate tag' };
        }
        return { ok: true, generated };

      case 'awin':
        if (link.origin !== 'https://www.awin1.com') {
          return { ok: false, generated, reason: 'Awin route host is incorrect' };
        }
        if (link.searchParams.get('awinmid') !== product.merchantId) {
          return { ok: false, generated, reason: 'Awin route is missing the configured advertiser ID' };
        }
        if (link.searchParams.get('awinaffid') !== AFFILIATE_CONFIG.AWIN_PUBLISHER_ID) {
          return { ok: false, generated, reason: 'Awin route is missing the configured publisher ID' };
        }
        if (link.searchParams.get('ued') !== cleanDestination || !generated.includes(`ued=${encodeURIComponent(cleanDestination)}`)) {
          return { ok: false, generated, reason: 'Awin destination is not percent-encoded exactly once' };
        }
        return { ok: true, generated };

      case 'impact':
        if (link.origin !== 'https://impact.com' || link.pathname !== `/c/${product.merchantId}`) {
          return { ok: false, generated, reason: 'Impact route does not contain the configured advertiser ID' };
        }
        if (link.searchParams.get('affid') !== AFFILIATE_CONFIG.IMPACT_PUBLISHER_ID) {
          return { ok: false, generated, reason: 'Impact route is missing the configured affiliate ID' };
        }
        if (link.searchParams.get('u') !== cleanDestination || !generated.includes(`u=${encodeURIComponent(cleanDestination)}`)) {
          return { ok: false, generated, reason: 'Impact destination is not percent-encoded exactly once' };
        }
        return { ok: true, generated };

      case 'none':
        return generated === cleanDestination
          ? { ok: true, generated }
          : { ok: false, generated, reason: 'direct record did not return the cleaned OEM URL' };

      default:
        return { ok: false, generated, reason: `unsupported network: ${product.affiliateNetwork}` };
    }
  } catch {
    return { ok: false, generated, reason: 'link builder returned an invalid URL' };
  }
}

async function requestDirectUrl(url, method) {
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Prosumer-Matrix-Link-Validator/2.0'
      }
    });
    await response.body?.cancel();
    return { ok: response.status === 200, status: response.status, method, finalUrl: response.url };
  } catch (error) {
    return {
      ok: false,
      status: null,
      method,
      finalUrl: '',
      reason: error?.name === 'TimeoutError' ? `timeout after ${REQUEST_TIMEOUT_MS}ms` : error.message
    };
  }
}

async function checkDirectUrl(url) {
  const head = await requestDirectUrl(url, 'HEAD');
  if (head.ok) return head;

  const get = await requestDirectUrl(url, 'GET');
  if (get.ok) return { ...get, usedGetFallback: true };

  return {
    ...get,
    reason: `${get.reason || `HTTP ${get.status}`}; HEAD result: ${head.reason || `HTTP ${head.status}`}`
  };
}

async function mapWithConcurrency(items, callback) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await callback(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(REQUEST_CONCURRENCY, items.length) }, worker));
  return results;
}

const benchmarkFailures = assertBenchmarkShape();
const routeResults = products.map((product) => ({ product, ...validateGeneratedRoute(product) }));
const routeFailures = routeResults.filter((result) => !result.ok);
const directResults = SKIP_NETWORK
  ? products.map(() => ({ ok: true, status: 'SKIPPED', method: 'SKIPPED' }))
  : await mapWithConcurrency(products, (product) => checkDirectUrl(product.directUrl));
const directFailures = directResults
  .map((result, index) => ({ product: products[index], ...result }))
  .filter((result) => !result.ok);

console.log('================================================================================');
console.log(`PROSUMER MATRIX BENCHMARK LINK VERIFIER (${products.length} products)`);
console.log('================================================================================');
console.log(`Direct URL check: ${SKIP_NETWORK ? 'skipped by VERIFY_LINKS_SKIP_NETWORK=1' : `HEAD with GET fallback; timeout ${REQUEST_TIMEOUT_MS}ms`}`);
console.log('');

for (const [index, product] of products.entries()) {
  const route = routeResults[index];
  const direct = directResults[index];
  const directStatus = direct.status === 'SKIPPED'
    ? 'SKIPPED'
    : direct.ok
      ? `${direct.status} ${direct.method}${direct.usedGetFallback ? ' fallback' : ''}`
      : `${direct.status ?? 'NETWORK ERROR'} ${direct.method}`;
  console.log(`${String(index + 1).padStart(3, '0')}. ${product.category} | ${product.affiliateNetwork} | direct ${directStatus}`);
  console.log(`     ${product.name}`);
  console.log(`     image: ${product.imageUrl}`);
  console.log(`     link:  ${route.generated}`);
}

if (benchmarkFailures.length) {
  console.error('\nBenchmark data failures:');
  benchmarkFailures.forEach((failure) => console.error(`❌ ${failure}`));
}
if (routeFailures.length) {
  console.error('\nAffiliate route failures:');
  routeFailures.forEach(({ product, reason }) => console.error(`❌ ${product.id}: ${reason}`));
}
if (directFailures.length) {
  console.error('\nDirect URL failures:');
  directFailures.forEach(({ product, reason, status }) => {
    console.error(`❌ ${product.id}: ${status ?? 'NETWORK ERROR'} — ${reason || 'landing page did not return HTTP 200'}`);
  });
}

console.log('\n--------------------------------------------------------------------------------');
console.log(`Benchmark: ${benchmarkFailures.length === 0 ? 'PASS' : 'FAIL'}`);
console.log(`Routing:   ${products.length - routeFailures.length}/${products.length} passed`);
console.log(`Directs:   ${products.length - directFailures.length}/${products.length} returned HTTP 200${SKIP_NETWORK ? ' (network check skipped)' : ''}`);
console.log(`Result:    ${benchmarkFailures.length === 0 && routeFailures.length === 0 && directFailures.length === 0 ? 'PASS' : 'FAIL'}`);
console.log('================================================================================');

if (benchmarkFailures.length || routeFailures.length || directFailures.length) {
  process.exitCode = 1;
}
