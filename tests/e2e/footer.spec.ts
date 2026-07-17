import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await scrollToElement(page, 'footer')
  })

  test('should render the footer', async ({ page }) => {
    await expect(page.locator('[data-testid="footer"]')).toBeVisible()
  })

  test('should display contact information', async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]')
    await expect(footer.locator('text=@')).toBeVisible()
    await expect(footer.locator('text=WhatsApp')).toBeVisible()
  })

  test('should display current year in copyright', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString()
    await expect(page.locator(`text=${currentYear}`)).toBeVisible()
  })
})
