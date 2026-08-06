# Prosumer Matrix
# Prosumer Matrix

> Enterprise-grade Hardware & Equipment Specification Database

A comprehensive, zero-asset architecture web application for comparing and analyzing prosumer hardware specifications across multiple categories. Built for static deployment to GitHub Pages with full schema validation and affiliate link support.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Categories Covered](#categories-covered)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Affiliate Integration](#affiliate-integration)
- [Deployment](#deployment)
- [Development](#development)
- [Data Validation](#data-validation)
- [License](#license)

## Features

- **Dark Slate Industrial Dashboard** - Professional engineering aesthetic with #0F172A primary background
- **Responsive Three-Tier Layout** - Desktop table view, tablet scrollable view, mobile card view
- **Real-time Search** - Filter across names, brands, specs, and metadata
- **Category Filtering** - Six hardware categories with pill navigation
- **Multi-column Sorting** - Sort by price, ROI score, name, or brand
- **ROI Score Visualization** - Color-coded progress bars (Emerald/Sky/Amber/Red)
- **Affiliate Link Routing** - Automatic affiliate link generation with safe degradation
- **Zero-Asset Architecture** - All images served via external CDN and Weserv proxy
- **Schema Validation** - AJV-based JSON schema validation for data integrity
- **Static Deployment** - Ready for GitHub Pages via GitHub Actions

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Vanilla JS ES Modules |
| Build Tool | Vite 5+ |
| Styling | Tailwind CSS (via CDN) + Custom CSS |
| Validation | AJV 8+ |
| Fonts | Inter (UI), JetBrains Mono (Technical) |
| Images | Unsplash CDN + Weserv Proxy |
| Deployment | GitHub Actions + GitHub Pages |
| CI/CD | GitHub Actions Workflows |

## Categories Covered

| Category | Examples |
|----------|----------|
| **3D Printers** | Creality K1 Max, Prusa XL, Bambu Lab X1 Carbon |
| **CNC & Laser Cutters** | xTool P2 50W, Glowforge Pro |
| **Off-Grid Solar & Power** | EcoFlow Delta Pro 3, Bluetti AC200L, Jackery Explorer 2000 Plus |
| **Thermal & Mapping Drones** | DJI Matrice 350 RTK, Autel EVO II Dual 640T, DJI Mavic 3 Enterprise |
| **Prosumer Espresso** | La Marzocco Linea Micra, Rocket Appartamento, eversys myCoffeelab |
| **Utility EVs** | Tern GSD S10, Riese & Müller Load 60, Worx Landroid |

## Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/ITTYBITTYBITES/prosumer-matrix.git
cd prosumer-matrix

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
prosumer-matrix/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Deploy to GitHub Pages
│       └── data-refresh.yml    # Weekly schema validation
├── public/
│   └── favicon.svg             # Application favicon
├── src/
│   ├── config/
│   │   └── affiliates.js       # Affiliate network configuration
│   ├── data/
│   │   ├── HardwareSchema.json # AJV JSON Schema definition
│   │   └── hardware.json       # Product data (12+ entries)
│   ├── utils/
│   │   ├── imageProxy.js       # Image URL optimization utilities
│   │   └── linkBuilder.js      # Affiliate URL builders
│   ├── components/
│   │   └── MatrixApp.js        # Main application component
│   └── app.js                  # Application entry point
├── index.html                  # Main HTML document
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Configuration

### Environment Variables

No environment variables required for local development. For production affiliate tracking, update `src/config/affiliates.js`:

```javascript
export const AFFILIATE_CONFIG = {
  IMPACT_PUBLISHER_ID: "YOUR_IMPACT_MPID",
  AWIN_PUBLISHER_ID: "YOUR_AWIN_PID",
  SHAREASALE_USER_ID: "YOUR_SHAREASALE_ID",
  AMAZON_TAG: "your-amazon-tag-20",
  ENABLE_AFFILIATE_ROUTING: true
};
```

### Affiliate Networks

| Network | ID Type | Example |
|---------|---------|---------|
| Impact | Publisher ID | `12345678` |
| Awin | Publisher ID | `1234567` |
| ShareASale | User ID | `123456` |
| Amazon | Tag | `my-tag-20` |

## Affiliate Integration

The application automatically routes product links through affiliate networks when configured. When IDs are placeholders (default), links safely degrade to direct OEM URLs.

### Link Building Logic

1. Check if all IDs start with "PLACEHOLDER"
2. If yes → Return `directUrl` (OEM link)
3. If no → Build network-specific affiliate URL

### Supported Networks

- **Impact.com** - `impact.com/c/{merchantId}?affid={publisherId}`
- **Awin** - `awin1.com/cread.php?awinmid={pid}&clickref={ref}`
- **ShareASale** - `shareasale.com/r.cfm?b={merchantId}&u={userId}`
- **Amazon** - `amazon.com/dp/{ASIN}/?tag={tag}`

## Deployment

### GitHub Pages (Recommended)

The repository includes GitHub Actions workflows for automated deployment:

1. **Push to `main`** → `deploy.yml` triggers build and deployment
2. **Scheduled** → `data-refresh.yml` validates schema weekly

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Custom Domain

1. Go to repository Settings → Pages
2. Add your custom domain
3. Update `CNAME` file if needed

## Development

### NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Validate schema + Vite build |
| `npm run preview` | Preview production build |

### Code Quality

- All code must pass schema validation before build
- No placeholder code in production (search for "TODO")
- Use semantic HTML and ARIA attributes for accessibility

### Adding New Products

1. Edit `src/data/hardware.json`
2. Follow the schema defined in `src/data/HardwareSchema.json`
3. Use real manufacturer CDN URLs for images
4. Include complete technical specifications

#### Product Object Structure

```json
{
  "id": "unique-product-id",
  "name": "Product Name",
  "brand": "Brand Name",
  "category": "3D Printers | CNC & Laser Cutters | Off-Grid Solar & Power | Thermal & Mapping Drones | Prosumer Espresso | Utility EVs",
  "priceUsd": 999,
  "directUrl": "https://manufacturer.com/product",
  "imageUrl": "https://images.unsplash.com/...",
  "affiliateNetwork": "impact | awin | shareasale | amazon | none",
  "merchantId": "merchant-id-or-asin",
  "roiScore": 75,
  "specs": {
    "spec_key": "value",
    "another_spec": 123
  }
}
```

## Data Validation

The project uses AJV (Another JSON Schema Validator) to validate product data:

```bash
# Manual validation
npx ajv test -s src/data/HardwareSchema.json -d src/data/hardware.json
```

Schema validation runs automatically:
- During `npm run build`
- On every push to `main` (deploy workflow)
- Weekly via scheduled workflow (data-refresh)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Unsplash](https://unsplash.com) - Product imagery
- [Weserv](https://images.weserv.nl) - Image proxy and optimization
- [Google Fonts](https://fonts.google.com) - Inter and JetBrains Mono
- [Tailwind CSS](https://tailwindcss.com) - Utility CSS framework

---

Built with ❤️ for the prosumer hardware community
