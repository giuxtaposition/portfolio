import { expect } from 'storybook/test'

export default {
  title: 'Molecules/HudPanel',
  tags: ['autodocs'],
  beforeEach: async () => {
    await import('../js/components/hud-panel.js')
  },
}

// ── Helpers ──

const POINT_COUNT = { frame: 4, polygon: 12 }
const DEMO_TEXT =
  'color: var(--color-text); font-family: var(--font-mono); font-size: var(--text-sm);'

/**
 * Creates a <hud-panel> with optional attributes and inner HTML.
 * @param {Record<string, string>} [attrs]
 * @param {string} [innerContent]
 * @returns {HTMLElement}
 */
function createPanel(attrs = {}, innerContent = '') {
  const panel = document.createElement('hud-panel')
  for (const [key, value] of Object.entries(attrs)) {
    panel.setAttribute(key, value)
  }
  if (innerContent) panel.innerHTML = innerContent
  panel.style.maxWidth = '600px'
  return panel
}

/** @param {HTMLElement} canvasElement */
function getPanel(canvasElement) {
  return canvasElement.querySelector('hud-panel')
}

// ── Shared assertion helpers ──

/**
 * Asserts core structure: SVG frame, wrap, body, expected polygon point count.
 * @param {HTMLElement} panel
 * @param {'frame' | 'polygon'} variant
 */
function assertCoreStructure(panel, variant) {
  expect(panel.querySelector('svg.hud-panel__frame')).not.toBeNull()
  expect(panel.querySelector('.hud-panel__wrap')).not.toBeNull()
  expect(panel.querySelector('.hud-panel__body')).not.toBeNull()
  expect(panel.querySelector('.hud-panel--frame')).toBeNull()

  const polygon = panel.querySelector('svg.hud-panel__frame polygon')
  const points = polygon.getAttribute('points').split(' ')
  expect(points).toHaveLength(POINT_COUNT[variant])
}

/**
 * Asserts header visibility and content.
 * @param {HTMLElement} panel
 * @param {{ left?: string, right?: string } | null} expected - null = no header expected
 */
function assertHeader(panel, expected) {
  const header = panel.querySelector('.hud-panel__header')
  if (!expected) {
    expect(header).toBeNull()
    return
  }
  expect(header).not.toBeNull()
  if (expected.left) expect(header.textContent).toContain(expected.left)
  if (expected.right) {
    const tag = panel.querySelector('.hud-panel__tag')
    expect(tag).not.toBeNull()
    expect(tag.textContent).toContain(expected.right)
  }
}

/**
 * Asserts structure order: SVG < header < body.
 * @param {HTMLElement} panel
 */
function assertStructureOrder(panel) {
  const wrap = panel.querySelector('.hud-panel__wrap')
  const children = Array.from(wrap.children)

  const svgIndex = children.findIndex((c) => c.tagName.toLowerCase() === 'svg')
  const headerIndex = children.findIndex((c) =>
    c.classList?.contains('hud-panel__header'),
  )
  const bodyIndex = children.findIndex((c) =>
    c.classList?.contains('hud-panel__body'),
  )

  expect(svgIndex).toBeGreaterThanOrEqual(0)
  expect(headerIndex).toBeGreaterThanOrEqual(0)
  expect(bodyIndex).toBeGreaterThanOrEqual(0)
  expect(svgIndex).toBeLessThan(headerIndex)
  expect(headerIndex).toBeLessThan(bodyIndex)
}

/**
 * Asserts XSS escaping in headers and color attribute.
 * @param {HTMLElement} panel
 */
function assertSecurityEscape(panel) {
  const header = panel.querySelector('.hud-panel__header')
  const html = header?.innerHTML ?? ''

  // header-left escaped
  expect(html).not.toContain('<img')
  expect(html).toContain('&lt;img')

  // header-right escaped
  expect(html).not.toContain('<script>')
  expect(html).toContain('&lt;script&gt;')

  // color attribute injection prevented
  const polygon = panel.querySelector('svg.hud-panel__frame polygon')
  expect(polygon.getAttribute('onload')).toBeNull()
}

/**
 * Asserts content preservation and restoration after re-render.
 * Tests the _originalContent restoration contract: when attributes change,
 * the component re-renders from the initial innerHTML, discarding runtime mutations.
 * @param {HTMLElement} panel
 */
