import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const globalCss = readFileSync(resolve(ROOT, 'css/global.css'), 'utf-8')
const hudPanelCss = readFileSync(
  resolve(ROOT, 'css/components/molecules/hud-panel.css'),
  'utf-8',
)
const componentsDir = resolve(ROOT, 'css/components')
const componentsCss = ['atoms', 'molecules', 'organisms']
  .flatMap((sub) => {
    const dir = resolve(componentsDir, sub)
    return readdirSync(dir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(resolve(dir, f), 'utf-8'))
  })
  .join('\n')
const heroTemplate = readFileSync(
  resolve(ROOT, 'js/components/hero-section.js'),
  'utf-8',
)
const hoverPreview = readFileSync(resolve(ROOT, 'js/hover-preview.js'), 'utf-8')
const contactTemplate = readFileSync(
  resolve(ROOT, 'js/components/contact-section.js'),
  'utf-8',
)

describe('hud-panel SVG polygon and duplication removal', () => {
  it('hud-panel.css should define .hud-panel__wrap with position: relative', () => {
    expect(hudPanelCss).toContain('.hud-panel__wrap')
    const wrapRule = extractRule(hudPanelCss, '.hud-panel__wrap')
    expect(wrapRule).not.toBeNull()
    expect(wrapRule).toMatch(/position\s*:\s*relative/)
  })

  it('hud-panel.css should define .hud-panel__frame for SVG positioning', () => {
    expect(hudPanelCss).toContain('.hud-panel__frame')
    const frameRule = extractRule(hudPanelCss, '.hud-panel__frame')
    expect(frameRule).not.toBeNull()
    expect(frameRule).toMatch(/position\s*:\s*absolute/)
  })

  it('hud-panel.css should NOT contain .hud-panel--frame (removed in favor of SVG polygons)', () => {
    expect(hudPanelCss).not.toContain('.hud-panel--frame')
  })

  it('global.css should NOT contain .hud-frame (removed in favor of <hud-panel>)', () => {
    expect(globalCss).not.toContain('.hud-frame')
  })

  it('components CSS should NOT contain duplicate pseudo-element rules for hero, hover-preview, contact', () => {
    const duplicates = [
      '.hero__image::before',
      '.hero__image::after',
      '.hover-preview__tooltip::before',
      '.hover-preview__tooltip::after',
      '.contact::before',
      '.contact::after',
    ]
    duplicates.forEach((sel) => {
      expect(componentsCss).not.toContain(sel)
    })
  })

  it('components CSS should NOT reference .hud-panel--frame (old frame variant)', () => {
    expect(componentsCss).not.toContain('.hud-panel--frame')
  })

  it('hero-section, hover-preview, and contact templates should use <hud-panel> instead of .hud-frame', () => {
    expect(heroTemplate).toMatch(/<hud-panel\s[^>]*class="[^"]*hero__image/)
    expect(hoverPreview).toMatch(
      /<hud-panel\s[^>]*class="[^"]*hover-preview__tooltip/,
    )
    expect(contactTemplate).toMatch(/<hud-panel\s[^>]*class="[^"]*contact/)
  })
})

describe('hud-panel corner-color attribute in consumer templates', () => {
  it('should include corner-color on <hud-panel> in hero-section template', () => {
    expect(heroTemplate).toMatch(
      /<hud-panel\s[^>]*corner-color="var\(--color-accent\)"/,
    )
  })

  it('should include corner-color on <hud-panel> in contact-section template', () => {
    expect(contactTemplate).toMatch(
      /<hud-panel\s[^>]*corner-color="var\(--color-accent\)"/,
    )
  })

  it('should include corner-color on <hud-panel> in hover-preview template', () => {
    expect(hoverPreview).toMatch(
      /<hud-panel\s[^>]*corner-color="var\(--color-accent\)"/,
    )
  })
})

// --- Helpers ---

function extractRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    escaped + '\\s*(?![:\\w])' + '\\{([^}]*?)\\}',
    'gs',
  )
  const matches = [...source.matchAll(pattern)]
  return matches.map((m) => m[1]).join('\n') || null
}
