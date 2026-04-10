// @vitest-environment happy-dom
import { describe } from 'vitest'
import { createElement } from '../../../test-utils.js'
import { it } from 'vitest'
import { expect } from 'vitest'
import { afterEach } from 'vitest'
import { vi } from 'vitest'
import './circuit-line-divider.js'

const COMPONENT_NAME = 'circuit-line-divider'

describe(COMPONENT_NAME, () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should be registered as custom element', () => {
    const Ctor = customElements.get(COMPONENT_NAME)

    expect(Ctor).toBeDefined()
  })

  it('should create element with role separator', () => {
    const elelement = createElement(COMPONENT_NAME)

    expect(elelement.role).toBe('separator')
  })

  it('should create element with aria-hidden set to true', () => {
    const elelement = createElement(COMPONENT_NAME)

    expect(elelement.getAttribute('aria-hidden')).toBe('true')
  })
})
