import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hardwarePath = path.join(__dirname, '../src/data/hardware.json');
const rawData = fs.readFileSync(hardwarePath, 'utf8');
const data = JSON.parse(rawData);

const outputDir = path.join(__dirname, '../public/images/amazon');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filepath, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        if (maxRedirects <= 0) {
            return reject(new Error('Too many redirects'));
        }
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://www.amazon.com/'
            }
        };

        const req = client.get(url, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redirectUrl = res.headers.location;
                if (redirectUrl.startsWith('/')) {
                    try {
                        const parsed = new URL(url);
                        redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
                    } catch {
                        // ignore URL parse error
                    }
                }
                res.resume();
                return downloadImage(redirectUrl, filepath, maxRedirects - 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(true);
            });
            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
            });
        });

        req.on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });

        req.setTimeout(10000, () => {
            req.destroy(new Error('Request timeout'));
        });
    });
}

async function processImages() {
    let updatedCount = 0;
    const products = Array.isArray(data) ? data : (data.products || []);
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        // Check if it's an external remote URL
        const targetUrl = product.imageUrl || (product.images && product.images[0]);
        if (targetUrl && targetUrl.startsWith('http')) {
            const filename = (product.affiliateNetwork === 'amazon' && product.merchantId && /^[A-Z0-9]{10}$/.test(product.merchantId))
                ? `${product.merchantId}.jpg`
                : `item-${product.id || i}.jpg`;
            const localPath = `/images/amazon/${filename}`;
            const fullLocalPath = path.join(outputDir, filename);

            try {
                await downloadImage(targetUrl, fullLocalPath);
                product.imageUrl = localPath;
                if (product.images && Array.isArray(product.images)) {
                    product.images = product.images.map(() => localPath);
                } else {
                    product.images = [localPath];
                }
                updatedCount++;
                console.log(`Successfully cached: ${filename}`);
            } catch (err) {
                console.warn(`Skipping download for item ${product.id} due to error: ${err.message}`);
            }
        }
    }
    fs.writeFileSync(hardwarePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Image caching complete. Updated ${updatedCount} items.`);
}

processImages();
