import { expect } from 'storybook/test'

export default {
  title: 'Molecules/HoverPreview',
  tags: ['autodocs'],
  beforeEach: async () => {
    await import('../js/components/hud-panel.js')
  },
}

export const WithLink = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '4rem 2rem'
    wrapper.style.fontFamily = 'var(--font-mono)'
    wrapper.style.fontSize = 'var(--text-sm)'
    wrapper.style.color = 'var(--color-text)'

    wrapper.innerHTML = `
      <p>
        Currently typing away on a
        <span class="hover-preview">
          <a href="https://splitkb.com/products/aurora-sweep">Aurora Sweep</a>
          <hud-panel class="hover-preview__tooltip" aria-hidden="true">
            <span class="hover-preview__screen crt-scanline">
              <img class="crt-filter" src="keyboard.jpg" alt="" loading="lazy" />
            </span>
          </hud-panel>
        </span>.
        Hover over the link to see the preview.
      </p>
    `

    return wrapper
  },
  play: async ({ canvasElement }) => {
    const preview = canvasElement.querySelector('.hover-preview')

    // hover-preview container exists
    expect(preview).not.toBeNull()

    // contains a link
    const link = preview.querySelector('a')
    expect(link).not.toBeNull()
    expect(link.textContent).toContain('Aurora Sweep')

    // contains tooltip panel
    const tooltip = preview.querySelector('.hover-preview__tooltip')
    expect(tooltip).not.toBeNull()
    expect(tooltip.getAttribute('aria-hidden')).toBe('true')

    // contains screen and image
    const screen = tooltip.querySelector('.hover-preview__screen')
    expect(screen).not.toBeNull()
    expect(screen.classList.contains('crt-scanline')).toBe(true)

    const img = screen.querySelector('img.crt-filter')
    expect(img).not.toBeNull()
    expect(img.getAttribute('loading')).toBe('lazy')
  },
}

export const WithPlainText = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '4rem 2rem'
    wrapper.style.fontFamily = 'var(--font-mono)'
    wrapper.style.fontSize = 'var(--text-sm)'
    wrapper.style.color = 'var(--color-text)'

    wrapper.innerHTML = `
      <p>
        I really enjoy using my
        <span class="hover-preview">
          custom keyboard
          <hud-panel class="hover-preview__tooltip" aria-hidden="true">
            <span class="hover-preview__screen crt-scanline">
              <img class="crt-filter" src="keyboard.jpg" alt="" loading="lazy" />
            </span>
          </hud-panel>
        </span>
        for everyday development work.
      </p>
    `

    return wrapper
  },
  play: async ({ canvasElement }) => {
    const preview = canvasElement.querySelector('.hover-preview')

    // hover-preview container exists with plain text
    expect(preview).not.toBeNull()
    expect(preview.textContent).toContain('custom keyboard')

    // no link inside (plain text variant)
    expect(preview.querySelector('a')).toBeNull()

    // tooltip still present
    const tooltip = preview.querySelector('.hover-preview__tooltip')
    expect(tooltip).not.toBeNull()

    const img = tooltip.querySelector('img.crt-filter')
    expect(img).not.toBeNull()
  },
}
