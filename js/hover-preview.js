/**
 * @typedef {import('./data.js').PreviewConfig} PreviewConfig
 * @typedef {import('./data.js').AboutItem} AboutItem
 */

/**
 * Wraps a matching text (inside an <a> tag or plain) with a
 * hover-preview container and tooltip image.
 * Prefers wrapping a link when matchText appears in both.
 *
 * @param {string} html
 * @param {PreviewConfig | null | undefined} preview
 * @returns {string}
 */
export function wrapWithHoverPreview(html, preview) {
  if (!preview) return html

  const { matchText, image } = preview
  const escaped = escapeRegExp(matchText)
  const tooltip =
    '<span class="hover-preview__tooltip" aria-hidden="true">' +
    '<span class="hover-preview__screen">' +
    `<img src="${image}" alt="" loading="lazy" />` +
    '</span></span>'

  const linkPattern = new RegExp(`(<a\\s[^>]*>)(${escaped})(</a>)`)
  if (linkPattern.test(html)) {
    return html.replace(
      linkPattern,
      `<span class="hover-preview">$1$2$3${tooltip}</span>`,
    )
  }

  const textPattern = new RegExp(escaped)
  if (!textPattern.test(html)) return html

  return html.replace(
    textPattern,
    `<span class="hover-preview">${matchText}${tooltip}</span>`,
  )
}

/**
 * Renders an about-section item.
 * Accepts either a plain string or an object `{ text, preview? }`.
 *
 * @param {AboutItem} item
 * @returns {string}
 */
export function renderAboutItem(item) {
  if (typeof item === 'string') return item

  return wrapWithHoverPreview(item.text, item.preview)
}

/**
 * Escapes special regex characters in a string.
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
