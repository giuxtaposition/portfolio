import { getContent } from '../data.js'
import './hud-panel.js'

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
          <h1 class="hero__name">Hi, I'm ${hero.name}</h1>
          <p class="hero__title">${hero.title}</p>
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
          <p class="hero__subtitle">${hero.subtitle}</p>
        </div>
        <hud-panel class="hero__image" corner-color="var(--color-accent)">
          <span class="hero__screen crt-scanline">
            <img
              class="crt-filter"
              src="${hero.image}"
              alt="${hero.imageAlt ?? ''}"
            />
          </span>
        </hud-panel>
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
