import '../../atoms/hud-list-item/hud-list-item.js'
import './about-section.js'

export default {
  title: 'Organisms/AboutSection',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.className = 'section'
    const container = document.createElement('div')
    container.className = 'container'
    container.appendChild(document.createElement('about-section'))
    section.appendChild(container)
    return section
  },
}
