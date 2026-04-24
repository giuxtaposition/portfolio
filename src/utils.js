/**
 * Escapes a string for safe use inside an HTML attribute.
 * @param {string} str
 * @returns {string}
 */
export function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
