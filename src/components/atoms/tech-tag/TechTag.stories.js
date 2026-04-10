import './tech-tag.js'

export default {
  title: 'Atoms/TechTag',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const wrapper = document.createElement('tech-tag')
    wrapper.innerHTML = `Javascript`
    return wrapper
  },
}
