import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const globalCss = readFileSync(resolve(ROOT, 'css/global.css'), 'utf-8')
const componentsCss = readFileSync(resolve(ROOT, 'css/components.css'), 'utf-8')
const heroTemplate = readFileSync(
  resolve(ROOT, 'js/components/hero-section.js'),
  'utf-8',
)
const hoverPreview = readFileSync(resolve(ROOT, 'js/hover-preview.js'), 'utf-8')
const contactTemplate = readFileSync(
  resolve(ROOT, 'js/components/contact-section.js'),
  'utf-8',
)

describe('hud-frame utility and duplication removal', () => {
  it('global.css should define .hud-frame with border referencing var(--color-border)', () => {
    expect(globalCss).toContain('.hud-frame')
    const hudRule = extractRule(globalCss, '.hud-frame')
    expect(hudRule).not.toBeNull()
    expect(hudRule).toMatch(/border\s*:\s*1px\s+solid\s+var\(--color-border\)/)
  })

  it('global.css should define ::before and ::after for .hud-frame with corner bracket styles', () => {
    expect(globalCss).toContain('.hud-frame::before')
    expect(globalCss).toContain('.hud-frame::after')
    expect(globalCss).toContain('border-color: var(--color-accent)')
    expect(globalCss).toContain('border-style: solid')
  })

  it('components.css should NOT contain duplicate pseudo-element rules for hero, hover-preview, contact', () => {
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

  it('components using .hud-frame should NOT redundantly re-declare properties already provided by .hud-frame', () => {
    const contactRule = extractRule(componentsCss, '.contact')
    expect(contactRule).not.toBeNull()
    expect(contactRule).not.toMatch(/border\s*:/)
    expect(contactRule).not.toMatch(/background-color\s*:/)
    expect(contactRule).not.toMatch(/position\s*:\s*relative/)

    const tooltipRule = extractRule(componentsCss, '.hover-preview__tooltip')
    expect(tooltipRule).not.toBeNull()
    expect(tooltipRule).not.toMatch(/border\s*:/)
    expect(tooltipRule).not.toMatch(/background-color\s*:/)
  })

  it('hover-preview__tooltip should not have overflow:hidden (clips corner brackets at -1px offsets)', () => {
    const tooltipRule = extractRule(componentsCss, '.hover-preview__tooltip')
    expect(tooltipRule).not.toMatch(/overflow\s*:\s*hidden/)
  })

  it('hero-section, hover-preview, and contact templates should use hud-frame class for their frames', () => {
    // hero__image should include hud-frame
    expect(heroTemplate).toMatch(
      /class="[^"]*hero__image[^"]*hud-frame[^"]*"|class="[^"]*hud-frame[^"]*hero__image[^"]*"/,
    )

    // hover-preview wraps tooltip — verify the class is present or that the hover-preview uses hud-frame
    expect(hoverPreview).toMatch(
      /class=\"[^\"]*hover-preview__tooltip[^\"]*hud-frame[^\"]*\"|class=\"[^\"]*hud-frame[^\"]*hover-preview__tooltip[^\"]*\"/,
    )

    // contact block should include hud-frame
    expect(contactTemplate).toMatch(
      /class="[^"]*contact[^"]*hud-frame[^"]*"|class="[^"]*hud-frame[^"]*contact[^"]*"/,
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
