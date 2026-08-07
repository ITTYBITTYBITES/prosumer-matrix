# Adding New Products to Prosumer Matrix

To ensure every new item added to `src/data/hardware.json` passes AJV validation on the first try, it must strictly comply with all 11 required fields and regex patterns defined in `src/data/HardwareSchema.json`.

## Standard Product Template

Copy and paste this JSON template for any new item. Fill in the values according to your hardware category:

```json
{
  "id": "bambu-p1s-combo",
  "name": "Bambu Lab P1S 3D Printer Combo",
  "brand": "Bambu Lab",
  "category": "3D Printers",
  "priceUsd": 949,
  "directUrl": "https://usstore.bambulab.com/products/p1s",
  "imageUrl": "https://usstore.bambulab.com/cdn/shop/files/p1s-combo.jpg",
  "affiliateNetwork": "awin",
  "merchantId": "46345",
  "roiScore": 88,
  "specs": {
    "buildVolume": "256 x 256 x 256 mm",
    "enclosure": "Closed",
    "speed": "500 mm/s"
  }
}
```

## Strict AJV Validation Rules Checklist

| Field | Type | AJV Validation Rule / Constraints | Example Valid Value |
|-------|------|-----------------------------------|---------------------|
| `id` | string | **Regex:** `^[a-z0-9-]+$` (Lowercase, numbers, hyphens only; no spaces or special characters) | `"xtool-s1-laser"` |
| `name` | string | Minimum length: 1 | `"xTool S1 40W Diode Laser"` |
| `brand` | string | Minimum length: 1 | `"xTool"` |
| `category` | string | **Enum only:** Must match one of your 6 defined categories exactly | `"CNC & Laser Cutters"` |
| `priceUsd` | number | Minimum: `0` (Numeric value, no `$` or commas) | `1999` |
| `directUrl` | string | **Regex:** Must start with `http://` or `https://` | `"https://www.xtool.com"` |
| `imageUrl` | string | **Regex:** Must start with `http://` or `https://` | `"https://cdn.xtool.com/image.png"` |
| `affiliateNetwork` | string | **Enum only:** `"amazon"`, `"awin"`, `"impact"`, or `"none"` | `"awin"` |
| `merchantId` | string | Minimum length: 1 (Use ASIN for Amazon, numeric ID for Awin/Impact, or `"direct"` for `"none"`) | `"B0CKWV1JHZ"` |
| `roiScore` | number | Integer/Number between `1` and `100` | `85` |
| `specs` | object | Must contain at least **1** key-value pair | `{"power": "40W"}` |

## Category Enum Quick Reference

The `category` field in AJV requires an exact match to one of these strings:

1. `"3D Printers"`
2. `"CNC & Laser Cutters"`
3. `"Off-Grid Solar & Power"`
4. `"Thermal & Mapping Drones"`
5. `"Prosumer Espresso"`
6. `"Utility EVs"`

## Quick CLI Command to Append and Test Locally

You can append new entries directly to `src/data/hardware.json` and run your validation step locally before pushing to GitHub:

```bash
# 1. Run local AJV validation check
npx ajv test -s src/data/HardwareSchema.json -d src/data/hardware.json --valid

# 2. Run the live URL generator check to confirm affiliate links render
node verify-links.js
```

## Affiliate Network Reference

When setting `affiliateNetwork`, use one of these values:

| Value | Network | When to Use |
|-------|---------|-------------|
| `"amazon"` | Amazon Associates | Product available on Amazon with ASIN |
| `"awin"` | Awin (includes former ShareASale) | Product available through Awin network |
| `"impact"` | Impact.com | Product available through Impact network |
| `"none"` | Direct | No affiliate program available - links will bypass modal |

## Tips for Adding Products

1. **ID Format:** Always use lowercase with hyphens (e.g., `"bambu-p1s-combo"` not `"Bambu P1S Combo"`)
2. **Images:** Use reliable external CDN/manufacturer URLs only (no local assets)
3. **Prices:** Use numeric values only (no `$` symbol or commas)
4. **ROI Score:** Keep between 1-100 (higher = better value proposition)
5. **Specs:** Include at least one spec, more is better for SEO
6. **Test locally:** Always run `npx ajv test` before pushing
7. **Verify links:** Run `node verify-links.js` to confirm affiliate URLs generate correctly

## Common Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `must match pattern "^[a-z0-9-]+$"` | ID contains uppercase, spaces, or special chars | Use lowercase with hyphens only |
| `must be equal to one of the allowed values` | Category typo or wrong case | Use exact category string from enum |
| `must match pattern "^https?://"` | URL missing protocol | Add `https://` prefix |
| `must be >= 0` | Price is negative or not a number | Use positive number only |
| `must be <= 100` | ROI score over 100 | Keep between 1-100 |
| `must NOT have additional properties` | Extra fields in JSON object | Remove any fields not in schema |
