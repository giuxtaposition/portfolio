/** @type { import('storybook').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  staticDirs: ['../assets'],
}

export default config
