import { ensureContent, container } from './helpers.js'

export default {
  title: 'Molecules/ExperienceList',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const section = document.createElement('section')
    section.classList.add('section')
    section.setAttribute('aria-label', 'Experience')
    const inner = container('')
    const list = document.createElement('experience-list')
    inner.appendChild(list)
    section.appendChild(inner)
    return section
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/experience-list.js')
  },
}

export const SingleItem = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.maxWidth = '700px'

    const title = document.createElement('h2')
    title.classList.add('section__title')
    title.textContent = 'Experience'
    wrapper.appendChild(title)

    const timeline = document.createElement('div')
    timeline.classList.add('experience__timeline')
    timeline.setAttribute('role', 'list')
    timeline.setAttribute('aria-label', 'Work experience')

    const item = document.createElement('experience-item')
    item.dataset.index = '0'
    item.dataset.role = 'Software Developer'
    item.dataset.company = 'viteSicure'
    item.dataset.url = 'https://vitesicure.it'
    item.dataset.period = 'March 2023 — Present'
    item.dataset.description =
      'Building a cloud-based web application with clean code practices.'
    item.dataset.highlights = JSON.stringify([
      'Develop and maintain a cloud-based web application.',
      'Apply Domain-Driven Design and Extreme Programming principles.',
    ])
    item.dataset.tags = JSON.stringify([
      'TypeScript',
      'React',
      'NestJs',
      'Node.js',
    ])

    timeline.appendChild(item)
    wrapper.appendChild(timeline)
    return wrapper
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/experience-item.js')
  },
}
