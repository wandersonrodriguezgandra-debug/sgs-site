import { test, expect } from '@playwright/test'
import { waitForPageReady, viewports } from '../helpers/test-utils'

test.describe('Visual Regression — Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Hide scrollbar for stable screenshots
    await page.addInitScript(() => {
      const style = document.createElement('style')
      style.textContent = '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }'
      document.head.appendChild(style)
    })
  })

  test('hero section desktop', async ({ page }) => {
    test.setTimeout(30000)
    await page.setViewportSize(viewports.desktop)
    await page.goto('/')
    await waitForPageReady(page)
    await page.waitForTimeout(2000)

    await page.evaluate(() => {
      if (typeof (window as any).gsap !== 'undefined') {
        (window as any).gsap.globalTimeline?.pause()
      }
    })

    await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
      'hero-desktop.png',
      { maxDiffPixelRatio: 0.1, timeout: 10000 }
    )
  })
})
