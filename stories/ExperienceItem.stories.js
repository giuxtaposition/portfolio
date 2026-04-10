import { ensureContent } from './helpers.js'

export default {
  title: 'Molecules/ExperienceItem',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('experience__timeline')
    wrapper.setAttribute('role', 'list')
    wrapper.style.maxWidth = '700px'

    const item = document.createElement('experience-item')
    item.dataset.index = '0'
    item.dataset.role = 'Software Developer'
    item.dataset.company = 'viteSicure'
    item.dataset.url = 'https://vitesicure.it'
    item.dataset.period = 'March 2023 — Present'
    item.dataset.description =
      'Building a cloud-based web application with a focus on clean code and scalable architecture.'
    item.dataset.highlights = JSON.stringify([
      'Develop and maintain a cloud-based web application using Trunk Based Development.',
      'Apply Domain-Driven Design and Extreme Programming principles.',
    ])
    item.dataset.tags = JSON.stringify([
      'TypeScript',
      'React',
      'NestJs',
      'Node.js',
    ])

    wrapper.appendChild(item)
    return wrapper
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/experience-item.js')
  },
}

export const MinimalData = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('experience__timeline')
    wrapper.setAttribute('role', 'list')
    wrapper.style.maxWidth = '700px'

    const item = document.createElement('experience-item')
    item.dataset.index = '0'
    item.dataset.role = 'Intern'
    item.dataset.company = 'Acme Corp'
    item.dataset.url = 'https://example.com'
    item.dataset.period = 'Jan 2020 — Jun 2020'
    item.dataset.description = 'A short internship.'
    item.dataset.highlights = JSON.stringify([])
    item.dataset.tags = JSON.stringify([])

    wrapper.appendChild(item)
    return wrapper
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/experience-item.js')
  },
}

export const ManyTags = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('experience__timeline')
    wrapper.setAttribute('role', 'list')
    wrapper.style.maxWidth = '700px'

    const item = document.createElement('experience-item')
    item.dataset.index = '0'
    item.dataset.role = 'Senior Full Stack Developer'
    item.dataset.company = 'Big Tech Co'
    item.dataset.url = 'https://example.com'
    item.dataset.period = 'Jan 2021 — Present'
    item.dataset.description =
      'Leading a team of developers working across multiple technology stacks and cloud platforms.'
    item.dataset.highlights = JSON.stringify([
      'Architected a microservices platform handling 10M+ requests per day.',
      'Mentored junior developers and established code review practices.',
      'Reduced CI/CD pipeline time by 60% through parallelization.',
    ])
    item.dataset.tags = JSON.stringify([
      'TypeScript',
      'React',
      'Node.js',
      'AWS',
      'Rust',
      'Elm',
      'Docker',
      'Kubernetes',
      'PostgreSQL',
      'Redis',
    ])

    wrapper.appendChild(item)
    return wrapper
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/experience-item.js')
  },
}
