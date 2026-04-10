import { ensureContent, container } from './helpers.js'

export default {
  title: 'Organisms/ContactSection',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.classList.add('section')
    section.setAttribute('aria-label', 'Contact')
    const inner = container('')
    const contact = document.createElement('contact-section')
    inner.appendChild(contact)
    section.appendChild(inner)
    return section
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/contact-section.js')
  },
}
