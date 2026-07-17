import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement, viewports } from '../helpers/test-utils'

test.describe('Visual Regression — Sections', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000)
    await page.setViewportSize(viewports.desktop)
    // Hide scrollbar for stable screenshots across environments
    await page.addInitScript(() => {
      const style = document.createElement('style')
      style.textContent = '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }'
      document.head.appendChild(style)
    })
    await page.goto('/')
    await waitForPageReady(page)
    await page.waitForTimeout(1000)
  })

  test('pricing section', async ({ page }) => {
    await scrollToElement(page, 'pricing-section')
    await page.waitForTimeout(1000)
    await page.evaluate(() => {
      if (typeof (window as any).gsap !== 'undefined') {
        (window as any).gsap.globalTimeline?.pause()
      }
    })
    await expect(page.locator('[data-testid="pricing-section"]')).toHaveScreenshot(
      'pricing-section.png',
      { maxDiffPixelRatio: 0.1, timeout: 10000 }
    )
  })

  test('faq section', async ({ page }) => {
    await scrollToElement(page, 'faq-section')
    await page.waitForTimeout(1000)
    // Force scrollbar to overlay to prevent width shifts
    await page.evaluate(() => {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    })
    await page.waitForTimeout(500)
    await expect(page.locator('[data-testid="faq-section"]')).toHaveScreenshot(
      'faq-section.png',
      { maxDiffPixelRatio: 0.1, timeout: 10000 }
    )
  })

  test('testimonials section', async ({ page }) => {
    await scrollToElement(page, 'testimonials-section')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="testimonials-section"]')).toHaveScreenshot(
      'testimonials-section.png',
      { maxDiffPixelRatio: 0.1, timeout: 10000 }
    )
  })

  test('form section', async ({ page }) => {
    await scrollToElement(page, 'demo-form-section')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="demo-form-section"]')).toHaveScreenshot(
      'form-section.png',
      { maxDiffPixelRatio: 0.1, timeout: 10000 }
    )
  })

  test('footer', async ({ page }) => {
    await scrollToElement(page, 'footer')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="footer"]')).toHaveScreenshot(
      'footer.png',
      { maxDiffPixelRatio: 0.1, timeout: 10000 }
    )
  })
})
