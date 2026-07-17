import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

test.describe('Pricing Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await scrollToElement(page, 'pricing-section')
  })

  test('should render the pricing section', async ({ page }) => {
    await expect(page.locator('[data-testid="pricing-section"]')).toBeVisible()
  })

  test('should display plan cards', async ({ page }) => {
    await expect(page.locator('[data-testid="pricing-section"] h2')).toBeVisible()
    const planCards = page.locator('[data-testid="pricing-section"] h3')
    expect(await planCards.count()).toBeGreaterThanOrEqual(1)
  })
})
