// ============================================================================
// AFFILIATE CONFIGURATION
// ============================================================================
// This file is the single source of truth for affiliate publisher IDs.
// Keep account credentials here; linkBuilder.js must import them rather than
// embedding tags or IDs in product records or UI code.
//
// Networks supported:
//   - Impact.com (IMPACT_PUBLISHER_ID)
//   - Awin (AWIN_PUBLISHER_ID)
//   - ShareASale (SHAREASALE_USER_ID)
//   - Amazon Associates (AMAZON_TAG)
// ============================================================================

export const AFFILIATE_CONFIG = {
  // Impact.com Publisher ID
  // Format: numeric string
  // Example: "12345678"
  IMPACT_PUBLISHER_ID: "7575765",

  // Awin Publisher ID
  // Format: numeric string
  // Example: "1234567"
  AWIN_PUBLISHER_ID: "3025417",

  // ShareASale User ID
  // Format: numeric string
  // Example: "123456"
  SHAREASALE_USER_ID: "PLACEHOLDER_SHAREASALE_ID",

  // Amazon Associates Tag
  // Format: association-tag (usually lowercase, no spaces)
  // Example: "my-tag-20"
  AMAZON_TAG: "prosumatrix-20",

  // Enable affiliate URL routing
  // When true and valid IDs are present, product links will route through
  // affiliate networks. When false or IDs are placeholders, links degrade
  // to direct OEM URLs.
  ENABLE_AFFILIATE_ROUTING: true
};

// Helper to check if all affiliate IDs are placeholders
export function areAllIdsPlaceholder() {
  const { IMPACT_PUBLISHER_ID, AWIN_PUBLISHER_ID, SHAREASALE_USER_ID, AMAZON_TAG } = AFFILIATE_CONFIG;
  const allPlaceholder =
    IMPACT_PUBLISHER_ID.startsWith('PLACEHOLDER') &&
    AWIN_PUBLISHER_ID.startsWith('PLACEHOLDER') &&
    SHAREASALE_USER_ID.startsWith('PLACEHOLDER') &&
    AMAZON_TAG.startsWith('PLACEHOLDER');
  return allPlaceholder;
}

export default AFFILIATE_CONFIG;
