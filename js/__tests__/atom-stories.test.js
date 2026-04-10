import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const storiesDir = resolve(ROOT, 'stories')

// ── Story definitions ──

const ATOM_STORIES = [
  {
    name: 'SectionTitle',
    file: 'SectionTitle.stories.js',
    expectedTitle: 'Atoms/SectionTitle',
  },
  {
    name: 'CircuitLine',
    file: 'CircuitLine.stories.js',
    expectedTitle: 'Atoms/CircuitLine',
  },
  {
    name: 'HudListItem',
    file: 'HudListItem.stories.js',
    expectedTitle: 'Atoms/HudListItem',
  },
  {
    name: 'CrtScreen',
    file: 'CrtScreen.stories.js',
    expectedTitle: 'Atoms/CrtScreen',
  },
]

// ── Helpers ──

const STORYBOOK_META_KEYS = new Set(['default'])

function isNamedStoryExport(key) {
  return !STORYBOOK_META_KEYS.has(key)
}

// ── 1. Story files exist ──

describe('atom story files exist', () => {
  ATOM_STORIES.forEach(({ name, file }) => {
    it(`should have ${file} in stories/`, () => {
      const filePath = resolve(storiesDir, file)

      expect(existsSync(filePath)).toBe(true)
    })
  })
})

// ── 2. Default export with correct title ──

describe('atom story default exports', () => {
  ATOM_STORIES.forEach(({ name, file, expectedTitle }) => {
    it(`${name} should export default with title "${expectedTitle}"`, async () => {
      const storyModule = await import(`../../stories/${file}`)

      expect(storyModule.default).toBeDefined()
      expect(storyModule.default.title).toBe(expectedTitle)
    })
  })
})

// ── 3. At least one named story export ──

describe('atom story named exports', () => {
  ATOM_STORIES.forEach(({ name, file }) => {
    it(`${name} should export at least one named story`, async () => {
      const storyModule = await import(`../../stories/${file}`)
      const namedExports = Object.keys(storyModule).filter(isNamedStoryExport)

      expect(namedExports.length).toBeGreaterThanOrEqual(1)
    })
  })
})

// ── 4. Story titles follow Atoms/ pattern ──

describe('atom story title convention', () => {
  ATOM_STORIES.forEach(({ name, file }) => {
    it(`${name} title should start with "Atoms/"`, async () => {
      const storyModule = await import(`../../stories/${file}`)

      expect(storyModule.default.title).toMatch(/^Atoms\//)
    })
  })
})
