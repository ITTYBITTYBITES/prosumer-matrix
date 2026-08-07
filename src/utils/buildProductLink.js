// ============================================================================
// BUILD PRODUCT LINK UTILITY (Alias / Re-export)
// ============================================================================
// Direct alias and re-exports for linkBuilder.js utilities
// ============================================================================

export {
  buildProductLink,
  cleanDestinationUrl,
  getNetworkDisplayName,
  isAffiliateRoutingActive
} from './linkBuilder.js';

export { buildProductLink as default } from './linkBuilder.js';
