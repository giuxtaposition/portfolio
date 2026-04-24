// @vitest-environment happy-dom
import { describe } from 'vitest'
import { createElement } from '../../../test-utils'
import { it } from 'vitest'
import { expect } from 'vitest'
import { afterEach } from 'vitest'
import { vi } from 'vitest'
import './hud-list-item.js'

const COMPONENT_NAME = 'hud-list-item'

describe(COMPONENT_NAME, () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should be registered as custom element', () => {
    const Ctor = customElements.get(COMPONENT_NAME)

    expect(Ctor).toBeDefined()
  })

  it('should create element with role listitem', () => {
    const elelement = createElement(COMPONENT_NAME)

    expect(elelement.role).toBe('listitem')
  })

  it('should show element as listitem', () => {
    const elelement = createElement(COMPONENT_NAME)

    expect(elelement.style.display).toBe('list-item')
  })

  it('should show marker when marker attribute is set', () => {
    const elelement = createElement(COMPONENT_NAME, [
      {
        name: 'marker',
        value: 'x',
      },
    ])

    const marker = elelement.querySelector('span')
    expect(marker).toBeDefined()
    expect(marker?.className).toEqual('hud-list-item__marker')
    expect(marker?.innerHTML).toEqual('x')
  })

  it('should show default marker when marker attribute is not set', () => {
    const elelement = createElement(COMPONENT_NAME)

    expect(elelement.querySelector('span')?.innerHTML).toEqual('▹')
  })
})
