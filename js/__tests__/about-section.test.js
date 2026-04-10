// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('../data.js', () => ({
  getContent: vi.fn(() => ({
    about: {
      sectionTitle: 'About Me',
      description: 'Test description text',
      subtitle: 'Test subtitle:',
      items: [
        'Item one',
        'Item two',
        {
          text: 'Item three',
          preview: { matchText: 'three', image: 'test.jpg' },
        },
      ],
    },
  })),
}))

vi.mock('../hover-preview.js', () => ({
  renderAboutItem: vi.fn((item) => {
    const text = typeof item === 'string' ? item : item.text
    return `<span>${text}</span>`
  }),
}))

import '../components/hud-panel.js'
import '../components/about-section.js'
import { getContent } from '../data.js'
import { renderAboutItem } from '../hover-preview.js'

const MOCK_ABOUT = getContent().about
const ITEMS_COUNT = MOCK_ABOUT.items.length

/**
 * Creates an <about-section> and appends it to the DOM.
 * @returns {HTMLElement}
 */
function createElement() {
  const el = document.createElement('about-section')
  document.body.appendChild(el)
  return el
}

describe('about-section', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('registration', () => {
    it('should be registered as a custom element', () => {
      const Ctor = customElements.get('about-section')

      expect(Ctor).toBeDefined()
    })

    it('should be an instance of HTMLElement', () => {
      const el = createElement()

      expect(el).toBeInstanceOf(HTMLElement)
    })
  })

  describe('data integration', () => {
    it('should call getContent once during render', () => {
      createElement()

      expect(getContent).toHaveBeenCalledOnce()
    })

    it('should call renderAboutItem for each item', () => {
      createElement()

      expect(renderAboutItem).toHaveBeenCalledTimes(ITEMS_COUNT)
    })

    it('should call renderAboutItem with string items', () => {
      createElement()

      expect(renderAboutItem).toHaveBeenCalledWith('Item one')
      expect(renderAboutItem).toHaveBeenCalledWith('Item two')
    })

    it('should call renderAboutItem with object items', () => {
      createElement()

      expect(renderAboutItem).toHaveBeenCalledWith({
        text: 'Item three',
        preview: { matchText: 'three', image: 'test.jpg' },
      })
    })

    it('should render the HTML returned by renderAboutItem inside each list item', () => {
      const el = createElement()

      const firstItem = el.querySelectorAll('.about__item')[0]

      expect(firstItem?.innerHTML).toContain('<span>Item one</span>')
    })
  })
})
