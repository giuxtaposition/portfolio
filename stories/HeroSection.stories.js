import { ensureContent, container } from './helpers.js'

export default {
  title: 'Organisms/HeroSection',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.classList.add('section')
    section.setAttribute('aria-label', 'Introduction')
    const inner = container('')
    const hero = document.createElement('hero-section')
    inner.appendChild(hero)
    section.appendChild(inner)
    return section
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/hero-section.js')
  },
}
