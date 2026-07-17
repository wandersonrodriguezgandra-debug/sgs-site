import { test, expect } from '@playwright/test'
import { waitForPageReady } from '../helpers/test-utils'

test.describe('Audio Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
  })

  test('should render the audio control', async ({ page }) => {
    await expect(page.locator('[data-testid="audio-control"]')).toBeVisible()
  })

  test('should toggle audio on click', async ({ page }) => {
    const toggle = page.locator('[data-testid="audio-toggle"]')
    await expect(toggle).toBeVisible()

    await toggle.click()
    await page.waitForTimeout(200)

    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await toggle.click()
    await page.waitForTimeout(200)

    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })
})
