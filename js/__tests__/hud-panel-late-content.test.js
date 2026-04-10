// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest'
import '../components/hud-panel.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('hud-panel late content', () => {
  it('should accept and preserve content injected after connection', async () => {
    const el = document.createElement('hud-panel')
    document.body.appendChild(el)

    // Inject content after connecting
    el.innerHTML = '<div class="late">Hello late</div>'

    // wait for microtasks so any attributeChanged/render runs
    await Promise.resolve()

    const body = el.querySelector('.hud-panel__body')

    expect(body).not.toBeNull()
    expect(body?.textContent).toContain('Hello late')
  })
})
