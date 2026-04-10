// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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

  describe('section structure', () => {
    it('should render a hud-panel element', () => {
      const el = createElement()

      const panel = el.querySelector('hud-panel')

      expect(panel).not.toBeNull()
    })

    it('should set class "about" on the hud-panel', () => {
      const el = createElement()

      const panel = el.querySelector('hud-panel')

      expect(panel?.classList.contains('about')).toBe(true)
    })

    it('should set header-left attribute on hud-panel matching sectionTitle', () => {
      const el = createElement()

      const panel = el.querySelector('hud-panel')

      expect(panel?.getAttribute('header-left')).toBe(MOCK_ABOUT.sectionTitle)
    })

    it('should set header-right attribute on hud-panel to "SYS.01"', () => {
      const el = createElement()

      const panel = el.querySelector('hud-panel')

      expect(panel?.getAttribute('header-right')).toBe('SYS.01')
    })

    it('should not render a separate section label or heading outside the panel', () => {
      const el = createElement()

      const label = el.querySelector(':scope > .section__label')
      const title = el.querySelector(':scope > .section__title')

      expect(label).toBeNull()
      expect(title).toBeNull()
    })
  })

  describe('content rendering', () => {
    it('should render about description paragraph', () => {
      const el = createElement()

      const description = el.querySelector('.about__description')

      expect(description?.textContent).toContain(MOCK_ABOUT.description)
    })

    it('should render about description as a p element', () => {
      const el = createElement()

      const description = el.querySelector('p.about__description')

      expect(description).not.toBeNull()
    })

    it('should render about subtitle paragraph', () => {
      const el = createElement()

      const subtitle = el.querySelector('.about__subtitle')

      expect(subtitle?.textContent).toBe(MOCK_ABOUT.subtitle)
    })

    it('should render about subtitle as a p element', () => {
      const el = createElement()

      const subtitle = el.querySelector('p.about__subtitle')

      expect(subtitle).not.toBeNull()
    })

    it('should render about list with class "about__list"', () => {
      const el = createElement()

      const list = el.querySelector('.about__list')

      expect(list).not.toBeNull()
    })

    it('should render about list as a ul element', () => {
      const el = createElement()

      const list = el.querySelector('ul.about__list')

      expect(list).not.toBeNull()
    })

    it('should render about list with role="list"', () => {
      const el = createElement()

      const list = el.querySelector('.about__list')

      expect(list?.getAttribute('role')).toBe('list')
    })

    it('should render the correct number of list items', () => {
      const el = createElement()

      const items = el.querySelectorAll('.about__item')

      expect(items.length).toBe(ITEMS_COUNT)
    })

    it('should render each list item as an li element with class "about__item"', () => {
      const el = createElement()

      const items = el.querySelectorAll('li.about__item')

      expect(items.length).toBe(ITEMS_COUNT)
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

  describe('content placement inside hud-panel', () => {
    it('should render description inside the hud-panel body', () => {
      const el = createElement()

      const body = el.querySelector('hud-panel .hud-panel__body')
      const description = body?.querySelector('.about__description')

      expect(description).not.toBeNull()
    })

    it('should render subtitle inside the hud-panel body', () => {
      const el = createElement()

      const body = el.querySelector('hud-panel .hud-panel__body')
      const subtitle = body?.querySelector('.about__subtitle')

      expect(subtitle).not.toBeNull()
    })

    it('should render list inside the hud-panel body', () => {
      const el = createElement()

      const body = el.querySelector('hud-panel .hud-panel__body')
      const list = body?.querySelector('.about__list')

      expect(list).not.toBeNull()
    })
  })

  describe('no hud-frame', () => {
    it('should NOT have any element with class "hud-frame"', () => {
      const el = createElement()

      const hudFrame = el.querySelector('.hud-frame')

      expect(hudFrame).toBeNull()
    })
  })
})
