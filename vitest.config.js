import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Resolve the system Chromium executable.
 * On NixOS, Playwright's downloaded binaries are dynamically linked and won't
 * run. We fall back to the system-installed `chromium` instead.
 */
function resolveChromiumPath() {
  try {
    return execSync('which chromium', { encoding: 'utf-8' }).trim()
  } catch {
    // Not on NixOS or no system Chromium — let Playwright use its own binary
    return undefined
  }
}

const chromiumPath = resolveChromiumPath()

export default defineConfig({
  test: {
    projects: [
      // ── Storybook story tests (real browser via Playwright) ──
      {
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm storybook --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: {
                channel: 'chromium',
                ...(chromiumPath && { executablePath: chromiumPath }),
              },
            }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          // Storybook 10.3+ auto-provisions setProjectAnnotations
        },
      },
      // ── Existing unit / integration tests ──
      {
        test: {
          name: 'unit',
          include: ['**/*.spec.js'],
        },
      },
    ],
  },
})
