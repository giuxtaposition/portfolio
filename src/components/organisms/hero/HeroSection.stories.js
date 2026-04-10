import './hero-section.js'

export default {
  title: 'Organisms/HeroSection',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.className = 'section'
    const container = document.createElement('div')
    container.className = 'container'
    container.appendChild(document.createElement('hero-section'))
    section.appendChild(container)
    return section
  },
}
