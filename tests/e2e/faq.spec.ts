import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

test.describe('FAQ Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await scrollToElement(page, 'faq-section')
  })

  test('should render the FAQ section', async ({ page }) => {
    await expect(page.locator('[data-testid="faq-section"]')).toBeVisible()
  })

  test('should display accordion items', async ({ page }) => {
    const items = page.locator('[data-testid^="accordion-"]')
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should expand and collapse accordion items', async ({ page }) => {
    const firstItem = page.locator('[data-testid^="accordion-"]').first()

    await firstItem.click()
    await page.waitForTimeout(300)
    await expect(firstItem).toHaveAttribute('aria-expanded', 'true')

    await firstItem.click()
    await page.waitForTimeout(300)
    await expect(firstItem).toHaveAttribute('aria-expanded', 'false')
  })
})
