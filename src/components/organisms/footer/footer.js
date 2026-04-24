import { getContent } from '../../../data.js'
import '../../atoms/circuit-line-divider/circuit-line-divider.js'

class SiteFooter extends HTMLElement {
  connectedCallback() {
    let text = ''

    try {
      const { footer } = getContent()
      text = footer.text.replace('{{year}}', String(new Date().getFullYear()))
    } catch {
      // content may not be loaded in test environments — fall back to empty
    }

    this.innerHTML = /* html */ `
      <circuit-line-divider></circuit-line-divider>
      <p>${text}</p>
    `
  }
}

customElements.define('site-footer', SiteFooter)
