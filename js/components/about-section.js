import { getContent } from '../data.js'
import { renderAboutItem } from '../hover-preview.js'
import './hud-panel.js'

class AboutSection extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const { about } = getContent()

    const items = about.items
      .map((item) => `<li class="about__item">${renderAboutItem(item)}</li>`)
      .join('')

    const panelContent = /* html */ `
      <p class="about__description">
        ${about.description}
      </p>
      <p class="about__subtitle">${about.subtitle}</p>
      <ul class="about__list" role="list">
        ${items}
      </ul>
    `

    this.innerHTML = ''

    const panel = document.createElement('hud-panel')
    panel.setAttribute('header-left', about.sectionTitle)
    panel.setAttribute('header-right', 'SYS.01')
    panel.className = 'about'
    panel.innerHTML = panelContent
    this.appendChild(panel)
  }
}

customElements.define('about-section', AboutSection)
