import './contact-section.js'

export default {
  title: 'Organisms/ContactSection',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.className = 'section'
    const container = document.createElement('div')
    container.className = 'container'
    container.appendChild(document.createElement('contact-section'))
    section.appendChild(container)
    return section
  },
}
