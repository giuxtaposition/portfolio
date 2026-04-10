const SVG_NS = 'http://www.w3.org/2000/svg'

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
    /** @type {number} */ this._prevW = 0
    /** @type {number} */ this._prevH = 0
    /** @type {number} */ this._rafId = 0

    if (!this._hasShell()) this._buildShell()

    /** @type {boolean} */ this._initialized = true
    this._setupResizeObserver()
  }

  disconnectedCallback() {
    this._initialized = false
    this._resizeObserver?.disconnect()
    if (this._rafId) cancelAnimationFrame(this._rafId)
  }

  /**
   * Patches only the affected DOM nodes when an observed attribute changes.
   * Gated on `_initialized` because browsers fire attributeChangedCallback
   * for HTML-parsed attributes BEFORE connectedCallback.
   */
  attributeChangedCallback(_name, oldValue, newValue) {
    if (!this._initialized) return
    if (oldValue === newValue) return

    switch (_name) {
      case 'header-left':
      case 'header-right':
        this._patchHeader()
        break
      case 'color':
      case 'corner-color':
        this._patchStroke()
        this._patchCorners()
        break
      case 'variant':
        this._patchPolygonPoints()
        break
    }
  }

  // ── Shell Construction (one-time) ───────────────────────────────────

  /** @returns {boolean} */
  _hasShell() {
    for (const child of this.children) {
      if (
        child.classList.contains('hud-panel__wrap') &&
        child.querySelector('.hud-panel__body')
      )
        return true
    }
    return false
  }

  /**
   * Builds the panel DOM shell once, moving any pre-existing children
   * (user content) into `.hud-panel__body`.
   *
   * For parser-inserted elements (e.g. `<hud-panel>` inside a parent's
   * innerHTML), children may not be available yet when connectedCallback
   * fires. A single microtask picks up any late-arriving children.
   *
   * Content arriving after the microtask must be injected directly
   * into `.hud-panel__body` (the stable body slot).
   *
   * @security User content is moved as live DOM nodes (not serialized
   * to HTML), preserving event listeners and avoiding injection risks.
   * Header text uses `textContent`; SVG attributes use `setAttribute`.
   * Neither path requires manual escaping.
   */
  _buildShell() {
    const userNodes = this._collectNonShellNodes()

    const wrap = document.createElement('div')
    wrap.className = 'hud-panel__wrap'

    this._svgEl = this._createFrameSvg()
    wrap.appendChild(this._svgEl)

    this._polygonEl = this._svgEl.querySelector('polygon')

    /** @type {HTMLDivElement | null} */
    this._headerEl = this._createHeaderElement()
    if (this._headerEl) wrap.appendChild(this._headerEl)

    this._bodyEl = document.createElement('div')
    this._bodyEl.className = 'hud-panel__body'
    for (const node of userNodes) this._bodyEl.appendChild(node)
    wrap.appendChild(this._bodyEl)

    this.textContent = ''
    this.appendChild(wrap)

    Promise.resolve().then(() => {
      if (!this.isConnected) return
      for (const node of this._collectNonShellNodes()) {
        this._bodyEl?.appendChild(node)
      }
    })
  }

  /**
   * Collects all current child nodes that are NOT part of the shell.
   * Filters out `.hud-panel__wrap` elements to handle corrupted/SSR
   * snapshots and avoid re-adopting the shell itself.
   *
   * @returns {Node[]}
   */
  _collectNonShellNodes() {
    const nodes = []
    for (const node of [...this.childNodes]) {
      if (
        node.nodeType === 1 &&
        /** @type {Element} */ (node).classList.contains('hud-panel__wrap')
      )
        continue
      nodes.push(node)
    }
    return nodes
  }

  /**
   * Creates the SVG frame element with polygon and optional corners.
   * @returns {SVGSVGElement}
   */
  _createFrameSvg() {
    const w = this.offsetWidth || 400
    const h = this.offsetHeight || 250

    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.classList.add('hud-panel__frame')
    svg.setAttribute('viewBox', `-1 -1 ${w + 2} ${h + 2}`)
    svg.setAttribute('preserveAspectRatio', 'none')
    svg.setAttribute('overflow', 'visible')
    svg.setAttribute('fill', 'none')

    const polygon = document.createElementNS(SVG_NS, 'polygon')
    polygon.setAttribute('points', this._computePoints(w, h))
    polygon.setAttribute('fill', 'var(--color-hud-panel-bg)')
    polygon.setAttribute('stroke', this._computeStroke())
    polygon.setAttribute('stroke-width', '1.2')
    svg.appendChild(polygon)

    this._appendCornerPolylines(svg, w, h)

    this._prevW = this.offsetWidth
    this._prevH = this.offsetHeight

    return svg
  }

  // ── Targeted Patchers ───────────────────────────────────────────────

  /** Patches the header element in-place (add, update, or remove). */
  _patchHeader() {
    const wrap = this.querySelector(':scope > .hud-panel__wrap')
    if (!wrap) return

    const headerLeft = this.getAttribute('header-left') || ''
    const headerRight = this.getAttribute('header-right') || ''
    const hasHeader = headerLeft || headerRight

    if (!hasHeader) {
      this._headerEl?.remove()
      this._headerEl = null
      return
    }

    if (!this._headerEl) {
      this._headerEl = this._createHeaderElement()
      if (!this._headerEl) return
      wrap.insertBefore(this._headerEl, this._bodyEl)
      return
    }

    const title = this._headerEl.querySelector('.hud-panel__header-title')
    if (title) title.textContent = headerLeft

    const existingTag = this._headerEl.querySelector('.hud-panel__tag')

    if (headerRight) {
      if (existingTag) {
        existingTag.textContent = headerRight
      } else {
        const tag = document.createElement('span')
        tag.className = 'hud-panel__tag'
        tag.textContent = headerRight
        this._headerEl.appendChild(tag)
      }
    } else {
      existingTag?.remove()
    }
  }

  /** Patches the polygon stroke color in-place. */
  _patchStroke() {
    this._polygonEl?.setAttribute('stroke', this._computeStroke())
  }

  /** Patches corner polylines in-place (add, update, or remove). */
  _patchCorners() {
    if (!this._svgEl) return

    const existing = this._svgEl.querySelectorAll('.hud-panel__corner')
    const raw = this.getAttribute('corner-color')

    if (!raw) {
      existing.forEach((el) => el.remove())
      return
    }

    const w = this.offsetWidth || 400
    const h = this.offsetHeight || 250
    const s = HudPanel.CORNER_SIZE

    if (existing.length === 2) {
      existing[0].setAttribute('points', `0,${s} 0,0 ${s},0`)
      existing[1].setAttribute(
        'points',
        `${w},${h - s} ${w},${h} ${w - s},${h}`,
      )
      existing.forEach((el) => el.setAttribute('stroke', raw))
      return
    }

    existing.forEach((el) => el.remove())
    this._appendCornerPolylines(this._svgEl, w, h)
  }

  /** Patches the polygon points attribute for variant changes. */
  _patchPolygonPoints() {
    if (!this._polygonEl) return

    const w = this.offsetWidth || 400
    const h = this.offsetHeight || 250
    this._polygonEl.setAttribute('points', this._computePoints(w, h))
  }

  /** Updates SVG geometry when the element resizes. */
  _updateGeometry() {
    const w = this.offsetWidth || 400
    const h = this.offsetHeight || 250

    if (!this._svgEl) return

    this._svgEl.setAttribute('viewBox', `-1 -1 ${w + 2} ${h + 2}`)

    this._polygonEl?.setAttribute('points', this._computePoints(w, h))

    const corners = this._svgEl.querySelectorAll('.hud-panel__corner')
    if (corners.length === 2) {
      const s = HudPanel.CORNER_SIZE
      corners[0].setAttribute('points', `0,${s} 0,0 ${s},0`)
      corners[1].setAttribute('points', `${w},${h - s} ${w},${h} ${w - s},${h}`)
    }

    this._prevW = this.offsetWidth
    this._prevH = this.offsetHeight
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  /**
   * @param {number} w
   * @param {number} h
   * @returns {string}
   */
  _computePoints(w, h) {
    return this._getShape()
      .map(([nx, ny]) => `${(nx * w).toFixed(1)},${(ny * h).toFixed(1)}`)
      .join(' ')
  }

  /** @returns {string} */
  _computeStroke() {
    if (this._hasCorners()) return 'var(--color-accent-low)'
    return this.getAttribute('color') || '#00e5ff'
  }

  /** @returns {ReadonlyArray<ReadonlyArray<number>>} */
  _getShape() {
    return this.getAttribute('variant') === 'polygon'
      ? HudPanel.POLYGON_SHAPE
      : HudPanel.RECTANGLE_SHAPE
  }

  /** @returns {boolean} */
  _hasCorners() {
    const attr = this.getAttribute('corner-color')
    return attr !== null && attr !== ''
  }

  /**
   * Creates a header element from current attributes, or null if no
   * header attributes are set.
   * @returns {HTMLDivElement | null}
   */
  _createHeaderElement() {
    const headerLeft = this.getAttribute('header-left') || ''
    const headerRight = this.getAttribute('header-right') || ''

    if (!headerLeft && !headerRight) return null

    const header = document.createElement('div')
    header.className = 'hud-panel__header'

    const title = document.createElement('span')
    title.className = 'hud-panel__header-title'
    title.textContent = headerLeft
    header.appendChild(title)

    if (headerRight) {
      const tag = document.createElement('span')
      tag.className = 'hud-panel__tag'
      tag.textContent = headerRight
      header.appendChild(tag)
    }

    return header
  }

  /**
   * Appends corner polyline elements to the given SVG.
   * @param {SVGSVGElement} svg
   * @param {number} w
   * @param {number} h
   */
  _appendCornerPolylines(svg, w, h) {
    const raw = this.getAttribute('corner-color')
    if (!raw) return

    const s = HudPanel.CORNER_SIZE

    const tl = document.createElementNS(SVG_NS, 'polyline')
    tl.classList.add('hud-panel__corner')
    tl.setAttribute('points', `0,${s} 0,0 ${s},0`)
    tl.setAttribute('stroke', raw)
    tl.setAttribute('stroke-width', '2')
    tl.setAttribute('fill', 'none')
    svg.appendChild(tl)

    const br = document.createElementNS(SVG_NS, 'polyline')
    br.classList.add('hud-panel__corner')
    br.setAttribute('points', `${w},${h - s} ${w},${h} ${w - s},${h}`)
    br.setAttribute('stroke', raw)
    br.setAttribute('stroke-width', '2')
    br.setAttribute('fill', 'none')
    svg.appendChild(br)
  }

  _setupResizeObserver() {
    this._resizeObserver?.disconnect()
    this._resizeObserver = new ResizeObserver(() => {
      if (this._rafId) return
      this._rafId = requestAnimationFrame(() => {
        this._rafId = 0
        const w = this.offsetWidth
        const h = this.offsetHeight
        if (w === this._prevW && h === this._prevH) return
        this._updateGeometry()
      })
    })
    this._resizeObserver.observe(this)
  }
}

customElements.define('hud-panel', HudPanel)
