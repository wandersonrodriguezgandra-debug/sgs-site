import { test, expect } from '@playwright/test'
import { waitForPageReady } from '../helpers/test-utils'

test.describe('Accessibility', () => {
  test('should have semantic HTML landmarks', async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)

    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should have skip-link for keyboard navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href="#main-content"]')).toBeVisible()
  })

  test('skip link should be focusable and move focus to main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('should have aria-label on social links', async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const socialLinks = page.locator('footer a[aria-label]')
    const count = await socialLinks.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('should have correct heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)

    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()

    const h2 = page.locator('h2')
    const h2Count = await h2.count()
    expect(h2Count).toBeGreaterThanOrEqual(1)
  })

  test('should have ARIA labels on buttons', async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)

    const buttonsWithAria = page.locator('button[aria-label]')
    const count = await buttonsWithAria.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should navigate through sections with keyboard', async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)

    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })
})