function assertContentPreservation(panel) {
  const body = panel.querySelector('.hud-panel__body')
  expect(body.querySelector('p')?.textContent).toBe('First')
  expect(body.querySelector('span')?.textContent).toBe('Second')

  // mutate body, then trigger re-render via attribute change
  body.innerHTML = '<p>Mutated</p>'
  panel.setAttribute('color', '#ff0000')
  expect(panel.querySelector('.hud-panel__body p')?.textContent).toBe('First')
}

/**
 * Asserts attribute change reactivity: header, color, add/remove.
 * @param {HTMLElement} panel
 * @param {'frame' | 'polygon'} variant
 */
function assertAttributeChanges(panel, variant) {
  // header-left changes
  expect(panel.querySelector('.hud-panel__header')?.textContent).toContain(
    'Before',
  )
  panel.setAttribute('header-left', 'After')
  expect(panel.querySelector('.hud-panel__header')?.textContent).toContain(
    'After',
  )

  // header-right changes
  panel.setAttribute('header-right', 'v2')
  expect(panel.querySelector('.hud-panel__tag')?.textContent).toContain('v2')

  // color changes
  if (variant === 'polygon') {
    panel.setAttribute('color', '#ff00ff')
    const polygon = panel.querySelector('svg.hud-panel__frame polygon')
    expect(polygon.getAttribute('stroke')).toBe('#ff00ff')
  }

  // remove header
  panel.removeAttribute('header-left')
  panel.removeAttribute('header-right')
  expect(panel.querySelector('.hud-panel__header')).toBeNull()

  // add header back
  panel.setAttribute('header-left', 'New Title')
  const header = panel.querySelector('.hud-panel__header')
  expect(header).not.toBeNull()
  expect(header.textContent).toContain('New Title')

  // body content preserved
  expect(panel.querySelector('.hud-panel__body p')?.textContent).toBe('Keep me')
}

/**
 * Asserts all attributes render correctly together.
 * @param {HTMLElement} panel
 * @param {string} expectedColor
 */
function assertAllAttributes(panel, expectedColor) {
  const header = panel.querySelector('.hud-panel__header')
  const svg = panel.querySelector('svg.hud-panel__frame')
  const body = panel.querySelector('.hud-panel__body')

  expect(header).not.toBeNull()
  expect(header.textContent).toContain('Panel')
  expect(header.textContent).toContain('LIVE')
  expect(svg).not.toBeNull()
  expect(body).not.toBeNull()
  expect(svg.querySelector('polygon').getAttribute('stroke')).toBe(
    expectedColor,
  )
}

// ── Rectangle variant (default) ──

export const Rectangle = {
  render: () =>
    createPanel(
      { 'header-left': 'System Status', 'header-right': 'SYS.01' },
      `<p style="${DEMO_TEXT}">
        Default rectangle variant — SVG rectangular polygon frame with
        ResizeObserver for dynamic sizing.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)
    assertCoreStructure(panel, 'frame')
    assertHeader(panel, { left: 'System Status', right: 'SYS.01' })
  },
}

export const RectangleWithoutHeader = {
  render: () =>
    createPanel(
      {},
      `<p style="${DEMO_TEXT}">
        Rectangle without header — renders just the SVG polygon frame and body.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)
    assertHeader(panel, null)
    expect(panel.querySelector('svg.hud-panel__frame')).not.toBeNull()
    expect(panel.querySelector('.hud-panel__body')).not.toBeNull()

    // default color
    const polygon = panel.querySelector('svg.hud-panel__frame polygon')
    expect(polygon.getAttribute('stroke')).toBe('#00e5ff')
  },
}

