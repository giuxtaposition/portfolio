export default {
  title: 'Atoms/CircuitLine',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm); margin-bottom: var(--space-6);">
        Content above the divider.
      </p>
      <div class="circuit-line"></div>
      <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm); margin-top: var(--space-6);">
        Content below the divider.
      </p>
    `
    return wrapper
  },
}

export const WithSpacing = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--space-8);">
        <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
          Section A
        </p>
        <div class="circuit-line"></div>
        <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
          Section B
        </p>
        <div class="circuit-line"></div>
        <p style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
          Section C
        </p>
      </div>
    `
    return wrapper
  },
}
