import fs from 'fs';

const file = 'src/data/hardware.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.forEach(item => {
  if (!item.images) {
    if (item.affiliateNetwork === 'amazon') {
        const asin = item.merchantId;
        item.images = [
            item.imageUrl,
            `/images/amazon/${asin}.jpg`,
            `/images/amazon/${asin}.jpg`
        ];
    } else {
        item.images = [
            item.imageUrl,
            item.imageUrl + '&h=401',
            item.imageUrl + '&h=402'
        ];
    }
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
