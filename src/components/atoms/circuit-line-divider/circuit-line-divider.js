class CircuitLineDivider extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('aria-hidden'))
      this.setAttribute('aria-hidden', 'true')

    if (!this.hasAttribute('role')) this.setAttribute('role', 'separator')
  }
}

customElements.define('circuit-line-divider', CircuitLineDivider)
