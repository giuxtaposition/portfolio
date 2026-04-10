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

  describe('observed attributes', () => {
    it('should observe header-left, header-right, color, variant, and corner-color', () => {
      const Ctor = customElements.get('hud-panel')

      // @ts-expect-error — observedAttributes is a static getter on the class
      const observed = Ctor.observedAttributes

      expect(observed).toContain('header-left')
      expect(observed).toContain('header-right')
      expect(observed).toContain('color')
      expect(observed).toContain('variant')
      expect(observed).toContain('corner-color')
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

  describe('ResizeObserver lifecycle', () => {
    it('should set up a ResizeObserver on connect (frame variant)', () => {
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
        const el = createElement({ variant: 'frame' })

        expect(observeSpy).toHaveBeenCalledWith(el)
      } finally {
        globalThis.ResizeObserver = OriginalResizeObserver
      }
    })

    it('should set up a ResizeObserver on connect (polygon variant)', () => {
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
        const el = createElement({ variant: 'polygon' })

        expect(observeSpy).toHaveBeenCalledWith(el)
      } finally {
        globalThis.ResizeObserver = OriginalResizeObserver
      }
    })

    it('should disconnect ResizeObserver for frame variant on removal', () => {
      const disconnectSpy = vi.fn()
      const OriginalResizeObserver = globalThis.ResizeObserver
      globalThis.ResizeObserver = /** @type {any} */ (
        vi.fn(function () {
          this.observe = vi.fn()
          this.disconnect = disconnectSpy
          this.unobserve = vi.fn()
        })
      )

      try {
        const el = createElement({ variant: 'frame' })

        el.remove()

        expect(disconnectSpy).toHaveBeenCalled()
      } finally {
        globalThis.ResizeObserver = OriginalResizeObserver
      }
    })

    it('should disconnect ResizeObserver for polygon variant on removal', () => {
      const disconnectSpy = vi.fn()
      const OriginalResizeObserver = globalThis.ResizeObserver
      globalThis.ResizeObserver = /** @type {any} */ (
        vi.fn(function () {
          this.observe = vi.fn()
          this.disconnect = disconnectSpy
          this.unobserve = vi.fn()
        })
      )

      try {
        const el = createElement({ variant: 'polygon' })

        el.remove()

        expect(disconnectSpy).toHaveBeenCalled()
      } finally {
        globalThis.ResizeObserver = OriginalResizeObserver
      }
    })
  })

  describe('attributeChangedCallback guard', () => {
    it('should not re-render when frame element is not connected to the DOM', () => {
      const el = document.createElement('hud-panel')
      el.setAttribute('variant', 'frame')
      // @ts-expect-error — accessing render method for spy
      const renderSpy = vi.spyOn(el, 'render')

      el.setAttribute('header-left', 'Ghost')

      expect(renderSpy).not.toHaveBeenCalled()
    })

    it('should not re-render when polygon element is not connected to the DOM', () => {
      const el = document.createElement('hud-panel')
      el.setAttribute('variant', 'polygon')
      // @ts-expect-error — accessing render method for spy
      const renderSpy = vi.spyOn(el, 'render')

      el.setAttribute('header-left', 'Ghost')

      expect(renderSpy).not.toHaveBeenCalled()
    })
  })
})
