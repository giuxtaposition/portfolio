export default {
  title: 'Atoms/Btn',
  tags: ['autodocs'],
}

export const Primary = {
  render: () => {
    const el = document.createElement('div')
    el.innerHTML = /* html */ `<a href="#" class="btn btn--primary">View my work</a>`
    return el
  },
}

export const Ghost = {
  render: () => {
    const el = document.createElement('div')
    el.innerHTML = /* html */ `<a href="#" class="btn btn--ghost">Get in touch</a>`
    return el
  },
}

export const Link = {
  render: () => {
    const el = document.createElement('div')
    el.innerHTML = /* html */ `<a href="#" class="btn btn--link btn--sm">[GitHub]</a>`
    return el
  },
}

export const AllVariants = {
  render: () => {
    const el = document.createElement('div')
    el.style.display = 'flex'
    el.style.gap = '1rem'
    el.style.flexWrap = 'wrap'
    el.innerHTML = /* html */ `
      <a href="#" class="btn btn--primary">Primary</a>
      <a href="#" class="btn btn--ghost">Ghost</a>
      <a href="#" class="btn btn--link btn--sm">[Link]</a>
    `
    return el
  },
}
