import { loadContent } from './data.js'
import { initScrollReveal } from './scroll-reveal.js'

async function init() {
  const content = await loadContent()

  await import('./components/app-header.js')
  await import('./components/hero-section.js')
  await import('./components/experience-list.js')
  await import('./components/about-section.js')
  await import('./components/contact-section.js')

  /** @type {HTMLElement | null} */
  const footerEl = document.getElementById('footer-text')
  if (footerEl) {
    footerEl.textContent = content.footer.text.replace(
      '{{year}}',
      String(new Date().getFullYear()),
    )
  }

  const spotlight = document.getElementById('spotlight')
  document.addEventListener('mousemove', (e) => {
    spotlight?.style.setProperty('--mx', e.clientX + 'px')
    spotlight?.style.setProperty('--my', e.clientY + 'px')
  })

  requestAnimationFrame(() => {
    initScrollReveal()
  })
}

init()
