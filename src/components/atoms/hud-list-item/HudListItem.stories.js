import './hud-list-item.js'

export default {
  title: 'Atoms/HudListItem',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const element = document.createElement('hud-list-item')
    element.innerHTML = /* html */ `A single list item with the triangle bullet
      marker.`
    return element
  },
}

export const MixedContent = {
  render: () => {
    const element = document.createElement('hud-list-item')
    element.innerHTML = /* html */ `Currently typing away on a
      <a href="#" style="color: var(--color-accent-mid);">
        &nbsp;custom split keyboard</a
      >.`
    return element
  },
}
