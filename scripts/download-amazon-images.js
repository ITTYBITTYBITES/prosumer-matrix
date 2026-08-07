import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HARDWARE_FILE = path.join(__dirname, '../src/data/hardware.json');
const AMAZON_IMG_DIR = path.join(__dirname, '../public/images/amazon');

// Minimal 1x1 transparent JPEG
const dummyJpg = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAv//////////////////////EQAF/8QAFBABAv//////////////////////EQAF/8QAFBABAv//////////////////////EQAF/8QAFBABAv//////////////////////EQAF/9oADAMBAAIAAwAAABD/xAAUEQEC//////////////////////ERAAX/xAAUEQEC//////////////////////ERAAX/xAAUEQEC//////////////////////ERAAX/xAAUEQEC//////////////////////ERAAX/2Q==',
  'base64'
);

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    // Set a timeout to prevent hanging
    req.setTimeout(5000, () => {
      req.destroy(new Error('Request timeout'));
    });
  });
}

async function main() {
  if (!fs.existsSync(AMAZON_IMG_DIR)) {
    fs.mkdirSync(AMAZON_IMG_DIR, { recursive: true });
  }

  const rawData = fs.readFileSync(HARDWARE_FILE, 'utf8');
  const products = JSON.parse(rawData);

  let updated = false;

  for (const product of products) {
    if (product.affiliateNetwork === 'amazon' && product.merchantId) {
      const asin = product.merchantId;
      const localImagePath = `/images/amazon/${asin}.jpg`;
      const absoluteImagePath = path.join(__dirname, '../public', localImagePath);

      if (!fs.existsSync(absoluteImagePath)) {
        let originalUrl = product.imageUrl;
        if (!originalUrl || !originalUrl.startsWith('http')) {
          // Construct the URL if not available or already localized
          originalUrl = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.MAIN._SCLZZZZZZZ_.jpg`;
        }

        console.log(`Downloading image for ${product.id} (ASIN: ${asin})...`);
        try {
          await downloadImage(originalUrl, absoluteImagePath);
        } catch (err) {
          console.warn(`[WARN] Failed to download image for ${product.id}: ${err.message}`);
          console.warn(`Using fallback dummy image for ${asin} to allow build to proceed.`);
          fs.writeFileSync(absoluteImagePath, dummyJpg);
        }
      }

      // Update imageUrl
      if (product.imageUrl !== localImagePath) {
        product.imageUrl = localImagePath;
        updated = true;
      }
      
      // Update images array if it exists
      if (product.images && Array.isArray(product.images)) {
        let changedImages = false;
        const updatedImages = product.images.map(img => {
          if (img.includes(asin) && img.startsWith('http')) {
            changedImages = true;
            return localImagePath;
          }
          return img;
        });
        
        if (changedImages) {
          product.images = updatedImages;
          updated = true;
        }
      }
    }
  }

  if (updated) {
    fs.writeFileSync(HARDWARE_FILE, JSON.stringify(products, null, 2) + '\n');
    console.log('Successfully updated hardware.json with local Amazon image paths.');
  } else {
    console.log('No updates needed for hardware.json.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
