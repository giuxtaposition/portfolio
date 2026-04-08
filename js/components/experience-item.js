import { getContent } from '../data.js'

class ExperienceItem extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'listitem')
    this.render()
  }

  render() {
    const { accessibility } = getContent()

    const role = this.dataset.role ?? ''
    const company = this.dataset.company ?? ''
    const url = this.dataset.url ?? ''
    const period = this.dataset.period ?? ''
    const description = this.dataset.description ?? ''

    /** @type {string[]} */
    const highlights = JSON.parse(this.dataset.highlights || '[]')

    /** @type {string[]} */
    const tags = JSON.parse(this.dataset.tags || '[]')

    const highlightItems = highlights
      .map((h) => `<li class="exp__highlight">${h}</li>`)
      .join('')

    const tagItems = tags
      .map((t) => `<span class="exp__tag">${t}</span>`)
      .join('')

    this.innerHTML = /* html */ `
      <article class="exp">
        <div class="exp__timeline-marker" aria-hidden="true"></div>
        <div class="exp__content">
          <header class="exp__header">
            <h3 class="exp__role">${role}</h3>
            <p class="exp__meta">
              <a
                href="${url}"
                class="exp__company"
                target="_blank"
                rel="noopener noreferrer"
              >
                @ ${company}<span class="sr-only">
                  ${accessibility.externalLinkHint}</span
                ><span class="exp__external-icon" aria-hidden="true">
                  ${accessibility.externalLinkIcon}</span
                >
              </a>
              <span class="exp__separator" aria-hidden="true">·</span>
              <span class="exp__period">${period}</span>
            </p>
          </header>

          <p class="exp__description">${description}</p>

          <ul class="exp__highlights" role="list">
            ${highlightItems}
          </ul>

          <div
            class="exp__tags"
            role="group"
            aria-label="${accessibility.tagsLabel}"
          >
            ${tagItems}
          </div>
        </div>
      </article>
    `
  }
}

customElements.define('experience-item', ExperienceItem)
