import './app-header.js'

export default {
  title: 'Organisms/AppHeader',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => {
    const header = document.createElement('header')
    header.className = 'site-header'
    const container = document.createElement('div')
    container.className = 'container'
    container.appendChild(document.createElement('app-header'))
    header.appendChild(container)
    return header
  },
}
