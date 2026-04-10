import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..')
const heroPath = resolve(ROOT, 'js/components/hero-section.js')
const heroSource = readFileSync(heroPath, 'utf-8')

describe('hero-section alt text', () => {
  it("should NOT hardcode the generic alt text 'my photo'", () => {
    expect(heroSource).not.toContain('my photo')
  })
})
