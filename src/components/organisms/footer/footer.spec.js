// @vitest-environment happy-dom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { createElement } from '../../../test-utils.js'

vi.mock('../../../data.js', () => ({
  getContent: vi.fn(() => ({
    footer: { text: 'Built by Test © {{year}}' },
  })),
  loadContent: vi.fn(),
}))

import { getContent } from '../../../data.js'
import './footer.js'

describe('site-footer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should be registered as a custom element', () => {
    expect(customElements.get('site-footer')).toBeDefined()
  })

  it('should render the copyright text with the current year', () => {
    const el = createElement('site-footer')
    const p = el.querySelector('p')
    expect(p?.textContent).toContain(String(new Date().getFullYear()))
    expect(p?.textContent).toContain('Built by Test ©')
  })

  it('should render a circuit-line-divider', () => {
    const el = createElement('site-footer')
    expect(el.querySelector('circuit-line-divider')).not.toBeNull()
  })

  it('should render empty text gracefully when content is not loaded', () => {
    vi.mocked(getContent).mockImplementationOnce(() => {
      throw new Error('Content not loaded')
    })
    const el = createElement('site-footer')
    expect(el.querySelector('p')?.textContent).toBe('')
  })
})
