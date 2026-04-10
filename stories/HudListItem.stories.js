export default {
  title: 'Atoms/HudListItem',
  tags: ['autodocs'],
}

export const Single = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <div class="hud-list-item" style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
        A single list item with the triangle bullet marker.
      </div>
    `
    return wrapper
  },
}

export const UnorderedList = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-3);">
        <li class="hud-list-item" style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
          Develop and maintain cloud-based web applications.
        </li>
        <li class="hud-list-item" style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
          Apply Domain-Driven Design and Extreme Programming principles.
        </li>
        <li class="hud-list-item" style="color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);">
          Write comprehensive tests covering edge cases and expected behavior.
        </li>
      </ul>
    `
    return wrapper
  },
}

export const MixedContent = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-3);">
        <li class="hud-list-item" style="color: var(--color-text); font-family: var(--font-sans); font-size: var(--text-base); line-height: var(--leading-normal);">
          Currently typing away on a
          <a href="#" style="color: var(--color-accent-mid);">custom split keyboard</a>.
        </li>
        <li class="hud-list-item" style="color: var(--color-text); font-family: var(--font-sans); font-size: var(--text-base); line-height: var(--leading-normal);">
          Always exploring new ways to write cleaner, more maintainable code.
        </li>
      </ul>
    `
    return wrapper
  },
}
