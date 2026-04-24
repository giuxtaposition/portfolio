import '../../molecules/hud-panel/hud-panel.js'

export default {
  title: 'Molecules/HoverPreview',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const el = document.createElement('p')
    el.style.color = 'var(--color-text)'
    el.innerHTML = /* html */ `
      Hover over
      <span class="hover-preview">
        <a href="#" style="color: var(--color-accent-mid);">Aurora Sweep</a>
        <hud-panel class="hover-preview__tooltip" corner-color="var(--color-accent)" aria-hidden="true">
          <span class="hover-preview__screen crt-scanline">
            <img class="crt-filter" src="assets/keyboard.jpg" alt="" loading="lazy" />
          </span>
        </hud-panel>
      </span>
      to see the preview.
    `
    return el
  },
}
