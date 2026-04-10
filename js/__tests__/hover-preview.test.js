import { describe, it, expect } from 'vitest'
import { wrapWithHoverPreview, renderAboutItem } from '../hover-preview.js'

describe('wrapWithHoverPreview', () => {
  const LINK_HTML =
    "Currently typing on a <a href='https://example.com'>Sweep Bling LP</a>."
  const PREVIEW_CONFIG = {
    matchText: 'Sweep Bling LP',
    image: 'assets/keyboard.jpg',
  }

  describe('when preview is not provided', () => {
    it('should return html unchanged when preview is null', () => {
      const result = wrapWithHoverPreview(LINK_HTML, null)

      expect(result).toBe(LINK_HTML)
    })

    it('should return html unchanged when preview is undefined', () => {
      const result = wrapWithHoverPreview(LINK_HTML, undefined)

      expect(result).toBe(LINK_HTML)
    })
  })

  describe('when preview config is provided', () => {
    it('should wrap the matching link with a hover-preview container', () => {
      const result = wrapWithHoverPreview(LINK_HTML, PREVIEW_CONFIG)

      expect(result).toContain('<span class="hover-preview">')
      expect(result).toContain(
        "<a href='https://example.com'>Sweep Bling LP</a>",
      )
      expect(result).toContain('</span>')
    })

    it('should include a tooltip with the preview image', () => {
      const result = wrapWithHoverPreview(LINK_HTML, PREVIEW_CONFIG)

      expect(result).toContain(
        '<hud-panel class="hover-preview__tooltip" corner-color="var(--color-accent)" aria-hidden="true">',
      )
      expect(result).toContain(
        '<img class="crt-filter" src="assets/keyboard.jpg" alt="" loading="lazy" />',
      )
    })

    it('should produce the exact expected output structure', () => {
      const html = "<a href='https://example.com'>Sweep Bling LP</a>"
      const expected =
        '<span class="hover-preview">' +
        "<a href='https://example.com'>Sweep Bling LP</a>" +
        '<hud-panel class="hover-preview__tooltip" corner-color="var(--color-accent)" aria-hidden="true">' +
        '<span class="hover-preview__screen crt-scanline">' +
        '<img class="crt-filter" src="assets/keyboard.jpg" alt="" loading="lazy" />' +
        '</span>' +
        '</hud-panel>' +
        '</span>'

      const result = wrapWithHoverPreview(html, PREVIEW_CONFIG)

      expect(result).toBe(expected)
    })
  })

  describe('when matchText is not found in the html', () => {
    it('should return html unchanged', () => {
      const htmlWithoutMatch = "Check out <a href='/about'>my blog</a>."

      const result = wrapWithHoverPreview(htmlWithoutMatch, PREVIEW_CONFIG)

      expect(result).toBe(htmlWithoutMatch)
    })
  })

  describe('when html contains multiple links', () => {
    it('should only wrap the link whose text matches matchText', () => {
      const htmlWithMultipleLinks =
        "Typing on a <a href='https://kbd.com'>Sweep Bling LP</a>. " +
        "See my <a href='https://github.com/config'>layout</a>."

      const result = wrapWithHoverPreview(htmlWithMultipleLinks, PREVIEW_CONFIG)

      expect(result).toContain(
        '<span class="hover-preview"><a href=\'https://kbd.com\'>Sweep Bling LP</a>',
      )
      expect(result).toContain(
        "See my <a href='https://github.com/config'>layout</a>.",
      )
    })
  })

  describe('when html has text around the matching link', () => {
    it('should preserve text before the link', () => {
      const result = wrapWithHoverPreview(LINK_HTML, PREVIEW_CONFIG)

      expect(result).toContain('Currently typing on a ')
    })

    it('should preserve text after the link', () => {
      const result = wrapWithHoverPreview(LINK_HTML, PREVIEW_CONFIG)

      expect(result).toMatch(/<\/span>\.$/)
    })
  })

  describe('when using a different preview config', () => {
    it('should work with any matchText and image combination', () => {
      const html = "I love my <a href='https://tmux.dev'>tmux setup</a>."
      const preview = {
        matchText: 'tmux setup',
        image: 'assets/tmux-screenshot.png',
      }

      const result = wrapWithHoverPreview(html, preview)

      expect(result).toContain('<span class="hover-preview">')
      expect(result).toContain(
        '<img class="crt-filter" src="assets/tmux-screenshot.png" alt="" loading="lazy" />',
      )
      expect(result).toContain("<a href='https://tmux.dev'>tmux setup</a>")
    })
  })

  describe('when matchText appears in multiple links', () => {
    it('should only wrap the first matching link', () => {
      const html =
        "<a href='/a'>Sweep Bling LP</a> and <a href='/b'>Sweep Bling LP</a>"

      const result = wrapWithHoverPreview(html, PREVIEW_CONFIG)

      const matches = result.match(/hover-preview__tooltip/g)
      expect(matches).toHaveLength(1)
    })
  })

  describe('when matchText is plain text without a link', () => {
    it('should wrap the plain text with a hover-preview container', () => {
      const html = 'Love running along the seafront at sunrise.'
      const preview = {
        matchText: 'seafront',
        image: 'assets/seafront.jpg',
      }

      const result = wrapWithHoverPreview(html, preview)

      expect(result).toContain('<span class="hover-preview">')
      expect(result).toContain('seafront')
      expect(result).toContain(
        '<img class="crt-filter" src="assets/seafront.jpg" alt="" loading="lazy" />',
      )
    })

    it('should preserve surrounding text', () => {
      const html = 'Love running along the seafront at sunrise.'
      const preview = {
        matchText: 'seafront',
        image: 'assets/seafront.jpg',
      }

      const result = wrapWithHoverPreview(html, preview)

      expect(result).toContain('Love running along the ')
      expect(result).toContain(' at sunrise.')
    })

    it('should produce the exact expected structure for plain text', () => {
      const html = 'the seafront is great'
      const preview = {
        matchText: 'seafront',
        image: 'assets/seafront.jpg',
      }

      const expected =
        'the <span class="hover-preview">' +
        'seafront' +
        '<hud-panel class="hover-preview__tooltip" corner-color="var(--color-accent)" aria-hidden="true">' +
        '<span class="hover-preview__screen crt-scanline">' +
        '<img class="crt-filter" src="assets/seafront.jpg" alt="" loading="lazy" />' +
        '</span>' +
        '</hud-panel>' +
        '</span> is great'

      const result = wrapWithHoverPreview(html, preview)

      expect(result).toBe(expected)
    })

    it('should prefer wrapping a link when matchText appears in both a link and plain text', () => {
      const html = "I love seafront and <a href='/sf'>seafront</a> is cool."
      const preview = {
        matchText: 'seafront',
        image: 'assets/seafront.jpg',
      }

      const result = wrapWithHoverPreview(html, preview)

      expect(result).toContain(
        '<span class="hover-preview"><a href=\'/sf\'>seafront</a>',
      )
      const matches = result.match(/hover-preview__tooltip/g)
      expect(matches).toHaveLength(1)
    })
  })
})

describe('renderAboutItem', () => {
  describe('when item is a plain string', () => {
    it('should return the string unchanged', () => {
      const plainItem = 'Bouldering enthusiast, always up for a challenge.'

      const result = renderAboutItem(plainItem)

      expect(result).toBe(plainItem)
    })
  })

  describe('when item is an object without preview', () => {
    it('should return the text property unchanged', () => {
      const item = {
        text: 'Tinkering with the perfect dev setup.',
      }

      const result = renderAboutItem(item)

      expect(result).toBe('Tinkering with the perfect dev setup.')
    })
  })

  describe('when item is an object with preview', () => {
    it('should return html with the matching link wrapped', () => {
      const item = {
        text: "Typing on a <a href='https://kbd.com'>Sweep Bling LP</a>.",
        preview: {
          matchText: 'Sweep Bling LP',
          image: 'assets/keyboard.jpg',
        },
      }

      const result = renderAboutItem(item)

      expect(result).toContain('<span class="hover-preview">')
      expect(result).toContain(
        '<img class="crt-filter" src="assets/keyboard.jpg" alt="" loading="lazy" />',
      )
      expect(result).toContain("<a href='https://kbd.com'>Sweep Bling LP</a>")
    })
  })
})
