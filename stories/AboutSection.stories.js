import { expect } from 'storybook/test'
import { ensureContent, container } from './helpers.js'

export default {
  title: 'Organisms/AboutSection',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.classList.add('section')
    section.setAttribute('aria-label', 'About me')
    const inner = container('')
    const about = document.createElement('about-section')
    inner.appendChild(about)
    section.appendChild(inner)
    return section
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/about-section.js')
  },
  play: async ({ canvasElement }) => {
    const about = canvasElement.querySelector('about-section')

    // section structure — hud-panel
    const panel = about.querySelector('hud-panel')
    expect(panel).not.toBeNull()
    expect(panel.classList.contains('about')).toBe(true)
    expect(panel.getAttribute('variant')).toBe('polygon')
    expect(panel.getAttribute('header-left')).toBe('About Me')
    expect(panel.getAttribute('header-right')).toBe('SYS.01')

    // no separate section label/heading outside the panel
    expect(about.querySelector(':scope > .section__label')).toBeNull()
    expect(about.querySelector(':scope > .section__title')).toBeNull()

    // content rendering — description
    const description = about.querySelector('.about__description')
    expect(description).not.toBeNull()
    expect(description.tagName.toLowerCase()).toBe('p')

    // content rendering — subtitle
    const subtitle = about.querySelector('.about__subtitle')
    expect(subtitle).not.toBeNull()
    expect(subtitle.tagName.toLowerCase()).toBe('p')

    // content rendering — list
    const list = about.querySelector('.about__list')
    expect(list).not.toBeNull()
    expect(list.tagName.toLowerCase()).toBe('ul')
    expect(list.getAttribute('role')).toBe('list')

    // list items
    const items = about.querySelectorAll('.about__item')
    expect(items.length).toBeGreaterThan(0)

    // each item is an li
    items.forEach((item) => {
      expect(item.tagName.toLowerCase()).toBe('li')
    })

    // content placement inside hud-panel body
    const body = about.querySelector('hud-panel .hud-panel__body')
    expect(body.querySelector('.about__description')).not.toBeNull()
    expect(body.querySelector('.about__subtitle')).not.toBeNull()
    expect(body.querySelector('.about__list')).not.toBeNull()

    // no old hud-frame
    expect(about.querySelector('.hud-frame')).toBeNull()
  },
}
