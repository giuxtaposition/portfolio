/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} CtaItem
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} Image
 * @property {string} href
 * @property {string} alt
 */

/**
 * @typedef {Object} HeroContent
 * @property {string} greeting
 * @property {string} name
 * @property {string} title
 * @property {string} subtitle
 * @property {CtaItem} primaryCta
 * @property {CtaItem} secondaryCta
 * @property {Image} image
 */

/**
 * @typedef {Object} ExperienceItem
 * @property {string}   role
 * @property {string}   company
 * @property {string}   url
 * @property {string}   period
 * @property {string}   description
 * @property {string[]} highlights
 * @property {string[]} tags
 */

/**
 * @typedef {Object} ExperienceContent
 * @property {string}           sectionTitle
 * @property {string}           timelineLabel
 * @property {ExperienceItem[]} items
 */

/**
 * @typedef {Object} PreviewConfig
 * @property {string} matchText
 * @property {string} image
 */

/**
 * @typedef {string | { text: string, preview?: PreviewConfig }} AboutItem
 */

/**
 * @typedef {Object} AboutContent
 * @property {string}     sectionTitle
 * @property {string}     description
 * @property {string}     subtitle
 * @property {AboutItem[]} items
 */

/**
 * @typedef {Object} SocialItem
 * @property {string} label
 * @property {string} ariaLabel
 * @property {string} url
 */

/**
 * @typedef {Object} ContactContent
 * @property {string}       sectionTitle
 * @property {string}       text
 * @property {string}       socialLabel
 * @property {SocialItem[]} socials
 */

/**
 * @typedef {Object} HeaderContent
 * @property {string} logoLabel
 * @property {string} menuToggleLabel
 * @property {string} navLabel
 */

/**
 * @typedef {Object} FooterContent
 * @property {string} text
 */

/**
 * @typedef {Object} AccessibilityContent
 * @property {string} skipLink
 * @property {string} externalLinkHint
 * @property {string} externalLinkIcon
 * @property {string} tagsLabel
 */

/**
 * @typedef {Object} SiteContent
 * @property {HeaderContent}       header
 * @property {NavItem[]}           nav
 * @property {HeroContent}         hero
 * @property {ExperienceContent}   experience
 * @property {AboutContent}         about
 * @property {ContactContent}      contact
 * @property {FooterContent}       footer
 * @property {AccessibilityContent} accessibility
 */

/** @type {SiteContent | null} */
let content = null

/** @returns {Promise<SiteContent>} */
export async function loadContent() {
  if (content) return content

  const response = await fetch('./content.json')
  content = /** @type {SiteContent} */ (await response.json())
  return content
}

/** @returns {SiteContent} */
export function getContent() {
  if (!content) throw new Error('Content not loaded. Call loadContent() first.')
  return content
}

/**
 * Seeds content directly without fetching — intended for Storybook and tests.
 * @param {SiteContent} data
 */
export function initContent(data) {
  content = data
}
