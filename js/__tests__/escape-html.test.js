// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest'
import '../components/experience-item.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('experience-item escaping', () => {
  it('should NOT render raw HTML from highlights or tags', async () => {
    const el = document.createElement('experience-item')

    el.setAttribute(
      'data-highlights',
      JSON.stringify(['<img src=x onerror=alert(1)>']),
    )
    el.setAttribute('data-tags', JSON.stringify(['<b>bold</b>']))

    document.body.appendChild(el)

    // wait for microtasks so connectedCallback/render finish
    await Promise.resolve()

    const imgs = el.querySelectorAll('img')
    const bolds = el.querySelectorAll('b')

    expect(imgs.length).toBe(0)
    expect(bolds.length).toBe(0)

    expect(el.textContent).toContain('<img src=x onerror=alert(1)>')
  })
})
