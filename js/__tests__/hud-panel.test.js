// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest'
import '../components/hud-panel.js'

/**
 * Creates a <hud-panel>, sets optional attributes, optionally adds inner HTML,
 * and appends it to the DOM.
 * @param {Record<string, string>} [attrs]
 * @param {string} [innerContent]
 * @returns {HTMLElement}
 */
function createElement(attrs = {}, innerContent = '') {
  const el = document.createElement('hud-panel')
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
  if (innerContent) el.innerHTML = innerContent
  document.body.appendChild(el)
  return el
}

describe('hud-panel', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('registration', () => {
    it('should be registered as a custom element', () => {
      const Ctor = customElements.get('hud-panel')

      expect(Ctor).toBeDefined()
    })

    it('should be an instance of HTMLElement', () => {
      const el = createElement()

      expect(el).toBeInstanceOf(HTMLElement)
    })
  })

  describe('default rendering', () => {
    it('should render a .hud-panel__wrap container', () => {
      const el = createElement()

      expect(el.querySelector('.hud-panel__wrap')).not.toBeNull()
    })

    it('should render an SVG with class .hud-panel__frame', () => {
      const el = createElement()

      expect(el.querySelector('svg.hud-panel__frame')).not.toBeNull()
    })

    it('should render a .hud-panel__body div', () => {
      const el = createElement()

      expect(el.querySelector('.hud-panel__body')).not.toBeNull()
    })

    it('should render the SVG with a polygon element', () => {
      const el = createElement()

      expect(el.querySelector('svg.hud-panel__frame polygon')).not.toBeNull()
    })

    it('should render a polygon with 12 points', () => {
      const el = createElement()

      const polygon = el.querySelector('svg.hud-panel__frame polygon')
      const points = polygon?.getAttribute('points') ?? ''
      const pointPairs = points.split(' ')

      expect(pointPairs).toHaveLength(12)
    })
  })

  describe('attribute defaults', () => {
    it('should compute the first polygon point from SHAPE[0] normalized coordinates', () => {
      const el = createElement()
      const polygon = el.querySelector('svg.hud-panel__frame polygon')

      const points = polygon?.getAttribute('points') ?? ''
      const pointPairs = points.split(' ')
      const [firstPointX, firstPointY] = pointPairs[0].split(',')

      expect(pointPairs).toHaveLength(12)
      expect(firstPointX).toBe('11.2')
      expect(firstPointY).toBe('31.2')
    })

    it('should default color to #00e5ff', () => {
      const el = createElement()

      const polygon = el.querySelector('svg.hud-panel__frame polygon')
      const stroke = polygon?.getAttribute('stroke')

      expect(stroke).toBe('#00e5ff')
    })
  })

  describe('header visibility', () => {
    it('should NOT render a .hud-panel__header when both header attributes are absent', () => {
      const el = createElement()

      expect(el.querySelector('.hud-panel__header')).toBeNull()
    })

    it('should NOT render a .hud-panel__header when both header attributes are empty strings', () => {
      const el = createElement({ 'header-left': '', 'header-right': '' })

      expect(el.querySelector('.hud-panel__header')).toBeNull()
    })

    it('should render a .hud-panel__header when header-left is set', () => {
      const el = createElement({ 'header-left': 'Status' })

      expect(el.querySelector('.hud-panel__header')).not.toBeNull()
    })

    it('should render a .hud-panel__header when header-right is set', () => {
      const el = createElement({ 'header-right': 'ACTIVE' })

      expect(el.querySelector('.hud-panel__header')).not.toBeNull()
    })

    it('should render a .hud-panel__header when both header attributes are set', () => {
      const el = createElement({
        'header-left': 'Status',
        'header-right': 'ACTIVE',
      })

      expect(el.querySelector('.hud-panel__header')).not.toBeNull()
    })
  })

  describe('header content', () => {
    it('should display header-left text on the left side', () => {
      const el = createElement({ 'header-left': 'Navigation' })

      const header = el.querySelector('.hud-panel__header')

      expect(header?.textContent).toContain('Navigation')
    })

    it('should display header-right text as a tag/badge', () => {
      const el = createElement({ 'header-right': 'ONLINE' })

      const tag = el.querySelector('.hud-panel__tag')

      expect(tag?.textContent).toContain('ONLINE')
    })

    it('should display both header texts when both are set', () => {
      const el = createElement({
        'header-left': 'System',
        'header-right': 'OK',
      })

      const header = el.querySelector('.hud-panel__header')

      expect(header?.textContent).toContain('System')
      expect(header?.textContent).toContain('OK')
    })
  })

  describe('custom attributes', () => {
    it('should use custom color in the rendered output', () => {
      const el = createElement({ color: '#ff0044' })

      const polygon = el.querySelector('svg.hud-panel__frame polygon')

      expect(polygon?.getAttribute('stroke')).toBe('#ff0044')
    })
  })

  describe('content preservation', () => {
    it('should preserve original innerHTML inside .hud-panel__body', () => {
      const el = createElement({}, '<p>Hello HUD</p>')

      const body = el.querySelector('.hud-panel__body')

      expect(body?.querySelector('p')?.textContent).toBe('Hello HUD')
    })

    it('should preserve multiple children inside .hud-panel__body', () => {
      const el = createElement({}, '<p>First</p><span>Second</span>')

      const body = el.querySelector('.hud-panel__body')

      expect(body?.querySelector('p')?.textContent).toBe('First')
      expect(body?.querySelector('span')?.textContent).toBe('Second')
    })

    it('should restore original content after re-render, not runtime mutations', () => {
      const el = createElement({}, '<p>Original</p>')
      const body = el.querySelector('.hud-panel__body')
      if (body) body.innerHTML = '<p>Mutated</p>'

      el.setAttribute('color', '#ff0000')

      expect(el.querySelector('.hud-panel__body p')?.textContent).toBe(
        'Original',
      )
    })
  })

  describe('attribute changes', () => {
    it('should re-render when header-left changes', () => {
      const el = createElement({ 'header-left': 'Before' })
      expect(el.querySelector('.hud-panel__header')?.textContent).toContain(
        'Before',
      )

      el.setAttribute('header-left', 'After')

      expect(el.querySelector('.hud-panel__header')?.textContent).toContain(
        'After',
      )
    })

    it('should re-render when header-right changes', () => {
      const el = createElement({ 'header-right': 'v1' })
      expect(el.querySelector('.hud-panel__tag')?.textContent).toContain('v1')

      el.setAttribute('header-right', 'v2')

      expect(el.querySelector('.hud-panel__tag')?.textContent).toContain('v2')
    })

    it('should re-render when color changes', () => {
      const el = createElement({ color: '#00e5ff' })

      el.setAttribute('color', '#ff00ff')

      const polygon = el.querySelector('svg.hud-panel__frame polygon')
      expect(polygon?.getAttribute('stroke')).toBe('#ff00ff')
    })

    it('should remove header when header-left is removed and header-right is absent', () => {
      const el = createElement({ 'header-left': 'Title' })
      expect(el.querySelector('.hud-panel__header')).not.toBeNull()

      el.removeAttribute('header-left')

      expect(el.querySelector('.hud-panel__header')).toBeNull()
    })

    it('should add header when header-left is set on a previously headerless panel', () => {
      const el = createElement()
      expect(el.querySelector('.hud-panel__header')).toBeNull()

      el.setAttribute('header-left', 'New Title')

      const header = el.querySelector('.hud-panel__header')
      expect(header).not.toBeNull()
      expect(header?.textContent).toContain('New Title')
    })

    it('should preserve body content after attribute changes', () => {
      const el = createElement({ 'header-left': 'Title' }, '<p>Keep me</p>')

      el.setAttribute('header-left', 'New Title')

      expect(el.querySelector('.hud-panel__body p')?.textContent).toBe(
        'Keep me',
      )
    })

    it('should not re-render when element is not connected to the DOM', () => {
      const el = document.createElement('hud-panel')
      // @ts-expect-error — accessing render method for spy
      const renderSpy = vi.spyOn(el, 'render')

      el.setAttribute('header-left', 'Ghost')

      expect(renderSpy).not.toHaveBeenCalled()
    })
  })

  describe('observed attributes', () => {
    it('should observe header-left, header-right, and color', () => {
      const Ctor = customElements.get('hud-panel')

      // @ts-expect-error — observedAttributes is a static getter on the class
      const observed = Ctor.observedAttributes

      expect(observed).toContain('header-left')
      expect(observed).toContain('header-right')
      expect(observed).toContain('color')
    })

    it('should NOT observe cut', () => {
      const Ctor = customElements.get('hud-panel')

      // @ts-expect-error — observedAttributes is a static getter on the class
      const observed = Ctor.observedAttributes

      expect(observed).not.toContain('cut')
    })

    it('should NOT observe line-extend', () => {
      const Ctor = customElements.get('hud-panel')

      // @ts-expect-error — observedAttributes is a static getter on the class
      const observed = Ctor.observedAttributes

      expect(observed).not.toContain('line-extend')
    })
  })

  describe('ResizeObserver', () => {
    it('should set up a ResizeObserver on connect', () => {
      const observeSpy = vi.fn()
      const disconnectSpy = vi.fn()
      const OriginalResizeObserver = globalThis.ResizeObserver
      globalThis.ResizeObserver = /** @type {any} */ (
        vi.fn(function () {
          this.observe = observeSpy
          this.disconnect = disconnectSpy
          this.unobserve = vi.fn()
        })
      )

      try {
        const el = createElement()

        expect(observeSpy).toHaveBeenCalledWith(el)
      } finally {
        globalThis.ResizeObserver = OriginalResizeObserver
      }
    })

    it('should disconnect the ResizeObserver when removed from the DOM', () => {
      const observeSpy = vi.fn()
      const disconnectSpy = vi.fn()
      const OriginalResizeObserver = globalThis.ResizeObserver
      globalThis.ResizeObserver = /** @type {any} */ (
        vi.fn(function () {
          this.observe = observeSpy
          this.disconnect = disconnectSpy
          this.unobserve = vi.fn()
        })
      )

      try {
        const el = createElement()
        expect(disconnectSpy).not.toHaveBeenCalled()

        el.remove()

        expect(disconnectSpy).toHaveBeenCalled()
      } finally {
        globalThis.ResizeObserver = OriginalResizeObserver
      }
    })
  })

  describe('edge cases', () => {
    it('should render correctly with all attributes set simultaneously', () => {
      const el = createElement({
        'header-left': 'Panel',
        'header-right': 'LIVE',
        color: '#ff6600',
      })

      const header = el.querySelector('.hud-panel__header')
      const svg = el.querySelector('svg.hud-panel__frame')
      const body = el.querySelector('.hud-panel__body')

      expect(header).not.toBeNull()
      expect(header?.textContent).toContain('Panel')
      expect(header?.textContent).toContain('LIVE')
      expect(svg).not.toBeNull()
      expect(body).not.toBeNull()
      expect(svg?.querySelector('polygon')?.getAttribute('stroke')).toBe(
        '#ff6600',
      )
    })
  })

  describe('security', () => {
    it('should escape HTML in header-left attribute', () => {
      const el = createElement({
        'header-left': '<img src=x onerror=alert(1)>',
      })

      const header = el.querySelector('.hud-panel__header')
      const html = header?.innerHTML ?? ''

      expect(html).not.toContain('<img')
      expect(html).toContain('&lt;img')
    })

    it('should escape HTML in header-right attribute', () => {
      const el = createElement({
        'header-right': '<script>alert(1)</script>',
      })

      const header = el.querySelector('.hud-panel__header')
      const html = header?.innerHTML ?? ''

      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;script&gt;')
    })

    it('should escape dangerous characters in color attribute', () => {
      const el = createElement({ color: '#fff" onload="alert(1)' })

      const polygon = el.querySelector('svg.hud-panel__frame polygon')

      expect(polygon?.getAttribute('onload')).toBeNull()
    })
  })

  describe('structure order', () => {
    it('should render SVG frame before body inside .hud-panel__wrap', () => {
      const el = createElement()

      const wrap = el.querySelector('.hud-panel__wrap')
      const children = Array.from(wrap?.children ?? [])
      const svgIndex = children.findIndex(
        (c) => c.tagName.toLowerCase() === 'svg',
      )
      const bodyIndex = children.findIndex((c) =>
        c.classList?.contains('hud-panel__body'),
      )

      expect(svgIndex).toBeGreaterThanOrEqual(0)
      expect(bodyIndex).toBeGreaterThanOrEqual(0)
      expect(svgIndex).toBeLessThan(bodyIndex)
    })

    it('should render header between SVG and body when present', () => {
      const el = createElement({ 'header-left': 'Title' })

      const wrap = el.querySelector('.hud-panel__wrap')
      const children = Array.from(wrap?.children ?? [])
      const svgIndex = children.findIndex(
        (c) => c.tagName.toLowerCase() === 'svg',
      )
      const headerIndex = children.findIndex((c) =>
        c.classList?.contains('hud-panel__header'),
      )
      const bodyIndex = children.findIndex((c) =>
        c.classList?.contains('hud-panel__body'),
      )

      expect(svgIndex).toBeGreaterThanOrEqual(0)
      expect(headerIndex).toBeGreaterThanOrEqual(0)
      expect(bodyIndex).toBeGreaterThanOrEqual(0)
      expect(svgIndex).toBeLessThan(headerIndex)
      expect(headerIndex).toBeLessThan(bodyIndex)
    })
  })
})
