export default {
  title: 'Atoms/SectionTitle',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <h2 class="section__title">Experience</h2>
    `
    return wrapper
  },
}

export const WithLabel = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <p class="section__label">01 // about</p>
      <h2 class="section__title">About Me</h2>
    `
    return wrapper
  },
}

export const FullHeader = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.innerHTML = `
      <div class="section__header">
        <p class="section__label">03 // contact</p>
        <h2 class="section__title">Get In Touch</h2>
      </div>
    `
    return wrapper
  },
}
