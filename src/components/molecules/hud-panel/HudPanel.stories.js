import './hud-panel.js'

export default {
  title: 'Molecules/HudPanel',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const el = document.createElement('hud-panel')
    el.innerHTML = /* html */ `<p style="color: var(--color-text);">Panel content goes here.</p>`
    return el
  },
}

export const WithHeader = {
  render: () => {
    const el = document.createElement('hud-panel')
    el.setAttribute('header-left', 'System Status')
    el.setAttribute('header-right', 'v1.0')
    el.innerHTML = /* html */ `<p style="color: var(--color-text);">Panel content goes here.</p>`
    return el
  },
}

export const WithCorners = {
  render: () => {
    const el = document.createElement('hud-panel')
    el.setAttribute('corner-color', 'var(--color-accent)')
    el.innerHTML = /* html */ `<p style="color: var(--color-text);">Panel with accent corner marks.</p>`
    return el
  },
}

export const Polygon = {
  render: () => {
    const el = document.createElement('hud-panel')
    el.setAttribute('variant', 'polygon')
    el.setAttribute('header-left', 'About Me')
    el.setAttribute('header-right', 'SYS.01')
    el.innerHTML = /* html */ `<p style="color: var(--color-text); padding: 2rem;">Polygon variant with clipped corners.</p>`
    return el
  },
}
