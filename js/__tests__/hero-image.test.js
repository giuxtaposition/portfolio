import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const componentsCss = readFileSync(resolve(ROOT, 'css/components.css'), 'utf-8')
const globalCss = readFileSync(resolve(ROOT, 'css/global.css'), 'utf-8')
const heroTemplate = readFileSync(
  resolve(ROOT, 'js/components/hero-section.js'),
  'utf-8',
)

describe('hero__image border frame', () => {
  describe('border declaration via .hero__image or .hud-frame', () => {
    it('should have a border referencing var(--color-border) either directly on .hero__image or via .hud-frame', () => {
      const heroImageRule = extractRule(componentsCss, '.hero__image')
      const heroImageHasBorder =
        heroImageRule !== null &&
        /border\s*:.*var\(--color-border\)/.test(heroImageRule)

      const hudFrameRule = extractRule(globalCss, '.hud-frame')
      const hudFrameHasBorder =
        hudFrameRule !== null &&
        /border\s*:.*var\(--color-border\)/.test(hudFrameRule)
      const templateUsesHudFrame =
        /class="[^"]*hero__image[^"]*hud-frame[^"]*"|class="[^"]*hud-frame[^"]*hero__image[^"]*"/.test(
          heroTemplate,
        )
      const borderViaHudFrame = hudFrameHasBorder && templateUsesHudFrame

      expect(heroImageHasBorder || borderViaHudFrame).toBe(true)
    })
  })

  describe('pseudo-element corner bracket styles', () => {
    it('should have ::before/::after with border-color: var(--color-accent) either directly or via .hud-frame', () => {
      const heroImagePseudoRules = extractCombinedPseudoRules(
        componentsCss,
        '.hero__image',
      )
      const heroImageHasPseudos = heroImagePseudoRules.includes(
        'border-color: var(--color-accent)',
      )

      const hudFramePseudoRules = extractCombinedPseudoRules(
        globalCss,
        '.hud-frame',
      )
      const hudFrameHasPseudos = hudFramePseudoRules.includes(
        'border-color: var(--color-accent)',
      )
      const templateUsesHudFrame =
        /class="[^"]*hero__image[^"]*hud-frame[^"]*"|class="[^"]*hud-frame[^"]*hero__image[^"]*"/.test(
          heroTemplate,
        )
      const pseudosViaHudFrame = hudFrameHasPseudos && templateUsesHudFrame

      expect(heroImageHasPseudos || pseudosViaHudFrame).toBe(true)
    })

    it('should have ::before/::after with border-style: solid either directly or via .hud-frame', () => {
      const heroImagePseudoRules = extractCombinedPseudoRules(
        componentsCss,
        '.hero__image',
      )
      const heroImageHasSolid = heroImagePseudoRules.includes(
        'border-style: solid',
      )

      const hudFramePseudoRules = extractCombinedPseudoRules(
        globalCss,
        '.hud-frame',
      )
      const hudFrameHasSolid = hudFramePseudoRules.includes(
        'border-style: solid',
      )
      const templateUsesHudFrame =
        /class="[^"]*hero__image[^"]*hud-frame[^"]*"|class="[^"]*hud-frame[^"]*hero__image[^"]*"/.test(
          heroTemplate,
        )
      const solidViaHudFrame = hudFrameHasSolid && templateUsesHudFrame

      expect(heroImageHasSolid || solidViaHudFrame).toBe(true)
    })
  })
})

// --- Helpers ---

/**
 * Extracts the first CSS rule body for a selector that matches exactly
 * (not pseudo-elements). Returns the content between { } or null.
 * @param {string} source
 * @param {string} selector
 * @returns {string | null}
 */
function extractRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    escaped + '\\s*(?![:\\w])' + '\\{([^}]*?)\\}',
    'gs',
  )
  const matches = [...source.matchAll(pattern)]
  return matches.map((m) => m[1]).join('\n') || null
}

/**
 * Extracts all rule bodies for selectors containing both the base selector
 * and ::before or ::after. Returns them concatenated.
 * @param {string} source
 * @param {string} selector
 * @returns {string}
 */
function extractCombinedPseudoRules(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    escaped + '::(?:before|after)[^{]*\\{([^}]*?)\\}',
    'gs',
  )
  const matches = [...source.matchAll(pattern)]
  return matches.map((m) => m[1]).join('\n')
}
