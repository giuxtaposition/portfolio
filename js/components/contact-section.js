import { getContent } from "../data.js";

class ContactSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const { contact } = getContent();

    const socialLinks = contact.socials
      .map((social) => {
        const isEmail = social.url.includes("@");
        const href = isEmail ? `mailto:${social.url}` : social.url;
        const externalAttrs = isEmail
          ? ""
          : 'target="_blank" rel="noopener noreferrer"';

        return `<a
            href="${href}"
            ${externalAttrs}
            class="contact__social"
            aria-label="${social.ariaLabel}"
          >[${social.label}]</a>`;
      })
      .join("");

    this.innerHTML = `
      <p class="section__label">03 // contact</p>
      <div class="contact">
        <h2 class="section__title">${contact.sectionTitle}</h2>
        <p class="contact__text">${contact.text}</p>
        <nav class="contact__links" aria-label="${contact.socialLabel}">
          ${socialLinks}
        </nav>
      </div>
    `;
  }
}

customElements.define("contact-section", ContactSection);
