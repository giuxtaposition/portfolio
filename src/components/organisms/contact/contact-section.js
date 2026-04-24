import { getContent } from '../../../data.js'
import '../../molecules/hud-panel/hud-panel.js'

class ContactSection extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const { contact } = getContent()

    const socialLinks = contact.socials
      .map((social) => {
        const isEmail = social.url.includes('@')
        const href = isEmail ? `mailto:${social.url}` : social.url
        const externalAttrs = isEmail
          ? ''
          : 'target="_blank" rel="noopener noreferrer"'

        return `<a
            href="${href}"
            ${externalAttrs}
            class="btn btn--link btn--sm"
            aria-label="${social.ariaLabel}"
          >[${social.label}]</a>`
      })
      .join('')

    this.innerHTML = /* html */ `
      <p class="section__label">
        03 // contact
      </p>
      <hud-panel class="contact" corner-color="var(--color-accent)">
        <h2 class="section__title">${contact.sectionTitle}</h2>
        <p class="contact__text">${contact.text}</p>
        <nav class="contact__links" aria-label="${contact.socialLabel}">
          ${socialLinks}
        </nav>
      </hud-panel>
    `
  }
}

customElements.define('contact-section', ContactSection)
