import { escapeAttr } from '../utils.js'

class HudPanel extends HTMLElement {
  static RECTANGLE_SHAPE = Object.freeze([
    Object.freeze([0, 0]),
    Object.freeze([1, 0]),
    Object.freeze([1, 1]),
    Object.freeze([0, 1]),
  ])

  static CORNER_SIZE = 16

  static POLYGON_SHAPE = Object.freeze([
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
    return ['header-left', 'header-right', 'color', 'variant', 'corner-color']
  }

  connectedCallback() {
    /** @type {string} */ this._originalContent = this.innerHTML
    /** @type {number} */ this._prevW = 0
    /** @type {number} */ this._prevH = 0
    /** @type {number} */ this._rafId = 0

    this.render()
    this._setupResizeObserver()
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect()
    if (this._rafId) cancelAnimationFrame(this._rafId)
  }

  attributeChangedCallback() {
    if (!this.isConnected) return
    if (this._originalContent === undefined) return
    this.render()
  }

  /** @returns {ReadonlyArray<ReadonlyArray<number>>} */
  _getShape() {
    return this.getAttribute('variant') === 'polygon'
      ? HudPanel.POLYGON_SHAPE
      : HudPanel.RECTANGLE_SHAPE
  }

  _setupResizeObserver() {
    this._resizeObserver?.disconnect()
    this._resizeObserver = undefined

    this._resizeObserver = new ResizeObserver(() => {
      if (this._rafId) return
      this._rafId = requestAnimationFrame(() => {
        this._rafId = 0
        const w = this.offsetWidth
        const h = this.offsetHeight
        if (w === this._prevW && h === this._prevH) return
        this.render()
      })
    })
    this._resizeObserver.observe(this)
  }

  render() {
    const color = escapeAttr(this.getAttribute('color') || '#00e5ff')
    const headerHTML = this._renderHeader()
    this._renderPolygon(color, headerHTML)
  }

  /** @returns {string} */
  _renderHeader() {
    const headerLeft = this.getAttribute('header-left') || ''
    const headerRight = this.getAttribute('header-right') || ''

    if (!headerLeft && !headerRight) return ''

    const safeLeft = escapeAttr(headerLeft)
    const rightTag = headerRight
      ? `<span class="hud-panel__tag">${escapeAttr(headerRight)}</span>`
      : ''

    return `<div class="hud-panel__header"><span class="hud-panel__header-title">${safeLeft}</span>${rightTag}</div>`
  }

  /**
   * @param {string} color
   * @param {string} headerHTML
   */
  _renderPolygon(color, headerHTML) {
    const shape = this._getShape()
    const w = this.offsetWidth || 400
    const h = this.offsetHeight || 250
    this._prevW = this.offsetWidth
    this._prevH = this.offsetHeight

    const points = shape
      .map(([nx, ny]) => `${(nx * w).toFixed(1)},${(ny * h).toFixed(1)}`)
      .join(' ')

    const viewBox = `-1 -1 ${w + 2} ${h + 2}`
    const cornerHTML = this._renderCorners(w, h)

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
            stroke="${this._cornersEnabled()
              ? 'var(--color-accent-low)'
              : color}"
            stroke-width="1.2"
          />
          ${cornerHTML}
        </svg>

        ${headerHTML}

        <div class="hud-panel__body">${this._originalContent}</div>
      </div>
    `
  }

  /**
   * @param {number} w
   * @param {number} h
   * @returns {string}
   */
  _renderCorners(w, h) {
    const raw = this.getAttribute('corner-color')
    if (!raw) return ''

    const cornerColor = escapeAttr(raw)
    const s = HudPanel.CORNER_SIZE

    return `
          <polyline
            class="hud-panel__corner"
            points="0,${s} 0,0 ${s},0"
            stroke="${cornerColor}"
            stroke-width="2"
            fill="none"
          />
          <polyline
            class="hud-panel__corner"
            points="${w},${h - s} ${w},${h} ${w - s},${h}"
            stroke="${cornerColor}"
            stroke-width="2"
            fill="none"
          />`
  }

  _cornersEnabled() {
    return (
      this.hasAttribute('corner-color') &&
      this.getAttribute('corner-color') !== ''
    )
  }
}

customElements.define('hud-panel', HudPanel)
