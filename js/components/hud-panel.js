import { escapeAttr } from '../utils.js'

class HudPanel extends HTMLElement {
  static SHAPE = Object.freeze([
    Object.freeze([0.028, 0.1246]),
    Object.freeze([0.07, 0.0064]),
    Object.freeze([0.6026, 0.0096]),
    Object.freeze([0.64, 0.1172]),
    Object.freeze([0.9951, 0.1204]),
    Object.freeze([0.997, 0.933]),
    Object.freeze([0.4627, 0.9192]),
    Object.freeze([0.435, 0.9969]),
    Object.freeze([0.0577, 0.9948]),
    Object.freeze([0.0025, 0.935]),
    Object.freeze([0.0031, 0.3014]),
    Object.freeze([0.028, 0.25]),
  ])

  static get observedAttributes() {
    return ['header-left', 'header-right', 'color']
  }

  connectedCallback() {
    /** @type {string} */ this._originalContent = this.innerHTML
    /** @type {number} */ this._prevW = 0
    /** @type {number} */ this._prevH = 0

    this.render()
    this._resizeObserver = new ResizeObserver(() => {
      const w = this.offsetWidth
      const h = this.offsetHeight
      if (w === this._prevW && h === this._prevH) return
      this.render()
    })
    this._resizeObserver.observe(this)
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect()
  }

  attributeChangedCallback() {
    if (!this.isConnected) return
    this.render()
  }

  render() {
    const w = this.offsetWidth || 400
    const h = this.offsetHeight || 250
    this._prevW = this.offsetWidth
    this._prevH = this.offsetHeight

    const color = escapeAttr(this.getAttribute('color') || '#00e5ff')
    const headerLeft = this.getAttribute('header-left') || ''
    const headerRight = this.getAttribute('header-right') || ''

    const points = HudPanel.SHAPE.map(
      ([nx, ny]) => `${(nx * w).toFixed(1)},${(ny * h).toFixed(1)}`,
    ).join(' ')

    const viewBox = `-1 -1 ${w + 2} ${h + 2}`

    /** @type {string} */
    let headerHTML = ''
    if (headerLeft || headerRight) {
      const safeLeft = escapeAttr(headerLeft)
      const rightTag = headerRight
        ? `<span class="hud-panel__tag">${escapeAttr(headerRight)}</span>`
        : ''
      headerHTML = `<div class="hud-panel__header"><span class="hud-panel__header-title">${safeLeft}</span>${rightTag}</div>`
    }

    this.innerHTML = /* html */ `
      <div class="hud-panel__wrap">
        <svg
          class="hud-panel__frame"
          viewBox="${viewBox}"
          preserveAspectRatio="none"
          overflow="visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="${points}"
            fill="var(--color-hud-panel-bg)"
            stroke="${color}"
            stroke-width="1.2"
          />
        </svg>

        ${headerHTML}

        <div class="hud-panel__body">${this._originalContent}</div>
      </div>
    `
  }
}

customElements.define('hud-panel', HudPanel)
