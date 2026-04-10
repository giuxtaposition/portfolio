import '../css/variables.css'
import '../css/reset.css'
import '../css/typography.css'
import '../css/global.css'
/* Atoms */
import '../css/components/atoms/section-title.css'
/* Molecules */
import '../css/components/molecules/hud-panel.css'
import '../css/components/molecules/hover-preview.css'
import '../css/components/molecules/experience.css'
/* Organisms */
import '../css/components/organisms/header.css'
import '../css/components/organisms/hero.css'
import '../css/components/organisms/about.css'
import '../css/components/organisms/contact.css'
import '../css/components/organisms/footer.css'

/** @type { import('storybook').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'dark', value: '#080c14' }
      }
    },
    layout: 'fullscreen',
  },

  initialGlobals: {
    backgrounds: {
      value: 'dark'
    }
  }
}

export default preview
