import { getContent } from '../../../data.js'
import { escapeAttr } from '../../../utils.js'
import '../../molecules/experience-item/experience-item.js'

class ExperienceList extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const { experience } = getContent()

    const items = experience.items
      .map(
        (exp, i) =>
          `<experience-item
            data-index="${i}"
            data-role="${escapeAttr(exp.role)}"
            data-company="${escapeAttr(exp.company)}"
            data-url="${escapeAttr(exp.url)}"
            data-period="${escapeAttr(exp.period)}"
            data-description="${escapeAttr(exp.description)}"
            data-highlights='${escapeAttr(JSON.stringify(exp.highlights))}'
            data-tags='${escapeAttr(JSON.stringify(exp.tags))}'
          ></experience-item>`,
      )
      .join('')

    this.innerHTML = /* html */ `
      <p class="section__label">
        02 // experience
      </p>
      <h2 class="section__title">${experience.sectionTitle}</h2>
      <div
        class="experience__timeline"
        role="list"
        aria-label="${experience.timelineLabel}"
      >
        ${items}
      </div>
    `
  }
}

customElements.define('experience-list', ExperienceList)
