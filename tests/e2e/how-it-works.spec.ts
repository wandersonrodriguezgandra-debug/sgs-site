import { test, expect } from '@playwright/test'
import { waitForPageReady } from '../helpers/test-utils'

test.describe('How It Works Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.3))
    await page.waitForTimeout(500)
  })

  test('should render the how-it-works section', async ({ page }) => {
    await expect(page.locator('#how-it-works')).toBeVisible()
  })

  test('should display step numbers', async ({ page }) => {
    const cards = page.locator('#how-it-works .sgs-step-card')
    await expect(cards.getByText('01', { exact: true })).toBeVisible()
    await expect(cards.getByText('04', { exact: true })).toBeVisible()
  })
})
