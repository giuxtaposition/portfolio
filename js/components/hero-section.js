import { getContent } from '../data.js'

class HeroSection extends HTMLElement {
  connectedCallback() {
    this.render()
    this.setupTypingAnimation()
  }

  render() {
    const { hero } = getContent()

    this.innerHTML = /* html */ `
      <div class="hero">
        <div class="hero__content">
          <p class="hero__greeting">&gt; ${hero.greeting}</p>
          <h1 class="hero__name">
            <span class="hero__name-bracket">&gt;</span>${hero.name}<span
              class="hero__name-bracket"
              >&lt;</span
            >
          </h1>
          <p class="hero__title">${hero.title}</p>
          <p class="hero__subtitle">// ${hero.subtitle}</p>
          <div class="hero__actions">
            <a href="${hero.primaryCta.href}" class="hero__cta"
              >${hero.primaryCta.label}</a
            >
            <a
              href="${hero.secondaryCta.href}"
              class="hero__cta hero__cta--secondary"
              >${hero.secondaryCta.label}</a
            >
          </div>
        </div>
        <div class="hero__image">
          <img src="${hero.image}" alt="my photo" />
        </div>
      </div>
    `
  }

  setupTypingAnimation() {
    /** @type {HTMLElement | null} */
    const greeting = this.querySelector('.hero__greeting')
    if (!greeting) return

    const charCount = greeting.textContent?.length ?? 25
    greeting.style.setProperty('--typing-steps', String(charCount))
  }
}

customElements.define('hero-section', HeroSection)
