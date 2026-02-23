// extractVariables.js
// Extracts unique, valid JavaScript variable names from {{ variable }} patterns.

/**
 * @param {string} text
 * @returns {string[]} Array of unique variable names
 */
export const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return [...vars];
};
