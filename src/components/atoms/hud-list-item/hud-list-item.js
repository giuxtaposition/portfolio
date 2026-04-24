class HudListItem extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem')
    this.classList.add('hud-list-item')
    this.style.display = this.style.display || 'list-item'

    const marker = this.getAttribute('marker')
    this.addMarker(marker)
  }

  /**
   * @param {string | null} [markerSymbol]
   */
  addMarker(markerSymbol) {
    if (!this._markerElement) {
      this._markerElement = document.createElement('span')
      this._markerElement.className = 'hud-list-item__marker'
      this._markerElement.setAttribute('aria-hidden', 'true')
      this.prepend(this._markerElement)
    }
    this._markerElement.textContent = markerSymbol || '▹'
  }
}

customElements.define('hud-list-item', HudListItem)
