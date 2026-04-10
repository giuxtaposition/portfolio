import './footer.js'

export default {
  title: 'Organisms/Footer',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => {
    const footer = document.createElement('footer')
    footer.className = 'site-footer'
    const container = document.createElement('div')
    container.className = 'container'
    container.appendChild(document.createElement('site-footer'))
    footer.appendChild(container)
    return footer
  },
}
