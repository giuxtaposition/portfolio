import '../../atoms/hud-list-item/hud-list-item.js'
import './experience-item.js'

export default {
  title: 'Molecules/ExperienceItem',
  tags: ['autodocs'],
}

const mockItem = {
  role: 'Software Developer',
  company: 'viteSicure',
  url: 'https://vitesicure.it',
  period: 'March 2023 — Present',
  description: 'Building a cloud-based web application in a fast-paced startup environment.',
  highlights: [
    'Apply Domain-Driven Design and Extreme Programming principles.',
    'Build and optimize a Node.js backend with TypeScript and NestJS.',
  ],
  tags: ['TypeScript', 'React', 'NestJs', 'Node.js'],
}

export const Default = {
  render: () => {
    const el = document.createElement('experience-item')
    el.dataset.role = mockItem.role
    el.dataset.company = mockItem.company
    el.dataset.url = mockItem.url
    el.dataset.period = mockItem.period
    el.dataset.description = mockItem.description
    el.dataset.highlights = JSON.stringify(mockItem.highlights)
    el.dataset.tags = JSON.stringify(mockItem.tags)
    return el
  },
}