export const RectangleCustomColor = {
  render: () =>
    createPanel(
      {
        'header-left': 'Alert Panel',
        'header-right': 'WARN.03',
        color: '#ff6b35',
      },
      `<p style="${DEMO_TEXT}">
        Rectangle with custom stroke color via the <code>color</code> attribute.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)
    const polygon = panel.querySelector('svg.hud-panel__frame polygon')
    expect(polygon.getAttribute('stroke')).toBe('#ff6b35')
  },
}

export const RectangleCompactPadding = {
  render: () => {
    const panel = createPanel(
      { 'header-left': 'Compact' },
      `<p style="${DEMO_TEXT}">
        Override padding by targeting <code>.hud-panel__wrap</code>.
      </p>`,
    )
    panel.style.maxWidth = '400px'
    return panel
  },
}

// ── Header visibility (both variants) ──

export const RectangleHeaderLeft = {
  render: () =>
    createPanel(
      { 'header-left': 'Status' },
      '<p style="color: var(--color-text);">Header-left only</p>',
    ),
  play: async ({ canvasElement }) => {
    assertHeader(getPanel(canvasElement), { left: 'Status' })
  },
}

export const RectangleHeaderRight = {
  render: () =>
    createPanel(
      { 'header-right': 'ACTIVE' },
      '<p style="color: var(--color-text);">Header-right only</p>',
    ),
  play: async ({ canvasElement }) => {
    assertHeader(getPanel(canvasElement), { right: 'ACTIVE' })
  },
}

export const RectangleEmptyHeaders = {
  render: () =>
    createPanel(
      { 'header-left': '', 'header-right': '' },
      '<p style="color: var(--color-text);">Both header attributes empty</p>',
    ),
  play: async ({ canvasElement }) => {
    assertHeader(getPanel(canvasElement), null)
  },
}

// ── Structure order ──

export const RectangleStructureOrder = {
  render: () =>
    createPanel(
      { 'header-left': 'Title' },
      '<p style="color: var(--color-text);">Structure order test</p>',
    ),
  play: async ({ canvasElement }) => {
    assertStructureOrder(getPanel(canvasElement))
  },
}

// ── Security ──

export const RectangleSecurityEscape = {
  render: () =>
    createPanel(
      {
        'header-left': '<img src=x onerror=alert(1)>',
        'header-right': '<script>alert(1)</script>',
        color: '#fff" onload="alert(1)',
      },
      '<p style="color: var(--color-text);">XSS escape test</p>',
    ),
  play: async ({ canvasElement }) => {
    assertSecurityEscape(getPanel(canvasElement))
  },
}

// ── Content preservation ──

export const RectangleContentPreservation = {
  render: () =>
    createPanel({ 'header-left': 'Title' }, '<p>First</p><span>Second</span>'),
  play: async ({ canvasElement }) => {
    assertContentPreservation(getPanel(canvasElement))
  },
}

// ── Attribute changes ──

export const RectangleAttributeChanges = {
  render: () =>
    createPanel(
      { 'header-left': 'Before', 'header-right': 'v1' },
      '<p>Keep me</p>',
    ),
  play: async ({ canvasElement }) => {
    assertAttributeChanges(getPanel(canvasElement), 'frame')
  },
}

// ── Edge cases (rectangle) ──

export const RectangleAllAttributes = {
  render: () =>
    createPanel(
      { 'header-left': 'Panel', 'header-right': 'LIVE', color: '#ff6600' },
      `<p style="color: var(--color-text);">All attributes set simultaneously</p>`,
    ),
  play: async ({ canvasElement }) => {
    assertAllAttributes(getPanel(canvasElement), '#ff6600')
  },
}

export const RectangleEmptyContent = {
  render: () => createPanel({}),
  play: async ({ canvasElement }) => {
    const body = getPanel(canvasElement).querySelector('.hud-panel__body')
    expect(body).not.toBeNull()
    expect(body.innerHTML.trim()).toBe('')
  },
}

// ── Polygon variant ──

export const Polygon = {
  render: () =>
    createPanel(
      {
        variant: 'polygon',
        'header-left': 'System Status',
        'header-right': 'SYS.01',
      },
      `<p style="${DEMO_TEXT}">
        Polygon variant — SVG 12-point custom shape frame with ResizeObserver
        for dynamic sizing. Used by the about section.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)
    assertCoreStructure(panel, 'polygon')

    // default color
    const polygon = panel.querySelector('svg.hud-panel__frame polygon')
    expect(polygon.getAttribute('stroke')).toBe('#00e5ff')

    assertHeader(panel, { left: 'System Status', right: 'SYS.01' })
  },
}

