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

  test('should provide real navigation and no placeholder contact channel', async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]')
    await expect(footer.getByRole('link', { name: 'Privacidade' })).toHaveAttribute(
      'href',
      '/privacidade',
    )
    await expect(footer.getByRole('link', { name: /Solicitar demonstração/ })).toHaveAttribute(
      'href',
      '#contato',
    )
    await expect(
      footer.locator('a[href^="mailto:"], a[href^="tel:"], a[href*="whatsapp"]'),
    ).toHaveCount(0)
  })

  test('should display current year in copyright', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString()
    await expect(page.locator(`text=${currentYear}`)).toBeVisible()
  })
})
