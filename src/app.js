import { loadContent } from './data.js'
import { initScrollReveal } from './scroll-reveal.js'
import('./components/atoms/hud-list-item/hud-list-item.js')
import('./components/atoms/circuit-line-divider/circuit-line-divider.js')
import('./components/atoms/tech-tag/tech-tag.js')

async function init() {
  await loadContent()

  await import('./components/organisms/header/app-header.js')
  await import('./components/organisms/hero/hero-section.js')
  await import('./components/organisms/experience/experience-list.js')
  await import('./components/organisms/about/about-section.js')
  await import('./components/organisms/contact/contact-section.js')
  await import('./components/organisms/footer/footer.js')

  /** @type {HTMLElement | null} */
  const spotlight = document.getElementById('spotlight')

  /** @type {(e: MouseEvent) => void} */
  const onMouse = (e) => {
    spotlight?.style.setProperty('--mx', e.clientX + 'px')
    spotlight?.style.setProperty('--my', e.clientY + 'px')
  }

  document.addEventListener('mousemove', onMouse)

  requestAnimationFrame(() => {
    initScrollReveal()
  })
}

init()
