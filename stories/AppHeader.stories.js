import { expect, userEvent } from 'storybook/test'
import { ensureContent, container } from './helpers.js'

export default {
  title: 'Organisms/AppHeader',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const header = document.createElement('header')
    header.classList.add('site-header')
    const inner = container('')
    const appHeader = document.createElement('app-header')
    inner.appendChild(appHeader)
    header.appendChild(inner)
    return header
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/app-header.js')
  },
}

export const MobileMenuOpen = {
  render: () => {
    const header = document.createElement('header')
    header.classList.add('site-header')
    const inner = container('')
    const appHeader = document.createElement('app-header')
    inner.appendChild(appHeader)
    header.appendChild(inner)
    return header
  },
  loaders: [async () => ({ content: await ensureContent() })],
  beforeEach: async () => {
    await import('../js/components/app-header.js')
  },
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('.header__menu-toggle')
    await userEvent.click(toggle)
  },
}
