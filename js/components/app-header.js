import { getContent } from '../data.js'

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render()
    this.setupMobileMenu()
    this.setupActiveNav()
  }

  render() {
    const { header, nav, hero } = getContent()

    const navLinks = nav
      .map(
        (item) =>
          `<li class="header__nav-item">
            <a href="${item.href}" class="header__nav-link">${item.label}</a>
          </li>`,
      )
      .join('')

    this.innerHTML = /* html */ `
      <div class="header__inner">
        <a href="#" class="header__logo" aria-label="${header.logoLabel}">
          ${hero.name}<span class="header__logo-dot">.</span>
        </a>

        <button
          class="header__menu-toggle"
          aria-expanded="false"
          aria-controls="main-nav"
          aria-label="${header.menuToggleLabel}"
        >
          <span class="header__menu-icon" aria-hidden="true"></span>
        </button>

        <nav id="main-nav" class="header__nav" aria-label="${header.navLabel}">
          <ul class="header__nav-list" role="list">
            ${navLinks}
          </ul>
        </nav>
      </div>
    `
  }

  setupMobileMenu() {
    /** @type {HTMLButtonElement} */
    const toggle = /** @type {HTMLButtonElement} */ (
      this.querySelector('.header__menu-toggle')
    )
    /** @type {HTMLElement} */
    const nav = /** @type {HTMLElement} */ (this.querySelector('.header__nav'))

    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true')
      nav.classList.add('header__nav--open')
      document.body.classList.add('menu-open')
      /** @type {HTMLAnchorElement | null} */
      const firstLink = nav.querySelector('.header__nav-link')
      firstLink?.focus()
    }

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false')
      nav.classList.remove('header__nav--open')
      document.body.classList.remove('menu-open')
      toggle.focus()
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true'
      isOpen ? closeMenu() : openMenu()
    })

    this.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return
      if (toggle.getAttribute('aria-expanded') !== 'true') return
      closeMenu()
    })

    nav.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return
      /** @type {NodeListOf<HTMLElement>} */
      const focusable = nav.querySelectorAll('a, button')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    })

    nav.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).matches('.header__nav-link')) {
        closeMenu()
      }
    })
  }

  setupActiveNav() {
    /** @type {NodeListOf<HTMLElement>} */
    const sections = document.querySelectorAll('main .section[id]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          this.querySelectorAll('.header__nav-link').forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`
            link.classList.toggle('header__nav-link--active', isActive)
            link.setAttribute('aria-current', isActive ? 'page' : 'false')
          })
        }
      },
      { rootMargin: '-40% 0px -60% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
  }
}

customElements.define('app-header', AppHeader)
