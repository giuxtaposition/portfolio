export default {
  title: 'Atoms/SectionTitle',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const el = document.createElement('div')
    el.innerHTML = /* html */ `
      <div class="section__header">
        <p class="section__label">01 // section</p>
        <h2 class="section__title">Section Title</h2>
      </div>
    `
    return el
  },
}

export const LabelOnly = {
  render: () => {
    const el = document.createElement('div')
    el.innerHTML = /* html */ `<p class="section__label">02 // experience</p>`
    return el
  },
}

export const TitleOnly = {
  render: () => {
    const el = document.createElement('div')
    el.innerHTML = /* html */ `<h2 class="section__title">Experience</h2>`
    return el
  },
}
