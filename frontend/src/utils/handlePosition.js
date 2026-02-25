// handlePosition.js
// Utility to calculate evenly-spaced handle/label positions.

/**
 * Returns a CSS percentage string that evenly distributes items
 * along a node's edge.
 *
 * @param {number} index  - Zero-based index of the current item
 * @param {number} total  - Total number of items
 * @returns {string}        e.g. "50%"
 */
export const getHandlePosition = (index, total) =>
  `${((index + 1) / (total + 1)) * 100}%`;
