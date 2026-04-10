export default {
  title: 'Atoms/CrtScreen',
  tags: ['autodocs'],
  beforeEach: async () => {
    await import('../js/components/hud-panel.js')
  },
}

export const Default = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.style.maxWidth = '400px'
    wrapper.innerHTML = `
      <hud-panel>
        <span class="crt-scanline" style="display: block; overflow: hidden;">
          <img
            class="crt-filter"
            src="https://placehold.co/400x300/080c14/00e5ff?text=CRT+Screen"
            alt="CRT screen demo"
            style="display: block; width: 100%; height: auto;"
          />
        </span>
      </hud-panel>
    `
    return wrapper
  },
}

export const ScanlineOnly = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.style.maxWidth = '400px'
    wrapper.innerHTML = `
      <div style="border: 1px solid var(--color-border); padding: var(--space-2);">
        <span class="crt-scanline" style="display: block; overflow: hidden;">
          <img
            src="https://placehold.co/400x300/080c14/00e5ff?text=Scanline+Only"
            alt="Scanline only demo"
            style="display: block; width: 100%; height: auto;"
          />
        </span>
      </div>
    `
    return wrapper
  },
}

export const FilterOnly = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.style.maxWidth = '400px'
    wrapper.innerHTML = `
      <div style="border: 1px solid var(--color-border); padding: var(--space-2);">
        <span style="display: block; overflow: hidden;">
          <img
            class="crt-filter"
            src="https://placehold.co/400x300/080c14/00e5ff?text=Filter+Only"
            alt="Filter only demo"
            style="display: block; width: 100%; height: auto;"
          />
        </span>
      </div>
    `
    return wrapper
  },
}
