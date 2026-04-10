import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const hudPanelCss = readFileSync(
  resolve(ROOT, 'css/components/molecules/hud-panel.css'),
  'utf-8',
)
const heroTemplate = readFileSync(
  resolve(ROOT, 'js/components/hero-section.js'),
  'utf-8',
)

describe('hero__image border frame via <hud-panel>', () => {
  describe('hud-panel SVG polygon provides frame', () => {
    it('should have .hud-panel__frame with absolute positioning in hud-panel.css', () => {
      const frameRule = extractRule(hudPanelCss, '.hud-panel__frame')

      expect(frameRule).not.toBeNull()
      expect(frameRule).toMatch(/position\s*:\s*absolute/)
    })

    it('should NOT contain .hud-panel--frame (old CSS frame variant)', () => {
      expect(hudPanelCss).not.toContain('.hud-panel--frame')
    })
  })

  describe('hero template uses <hud-panel>', () => {
    it('should use <hud-panel> with class hero__image instead of a div with .hud-frame', () => {
      expect(heroTemplate).toMatch(/<hud-panel\s[^>]*class="[^"]*hero__image/)
      expect(heroTemplate).not.toContain('hud-frame')
    })
  })

  describe('SVG polygon frame styling', () => {
    it('should have .hud-panel__frame with inset: 0 for full coverage', () => {
      const frameRule = extractRule(hudPanelCss, '.hud-panel__frame')

      expect(frameRule).toMatch(/inset\s*:\s*0/)
    })

    it('should have .hud-panel__frame with pointer-events: none', () => {
      const frameRule = extractRule(hudPanelCss, '.hud-panel__frame')

      expect(frameRule).toMatch(/pointer-events\s*:\s*none/)
    })
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
