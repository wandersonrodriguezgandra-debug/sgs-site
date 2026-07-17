import { test, expect } from '@playwright/test'
import { waitForPageReady } from '../helpers/test-utils'

test.describe('Reduced Motion', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await waitForPageReady(page)

    await expect(page.locator('[data-testid="page-home"]')).toBeVisible()
  })
})
