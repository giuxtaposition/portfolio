import './circuit-line-divider.js'

export default {
  title: 'Atoms/CircuitLineDivider',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm); margin-bottom: var(--space-6);">
        Content above the divider.
      </p>
      <circuit-line-divider></circuit-line-divider>
      <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm); margin-top: var(--space-6);">
        Content below the divider.
      </p>
    `
    return wrapper
  },
}
