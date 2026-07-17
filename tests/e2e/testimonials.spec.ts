import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

test.describe('Testimonials Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await scrollToElement(page, 'testimonials-section')
  })

  test('should render the testimonials section', async ({ page }) => {
    await expect(page.locator('[data-testid="testimonials-section"]')).toBeVisible()
  })

  test('should display placeholder testimonials', async ({ page }) => {
    const section = page.locator('[data-testid="testimonials-section"]')
    await expect(section.getByText('Espaço reservado', { exact: true })).toHaveCount(3)
  })
})
