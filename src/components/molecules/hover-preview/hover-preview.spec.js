import { describe, it, expect } from 'vitest'
import { wrapWithHoverPreview, renderAboutItem } from './hover-preview.js'

describe('wrapWithHoverPreview', () => {
  it('returns html unchanged when preview is null', () => {
    const html = '<a href="#">hello</a>'
    expect(wrapWithHoverPreview(html, null)).toBe(html)
  })

  it('returns html unchanged when preview is undefined', () => {
    const html = 'plain text'
    expect(wrapWithHoverPreview(html, undefined)).toBe(html)
  })

  it('returns html unchanged when matchText is not found', () => {
    const html = '<a href="#">hello</a>'
    const preview = { matchText: 'notfound', image: '/img.png' }
    expect(wrapWithHoverPreview(html, preview)).toBe(html)
  })

  it('wraps a matching link with hover-preview span', () => {
    const html = '<a href="/foo">keyboard</a>'
    const preview = { matchText: 'keyboard', image: '/kb.png' }
    const result = wrapWithHoverPreview(html, preview)

    expect(result).toContain('class="hover-preview"')
    expect(result).toContain('<a href="/foo">keyboard</a>')
    expect(result).toContain('class="hover-preview__tooltip"')
    expect(result).toContain('src="/kb.png"')
  })

  it('wraps plain text with hover-preview span when no link matches', () => {
    const html = 'I use keyboard daily'
    const preview = { matchText: 'keyboard', image: '/kb.png' }
    const result = wrapWithHoverPreview(html, preview)

    expect(result).toContain('class="hover-preview"')
    expect(result).toContain('class="hover-preview__tooltip"')
  })

  it('prefers wrapping the link over plain text', () => {
    const html = 'keyboard <a href="/kb">keyboard</a>'
    const preview = { matchText: 'keyboard', image: '/kb.png' }
    const result = wrapWithHoverPreview(html, preview)

    expect(result).toContain('<a href="/kb">keyboard</a>')
    expect(result.match(/hover-preview/g)?.length).toBeGreaterThan(0)
  })
})

describe('renderAboutItem', () => {
  it('returns a plain string as-is', () => {
    expect(renderAboutItem('hello world')).toBe('hello world')
  })

  it('returns item text without hover-preview when no preview config', () => {
    const result = renderAboutItem({ text: 'just text' })
    expect(result).toBe('just text')
  })

  it('wraps item text with hover-preview when preview config is present', () => {
    const result = renderAboutItem({
      text: 'I love keyboard',
      preview: { matchText: 'keyboard', image: '/kb.png' },
    })
    expect(result).toContain('hover-preview')
    expect(result).toContain('keyboard')
  })
})
