export default {
  title: 'Organisms/Footer',
  tags: ['autodocs'],
}

export const Default = {
  render: () => {
    const footer = document.createElement('footer')
    footer.classList.add('site-footer')
    footer.innerHTML = `
      <div class="container">
        <div class="circuit-line" style="margin-bottom: var(--space-8);" aria-hidden="true"></div>
        <p>\u00A9 ${new Date().getFullYear()} Giulia Ye. All rights reserved.</p>
      </div>
    `
    return footer
  },
}
