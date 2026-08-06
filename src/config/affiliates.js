// ============================================================================
// AFFILIATE CONFIGURATION
// ============================================================================
// This file contains affiliate network publisher IDs for monetization.
// IMPORTANT: All IDs are currently placeholders. Replace with real IDs
// before enabling affiliate routing in production.
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
  IMPACT_PUBLISHER_ID: "PLACEHOLDER_IMPACT_MPID",

  // Awin Publisher ID
  // Format: numeric string
  // Example: "1234567"
  AWIN_PUBLISHER_ID: "PLACEHOLDER_AWIN_PID",

  // ShareASale User ID
  // Format: numeric string
  // Example: "123456"
  SHAREASALE_USER_ID: "PLACEHOLDER_SHAREASALE_ID",

  // Amazon Associates Tag
  // Format: association-tag (usually lowercase, no spaces)
  // Example: "my-tag-20"
  AMAZON_TAG: "PLACEHOLDER_AMAZON_TAG",

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
