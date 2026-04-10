import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..')
const heroCssPath = resolve(ROOT, 'css/components/organisms/hero.css')
const heroCss = readFileSync(heroCssPath, 'utf-8')

describe('hero.css responsive and reduced-motion', () => {
  it('should include max-width rule for .hero__image to prevent overflow', () => {
    const rule = /\.hero__image[^{]*\{[^}]*max-width\s*:\s*100%/i
    expect(heroCss).toMatch(rule)
  })

  it('should disable animation for .hero__image inside prefers-reduced-motion', () => {
    const mediaBlock =
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[^{]*\{([\s\S]*?)\}/i
    const match = heroCss.match(mediaBlock)
    expect(match).not.toBeNull()

    const body = match?.[1] ?? ''
    expect(body).toMatch(/\.hero__image[^{]*\{[\s\S]*animation\s*:\s*none/i)
  })
})
