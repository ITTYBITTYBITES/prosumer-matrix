import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildProductLink } from './src/utils/linkBuilder.js';

// Resolve current directory for ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load hardware.json dataset
const hardwarePath = path.join(__dirname, 'src/data/hardware.json');
const rawData = fs.readFileSync(hardwarePath, 'utf8');
const products = JSON.parse(rawData);

console.log('================================================================================');
console.log(`PROSUMER MATRIX AFFILIATE URL VERIFIER (${products.length} Items Found)`);
console.log('================================================================================\n');

let passCount = 0;
let warnCount = 0;

products.forEach((product, index) => {
  const generatedUrl = buildProductLink(product);
  const num = (index + 1).toString().padStart(2, '0');

  console.log(`[${num}] ${product.name}`);
  console.log(`     Category : ${product.category}`);
  console.log(`     Network  : ${product.affiliateNetwork}`);
  console.log(`     Direct   : ${product.directUrl}`);
  console.log(`     Final URL: ${generatedUrl}`);

  // Validation Checks
  if (product.affiliateNetwork === 'amazon' && generatedUrl.includes('tag=prosumatrix-20')) {
    console.log(`     Status   : PASS - Amazon Tag Appended`);
    passCount++;
  } else if (product.affiliateNetwork === 'awin' && generatedUrl.includes('awinaffid=3025417')) {
    console.log(`     Status   : PASS - Awin Publisher ID Active`);
    passCount++;
  } else if (product.affiliateNetwork === 'impact' && generatedUrl.includes('affid=7575765')) {
    console.log(`     Status   : PASS - Impact Publisher ID Active`);
    passCount++;
  } else if (product.affiliateNetwork === 'shareasale' && generatedUrl.includes('u=PLACEHOLDER')) {
    console.log(`     Status   : WARN - ShareASale Placeholder (ShareASale ID needed)`);
    warnCount++;
  } else if (product.affiliateNetwork === 'shareasale') {
    console.log(`     Status   : WARN - Unmonetized Fallback`);
    warnCount++;
  } else if (product.affiliateNetwork === 'none') {
    console.log(`     Status   : INFO - Direct Link (No Affiliate Network)`);
    passCount++;
  } else {
    console.log(`     Status   : WARN - Unmonetized Fallback`);
    warnCount++;
  }

  console.log('--------------------------------------------------------------------------------');
});

console.log('\n================================================================================');
console.log(`SUMMARY: ${passCount} Passed / Validated | ${warnCount} Warnings / Fallbacks`);
console.log('================================================================================');