export const PolygonCustomColor = {
  render: () =>
    createPanel(
      {
        variant: 'polygon',
        'header-left': 'Alert Panel',
        'header-right': 'WARN.03',
        color: '#ff6b35',
      },
      `<p style="${DEMO_TEXT}">
        Polygon with custom stroke color via the <code>color</code> attribute.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const polygon = getPanel(canvasElement).querySelector(
      'svg.hud-panel__frame polygon',
    )
    expect(polygon.getAttribute('stroke')).toBe('#ff6b35')
  },
}

export const PolygonWithoutHeader = {
  render: () =>
    createPanel(
      { variant: 'polygon' },
      `<p style="${DEMO_TEXT}">A polygon panel without header attributes.</p>`,
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)
    assertHeader(panel, null)
    expect(panel.querySelector('svg.hud-panel__frame')).not.toBeNull()
    expect(panel.querySelector('.hud-panel__body')).not.toBeNull()
  },
}

export const PolygonHeaderLeft = {
  render: () =>
    createPanel(
      { variant: 'polygon', 'header-left': 'Navigation' },
      '<p style="color: var(--color-text);">Header-left only</p>',
    ),
  play: async ({ canvasElement }) => {
    assertHeader(getPanel(canvasElement), { left: 'Navigation' })
  },
}

export const PolygonHeaderRight = {
  render: () =>
    createPanel(
      { variant: 'polygon', 'header-right': 'ONLINE' },
      '<p style="color: var(--color-text);">Header-right only</p>',
    ),
  play: async ({ canvasElement }) => {
    assertHeader(getPanel(canvasElement), { right: 'ONLINE' })
  },
}

export const PolygonEmptyHeaders = {
  render: () =>
    createPanel(
      { variant: 'polygon', 'header-left': '', 'header-right': '' },
      '<p style="color: var(--color-text);">Both header attributes empty</p>',
    ),
  play: async ({ canvasElement }) => {
    assertHeader(getPanel(canvasElement), null)
  },
}

export const PolygonStructureOrder = {
  render: () =>
    createPanel(
      { variant: 'polygon', 'header-left': 'Title' },
      '<p style="color: var(--color-text);">Structure order test</p>',
    ),
  play: async ({ canvasElement }) => {
    assertStructureOrder(getPanel(canvasElement))
  },
}

export const PolygonSecurityEscape = {
  render: () =>
    createPanel(
      {
        variant: 'polygon',
        'header-left': '<img src=x onerror=alert(1)>',
        'header-right': '<script>alert(1)</script>',
        color: '#fff" onload="alert(1)',
      },
      '<p style="color: var(--color-text);">XSS escape test</p>',
    ),
  play: async ({ canvasElement }) => {
    assertSecurityEscape(getPanel(canvasElement))
  },
}

export const PolygonContentPreservation = {
  render: () =>
    createPanel({ variant: 'polygon' }, '<p>First</p><span>Second</span>'),
  play: async ({ canvasElement }) => {
    assertContentPreservation(getPanel(canvasElement))
  },
}

export const PolygonAttributeChanges = {
  render: () =>
    createPanel(
      { variant: 'polygon', 'header-left': 'Before', 'header-right': 'v1' },
      '<p>Keep me</p>',
    ),
  play: async ({ canvasElement }) => {
    assertAttributeChanges(getPanel(canvasElement), 'polygon')
  },
}

export const PolygonAllAttributes = {
  render: () =>
    createPanel(
      {
        variant: 'polygon',
        'header-left': 'Panel',
        'header-right': 'LIVE',
        color: '#ff6600',
      },
      `<p style="color: var(--color-text);">All attributes set simultaneously</p>`,
    ),
  play: async ({ canvasElement }) => {
    assertAllAttributes(getPanel(canvasElement), '#ff6600')
  },
}

// ── Variant switching ──

export const VariantSwitching = {
  render: () => createPanel({ 'header-left': 'Title' }, '<p>Preserved</p>'),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)

    // starts as frame (default) — 4 points
    assertCoreStructure(panel, 'frame')

    // switch to polygon — 12 points
    panel.setAttribute('variant', 'polygon')
    assertCoreStructure(panel, 'polygon')

    // body + header preserved
    expect(panel.querySelector('.hud-panel__body p')?.textContent).toBe(
      'Preserved',
    )
    expect(panel.querySelector('.hud-panel__header')?.textContent).toContain(
      'Title',
    )

    // switch back to frame — 4 points
    panel.setAttribute('variant', 'frame')
    assertCoreStructure(panel, 'frame')

    // body + header preserved after switch back
    expect(panel.querySelector('.hud-panel__body p')?.textContent).toBe(
      'Preserved',
    )
    expect(panel.querySelector('.hud-panel__header')?.textContent).toContain(
      'Title',
    )
  },
}

export const UnknownVariant = {
  render: () =>
    createPanel(
      { variant: 'invalid-value' },
      `<p style="color: var(--color-text);">Unknown variant falls back to frame</p>`,
    ),
  play: async ({ canvasElement }) => {
    assertCoreStructure(getPanel(canvasElement), 'frame')
  },
}

// ── Corner color ──

export const RectangleWithCornerColor = {
  render: () =>
    createPanel(
      {
        'header-left': 'System Status',
        'header-right': 'SYS.01',
        'corner-color': 'var(--color-accent)',
      },
      `<p style="${DEMO_TEXT}">
        Rectangle with <code>corner-color="var(--color-accent)"</code> — renders
        bright accent L-shaped brackets at top-left and bottom-right corners.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)
    const svg = panel.querySelector('svg.hud-panel__frame')
    const corners = panel.querySelectorAll('.hud-panel__corner')

    // two corner polylines rendered inside SVG
    expect(corners).toHaveLength(2)
    expect(svg.querySelectorAll('.hud-panel__corner')).toHaveLength(2)

    // stroke, stroke-width, fill
    for (const corner of corners) {
      expect(corner.getAttribute('stroke')).toBe('var(--color-accent)')
      expect(corner.getAttribute('stroke-width')).toBe('2')
      expect(corner.getAttribute('fill')).toBe('none')
    }

    // top-left corner L-shape
    const topLeft = corners[0].getAttribute('points')
    expect(topLeft).toContain('0,16')
    expect(topLeft).toContain('0,0')
    expect(topLeft).toContain('16,0')
  },
}

