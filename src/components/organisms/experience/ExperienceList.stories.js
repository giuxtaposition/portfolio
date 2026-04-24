import '../../atoms/hud-list-item/hud-list-item.js'
import '../../atoms/tech-tag/tech-tag.js'
import './experience-list.js'

export default {
  title: 'Organisms/ExperienceList',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.className = 'section'
    const container = document.createElement('div')
    container.className = 'container'
    container.appendChild(document.createElement('experience-list'))
    section.appendChild(container)
    return section
  },
}
