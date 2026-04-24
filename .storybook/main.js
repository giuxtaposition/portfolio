/** @type { import('storybook').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  staticDirs: [{ from: '../assets', to: '/assets' }],
}

export default config