export const RectangleCornerColorCustom = {
  render: () =>
    createPanel(
      {
        'header-left': 'Alert Panel',
        'header-right': 'WARN.03',
        color: '#ff6b35',
        'corner-color': '#ff6b35',
      },
      `<p style="${DEMO_TEXT}">
        Rectangle with matching <code>color</code> and <code>corner-color</code>.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const corners =
      getPanel(canvasElement).querySelectorAll('.hud-panel__corner')
    for (const corner of corners) {
      expect(corner.getAttribute('stroke')).toBe('#ff6b35')
    }
  },
}

export const PolygonWithCornerColor = {
  render: () =>
    createPanel(
      {
        variant: 'polygon',
        'header-left': 'System Status',
        'header-right': 'SYS.01',
        'corner-color': 'var(--color-accent)',
      },
      `<p style="${DEMO_TEXT}">
        Polygon with <code>corner-color="var(--color-accent)"</code> — corners
        render at the bounding box edges.
      </p>`,
    ),
  play: async ({ canvasElement }) => {
    const corners =
      getPanel(canvasElement).querySelectorAll('.hud-panel__corner')
    expect(corners).toHaveLength(2)
  },
}

// ── Corner color attribute changes ──

export const CornerColorChanges = {
  render: () =>
    createPanel(
      { 'corner-color': '#ff0044' },
      '<p style="color: var(--color-text);">Corner color change test</p>',
    ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement)

    // initial corners
    let corners = panel.querySelectorAll('.hud-panel__corner')
    expect(corners).toHaveLength(2)
    expect(corners[0].getAttribute('stroke')).toBe('#ff0044')

    // update
    panel.setAttribute('corner-color', '#00ff00')
    corners = panel.querySelectorAll('.hud-panel__corner')
    for (const corner of corners) {
      expect(corner.getAttribute('stroke')).toBe('#00ff00')
    }

    // remove
    panel.removeAttribute('corner-color')
    expect(panel.querySelectorAll('.hud-panel__corner')).toHaveLength(0)
  },
}

export const CornerColorNoCorners = {
  render: () =>
    createPanel(
      {},
      '<p style="color: var(--color-text);">No corner-color attribute</p>',
    ),
  play: async ({ canvasElement }) => {
    expect(
      getPanel(canvasElement).querySelectorAll('.hud-panel__corner'),
    ).toHaveLength(0)
  },
}

// ── Corner color security ──

export const CornerColorSecurityEscape = {
  render: () =>
    createPanel(
      { 'corner-color': '#fff" onload="alert(1)' },
      '<p style="color: var(--color-text);">Corner color XSS test</p>',
    ),
  play: async ({ canvasElement }) => {
    const corners =
      getPanel(canvasElement).querySelectorAll('.hud-panel__corner')
    for (const corner of corners) {
      expect(corner.getAttribute('onload')).toBeNull()
    }
  },
}

// ── HTML-parsed element ──

export const HtmlParsedElement = {
  render: () => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML =
      '<hud-panel corner-color="#00e5ff"><p style="color: var(--color-text);">content</p></hud-panel>'
    return wrapper
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement
      .querySelector('hud-panel')
      ?.querySelector('.hud-panel__body')
    expect(body?.innerHTML).not.toContain('undefined')
  },
}
