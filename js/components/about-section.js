import { getContent } from '../data.js'

class AboutSection extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const { about } = getContent()

    const items = about.items
      .map((item) => `<li class="about__item">${item}</li>`)
      .join('')

    this.innerHTML = /* html */ `
      <p class="section__label">01 // about</p>
      <h2 class="section__title">${about.sectionTitle}</h2>
      <div class="about hud-frame">
        <p class="about__description">${about.description}</p>
        <p class="about__subtitle">${about.subtitle}</p>
        <ul class="about__list" role="list">
          ${items}
        </ul>
      </div>
    `
  }
}

customElements.define('about-section', AboutSection)
