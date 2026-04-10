import content from '../content.json'

/**
 * Injects content into the data module's cache so Web Components
 * can call `getContent()` without a real fetch.
 * Must be called before any component renders.
 */
export async function ensureContent() {
  const { loadContent } = await import('../js/data.js')
  // Monkey-patch globalThis.fetch for the data module's loadContent().
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(JSON.stringify(content), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  try {
    await loadContent()
  } finally {
    globalThis.fetch = originalFetch
  }
}

/**
 * Creates a container element styled like the site's layout.
 * @param {string} html
 * @returns {HTMLElement}
 */
export function container(html) {
  const div = document.createElement('div')
  div.classList.add('container')
  div.innerHTML = html
  return div
}
