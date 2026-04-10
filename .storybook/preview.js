import '../src/index.css'
import { initContent } from '../src/data.js'
import contentData from '../content.json'

/** @type { import('storybook').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'dark', value: '#080c14' },
      },
    },
    layout: 'fullscreen',
  },
  initialGlobals: {
    backgrounds: {
      value: 'dark',
    },
  },
}

export const loaders = [() => { initContent(contentData) }]

export const decorators = [
  (Story) => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.appendChild(Story())
    return wrapper
  },
]

export default preview
