import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HARDWARE_FILE = path.join(__dirname, '../src/data/hardware.json');
const SITEMAP_FILE = path.join(__dirname, '../public/sitemap.xml');
const BASE_URL = process.env.SITE_URL || 'https://ittybittybites.github.io/prosumer-matrix';

// Category slug mapping
const CATEGORY_SLUGS = {
  '3D Printers': '3d-printers',
  'CNC & Laser Cutters': 'cnc-laser-cutters',
  'Off-Grid Solar & Power': 'off-grid-solar-power',
  'Thermal & Mapping Drones': 'thermal-mapping-drones',
  'Prosumer Espresso': 'prosumer-espresso',
  'Utility EVs': 'utility-evs'
};

export function generateSitemapXml(products = [], baseUrl = BASE_URL) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls = [];

  // Root URL
  urls.push(`  <url>
    <loc>${normalizedBase}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Category URLs
  const activeCategories = new Set(products.map(p => p.category).filter(Boolean));
  for (const [categoryName, slug] of Object.entries(CATEGORY_SLUGS)) {
    if (activeCategories.has(categoryName) || activeCategories.size === 0) {
      urls.push(`  <url>
    <loc>${normalizedBase}/#category=${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  // Product URLs
  for (const product of products) {
    if (product && product.id) {
      urls.push(`  <url>
    <loc>${normalizedBase}/#product=${encodeURIComponent(product.id)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

export function run() {
  const publicDir = path.dirname(SITEMAP_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let products = [];
  if (fs.existsSync(HARDWARE_FILE)) {
    try {
      const rawData = fs.readFileSync(HARDWARE_FILE, 'utf8');
      const parsed = JSON.parse(rawData);
      products = Array.isArray(parsed) ? parsed : (parsed.products || []);
    } catch (err) {
      console.error(`Failed to read hardware.json: ${err.message}`);
    }
  }

  const sitemapXml = generateSitemapXml(products);
  fs.writeFileSync(SITEMAP_FILE, sitemapXml, 'utf8');

  const totalUrls = 1 + Object.keys(CATEGORY_SLUGS).length + products.length;
  console.log(`[Sitemap] Generated ${SITEMAP_FILE} with ${totalUrls} URLs (${products.length} products).`);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run();
}
