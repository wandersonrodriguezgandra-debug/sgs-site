import { test, expect } from '@playwright/test'

test.describe('Cinematic Cursor', () => {
  test('should not show custom cursor on mobile devices', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test only')
    await page.goto('/')
    const cursor = page.locator('[data-testid="cinematic-cursor"]')
    await expect(cursor).toHaveCount(0)
  })

  test('custom cursor elements should exist on desktop', async ({ page }) => {
    const vp = page.viewportSize()
    test.skip(!vp || vp.width < 1024, 'Desktop test only')
    await page.goto('/')
    await page.mouse.move(500, 300)
    await page.waitForTimeout(500)
    const cursor = page.locator('[data-testid="cinematic-cursor"]')
    await expect(cursor).toHaveCount(1)
  })
})
