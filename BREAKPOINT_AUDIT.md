# PROSUMER MATRIX — BREAKPOINT AUDIT

## Designed Resolution Tiers (CSS Media Queries)

No `tailwind.config.js` exists; styling is pure CSS (`src/styles/main.css`).

- **Mobile / Small screens (`max-width: 767px`)**: Mobile Card View (`matrix-mobile-view` shown; `matrix-content` hidden).
- **Tablet (`768px – 1023px`)**: Structured Table View with `overflow-x: auto`; `min-width: 800px` on `.matrix-table` to trigger clean horizontal scroll.
- **Desktop (`min-width: 1024px`)**: Full structured table; sticky first column (`th-product` / `td-product`).
- **Large (`min-width: 1400px`)**: Expanded padding (`var(--space-xl)`); larger thumbnails (`64px × 64px`).

## Column Width Ratios (Desktop / Table View)

| Column | CSS Class | Designed Min-Width |
|---|---|---|
| Product / Brand | `.th-product` / `.td-product` | 220px (sticky left) |
| Brand (secondary) | `.th-brand` / `.td-brand` | 120px |
| Key Specifications | `.th-specs` / `.td-specs` | 280px |
| Price (USD) | `.th-price` / `.td-price` | 100px (right-aligned) |
| ROI Score | `.th-roi` / `.td-roi` | 120px (right-aligned) |
| Network | `.th-network` / `.td-network` | 100px |
| Action / Buy CTA | `.th-action` / `.td-action` | 140px (pinned far right) |

## Image Scaling

- Compact / default: `.product-thumbnail` = `56px × 56px`
- Large (`≥ 1400px`): `.product-thumbnail` = `64px × 64px`
- Mobile cards: `.mobile-card-image` = `aspect-ratio: 16 / 9`

## CTA Button Layout

- `.btn-buy`: `inline-flex`, `padding: var(--space-xs) var(--space-md)`, remains visible at all table-view resolutions (min-width 140px on `.th-action`).
- `.btn-specs-buy` / `.mobile-card-cta`: full-width centered buttons in mobile/specs contexts.

## Controls Bar (Search / Pills / Sort) at ≤1023px

`.matrix-controls` switches to `flex-direction: column`, so **flex-basis controls height, not width**. All children must use an `auto` basis there:

- `.search-container`: `flex: 1 1 auto; min-width: 100%` — input-sized height so `.search-icon` / `.search-clear` (positioned at `top: 50%`) stay centered on the field. A `280px` basis here inflates the box and strands the icon below the input.
- `.category-pills-scroll`: `flex: 0 1 auto; width: 100%` — content-height horizontal scroller.
- `.sort-controls`: full width on mobile; label pinned left (`.sort-label { margin-right: auto }`), select + direction button grouped right.

## Mobile Card Carousel (≤767px)

Styled entirely in `main.css` (no Tailwind utilities — the project has no Tailwind):

- `.image-carousel` fills `.mobile-card-image` (`aspect-ratio: 16 / 9`, `overflow: hidden`).
- `.carousel-display`: flex-centered, `overflow: hidden`; `.carousel-img` is `object-fit: contain` with `pointer-events: none` (taps fall through to the `data-action="specs"` display).
- `.carousel-arrow` (prev/next): absolutely positioned mid-side pills, `z-index: 5`.
- `.carousel-dots` / `.carousel-dot.active`: absolutely positioned bottom-center, sky-blue active state.
- Specs modal gallery: `.specs-carousel-display` (220px tall, 180px on mobile) above the header, `.specs-thumbnail-row` centered thumbnails (`.specs-thumb-btn.active` highlighted).
- `#mobileView` must be toggled with `display: flex` (matches `.matrix-mobile-view`'s flex column + gap) — `display: block` collapses the inter-card spacing.
