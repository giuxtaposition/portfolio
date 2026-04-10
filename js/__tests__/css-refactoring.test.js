import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const componentsDir = resolve(ROOT, 'css/components')

// ── Helpers ──

/**
 * Read a CSS file, returning its content or null if it doesn't exist yet.
 * This allows tests to run before the refactoring is complete.
 */
function readCss(relativePath) {
  const fullPath = resolve(ROOT, relativePath)
  return existsSync(fullPath) ? readFileSync(fullPath, 'utf-8') : null
}

/**
 * Extract the body of a CSS rule by selector.
 * Returns the concatenated bodies of all matches, or null if none found.
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

// ── Global / shared CSS files ──
const globalCss = readCss('css/global.css')
const variablesCss = readCss('css/variables.css')
const typographyCss = readCss('css/typography.css')

// ── Individual component CSS files (at their POST-refactoring locations) ──
const heroCss = readCss('css/components/organisms/hero.css')
const footerCss = readCss('css/components/organisms/footer.css')
const hoverPreviewCss = readCss('css/components/molecules/hover-preview.css')
const hudPanelCss = readCss('css/components/molecules/hud-panel.css')
const sectionTitleCss = readCss('css/components/atoms/section-title.css')
const experienceCss = readCss('css/components/molecules/experience.css')
const aboutCss = readCss('css/components/organisms/about.css')

// ── Combined component CSS (all atoms/molecules/organisms) ──
const componentsCss = ['atoms', 'molecules', 'organisms']
  .flatMap((sub) => {
    const dir = resolve(componentsDir, sub)
    if (!existsSync(dir)) return []
    return readdirSync(dir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(resolve(dir, f), 'utf-8'))
  })
  .join('\n')

// ── 1. Atomic design reclassification ──

describe('atomic design reclassification', () => {
  it('should have footer.css in organisms/ (not atoms/)', () => {
    const correct = existsSync(resolve(componentsDir, 'organisms/footer.css'))
    const stale = existsSync(resolve(componentsDir, 'atoms/footer.css'))

    expect(correct).toBe(true)
    expect(stale).toBe(false)
  })

  it('should have hud-panel.css in molecules/ (not atoms/)', () => {
    const correct = existsSync(
      resolve(componentsDir, 'molecules/hud-panel.css'),
    )
    const stale = existsSync(resolve(componentsDir, 'atoms/hud-panel.css'))

    expect(correct).toBe(true)
    expect(stale).toBe(false)
  })

  it('should have hover-preview.css in molecules/ (not atoms/)', () => {
    const correct = existsSync(
      resolve(componentsDir, 'molecules/hover-preview.css'),
    )
    const stale = existsSync(resolve(componentsDir, 'atoms/hover-preview.css'))

    expect(correct).toBe(true)
    expect(stale).toBe(false)
  })

  it('should keep section-title.css in atoms/', () => {
    const exists = existsSync(resolve(componentsDir, 'atoms/section-title.css'))

    expect(exists).toBe(true)
  })
})

// ── 2. .section__title conflict resolution ──

describe('.section__title and .section__label conflict resolution', () => {
  it('should NOT define .section__title in global.css', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.section__title')

    expect(rule).toBeNull()
  })

  it('should NOT define .section__label in global.css', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.section__label')

    expect(rule).toBeNull()
  })

  it('should define .section__title in atoms/section-title.css', () => {
    expect(sectionTitleCss).not.toBeNull()
    const rule = extractRule(sectionTitleCss, '.section__title')

    expect(rule).not.toBeNull()
  })

  it('should define .section__label in atoms/section-title.css', () => {
    expect(sectionTitleCss).not.toBeNull()
    const rule = extractRule(sectionTitleCss, '.section__label')

    expect(rule).not.toBeNull()
  })
})

// ── 3. Scanline overlay deduplication ──

describe('scanline overlay deduplication', () => {
  it('should define .crt-scanline::after in global.css', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.crt-scanline::after')

    expect(rule).not.toBeNull()
  })

  it('should include repeating-linear-gradient in .crt-scanline::after', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.crt-scanline::after')

    expect(rule).toMatch(/repeating-linear-gradient/)
  })

  it('should keep body::after scanline in global.css (subtle cyan tint)', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, 'body::after')

    expect(rule).not.toBeNull()
    expect(rule).toMatch(/repeating-linear-gradient/)
    expect(rule).toMatch(/rgba\(0,\s*229,\s*255/)
  })

  it('should NOT contain repeating-linear-gradient in hero.css', () => {
    expect(heroCss).not.toBeNull()

    expect(heroCss).not.toMatch(/repeating-linear-gradient/)
  })

  it('should NOT contain repeating-linear-gradient in hover-preview.css', () => {
    expect(hoverPreviewCss).not.toBeNull()

    expect(hoverPreviewCss).not.toMatch(/repeating-linear-gradient/)
  })
})

// ── 4. CRT filter + flicker deduplication ──

describe('CRT filter and flicker deduplication', () => {
  it('should define @keyframes flicker in global.css', () => {
    expect(globalCss).not.toBeNull()

    expect(globalCss).toMatch(/@keyframes\s+flicker/)
  })

  it('should define .crt-filter in global.css', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.crt-filter')

    expect(rule).not.toBeNull()
  })

  it('should include the CRT filter value in .crt-filter', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.crt-filter')

    expect(rule).toMatch(
      /filter\s*:\s*blur\(0\.3px\)\s+contrast\(1\.1\)\s+saturate\(1\.3\)/,
    )
  })

  it('should NOT define @keyframes flicker in hero.css', () => {
    expect(heroCss).not.toBeNull()

    expect(heroCss).not.toMatch(/@keyframes\s+flicker/)
  })

  it('should NOT contain inline CRT filter declaration in hover-preview.css', () => {
    expect(hoverPreviewCss).not.toBeNull()

    expect(hoverPreviewCss).not.toMatch(
      /filter\s*:\s*blur\(0\.3px\)\s+contrast\(1\.1\)\s+saturate\(1\.3\)/,
    )
  })
})

// ── 5. Circuit-line deduplication ──

describe('circuit-line deduplication', () => {
  it('should define .circuit-line in global.css', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.circuit-line')

    expect(rule).not.toBeNull()
  })

  it('should NOT contain inline circuit-line gradient in footer.css', () => {
    expect(footerCss).not.toBeNull()

    expect(footerCss).not.toMatch(
      /linear-gradient\(\s*90deg,\s*transparent,\s*var\(--color-accent-low\)/,
    )
  })
})

// ── 6. Redundant color removal ──

describe('redundant color: var(--color-text) removal', () => {
  const SELECTORS_TO_CHECK = [
    { selector: '.exp__role', source: experienceCss, file: 'experience.css' },
    {
      selector: '.exp__description',
      source: experienceCss,
      file: 'experience.css',
    },
    {
      selector: '.exp__highlight',
      source: experienceCss,
      file: 'experience.css',
    },
    {
      selector: '.about__description',
      source: aboutCss,
      file: 'about.css',
    },
    { selector: '.about__item', source: aboutCss, file: 'about.css' },
    {
      selector: '.section__title',
      source: sectionTitleCss,
      file: 'section-title.css',
    },
    { selector: '.hero__name', source: heroCss, file: 'hero.css' },
  ]

  SELECTORS_TO_CHECK.forEach(({ selector, source, file }) => {
    it(`should NOT have color: var(--color-text) in ${selector} (${file})`, () => {
      expect(source).not.toBeNull()
      const rule = extractRule(source, selector)

      expect(rule).not.toBeNull()
      expect(rule).not.toMatch(/color\s*:\s*var\(--color-text\)/)
    })
  })
})

// ── 7. Redundant typography.css cleanup ──

describe('redundant typography.css cleanup', () => {
  it('should NOT have color: var(--color-text) in any p rule', () => {
    expect(typographyCss).not.toBeNull()
    const rule = extractRule(typographyCss, 'p')

    if (rule) {
      expect(rule).not.toMatch(/color\s*:\s*var\(--color-text\)/)
    }
  })

  it('should NOT have line-height: var(--leading-normal) in any p rule', () => {
    expect(typographyCss).not.toBeNull()
    const rule = extractRule(typographyCss, 'p')

    if (rule) {
      expect(rule).not.toMatch(/line-height\s*:\s*var\(--leading-normal\)/)
    }
  })

  it('should NOT have color: var(--color-text) in the h1,h2,h3,h4 rule', () => {
    expect(typographyCss).not.toBeNull()
    const headingsRule =
      extractRule(typographyCss, 'h1,\nh2,\nh3,\nh4') ??
      extractRule(typographyCss, 'h1, h2, h3, h4')

    expect(headingsRule).not.toBeNull()
    expect(headingsRule).not.toMatch(/color\s*:\s*var\(--color-text\)/)
  })
})

// ── 8. Glow text-shadow variable ──

describe('glow text-shadow variable', () => {
  it('should define --glow-text-shadow in variables.css', () => {
    expect(variablesCss).not.toBeNull()

    expect(variablesCss).toMatch(/--glow-text-shadow\s*:/)
  })

  it('should reference var(--glow-text-shadow) in component hover text-shadows', () => {
    expect(componentsCss).toMatch(/var\(--glow-text-shadow\)/)
  })
})

// ── 9. Shared list-item bullet pattern ──

describe('shared .hud-list-item bullet pattern', () => {
  it('should define .hud-list-item in global.css with position: relative', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.hud-list-item')

    expect(rule).not.toBeNull()
    expect(rule).toMatch(/position\s*:\s*relative/)
  })

  it('should define .hud-list-item with padding-left: var(--space-6)', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.hud-list-item')

    expect(rule).toMatch(/padding-left\s*:\s*var\(--space-6\)/)
  })

  it('should define .hud-list-item::before in global.css with triangle bullet', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.hud-list-item::before')

    expect(rule).not.toBeNull()
    expect(rule).toMatch(/content\s*:\s*['"]\\25B9['"]/)
  })

  it('should define .hud-list-item::before with color: var(--color-accent)', () => {
    expect(globalCss).not.toBeNull()
    const rule = extractRule(globalCss, '.hud-list-item::before')

    expect(rule).toMatch(/color\s*:\s*var\(--color-accent\)/)
  })

  it('should NOT have .exp__highlight::before with bullet content in experience.css', () => {
    expect(experienceCss).not.toBeNull()
    const rule = extractRule(experienceCss, '.exp__highlight::before')

    expect(rule ?? '').not.toMatch(/content\s*:\s*['"]\\25B9['"]/)
  })

  it('should NOT have .about__item::before with bullet content in about.css', () => {
    expect(aboutCss).not.toBeNull()
    const rule = extractRule(aboutCss, '.about__item::before')

    expect(rule ?? '').not.toMatch(/content\s*:\s*['"]\\25B9['"]/)
  })
})
