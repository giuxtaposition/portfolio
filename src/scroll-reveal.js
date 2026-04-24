/** @type {string} */
const REVEAL_SELECTOR = '.section'

/** @type {string} */
const REVEAL_CLASS = 'revealed'

function initScrollReveal() {
  /** @type {NodeListOf<HTMLElement>} */
  const sections = document.querySelectorAll(REVEAL_SELECTOR)
  if (!sections.length) return

  document.documentElement.classList.add('js-ready')

  /** @type {MediaQueryList} */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  if (motionQuery.matches) {
    sections.forEach((el) => el.classList.add(REVEAL_CLASS))
    return
  }

  /** @type {IntersectionObserver} */
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add(REVEAL_CLASS)
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
  )

  sections.forEach((section) => observer.observe(section))

  motionQuery.addEventListener('change', (e) => {
    if (!e.matches) return
    sections.forEach((el) => {
      el.classList.add(REVEAL_CLASS)
      observer.unobserve(el)
    })
  })
}

export { initScrollReveal }
