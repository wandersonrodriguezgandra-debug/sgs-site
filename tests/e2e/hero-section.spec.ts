import { test, expect } from '@playwright/test'
import { waitForPageReady } from '../helpers/test-utils'

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
  })

  test('should display the hero section with key elements', async ({ page }) => {
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="hero-badge"]')).toBeVisible()
    await expect(page.locator('[data-testid="hero-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="hero-description"]')).toBeVisible()
  })

  test('should show CTA buttons in hero', async ({ page }) => {
    await expect(page.locator('[data-testid="hero-cta-demo"]')).toBeVisible()
    await expect(page.locator('[data-testid="hero-cta-modules"]')).toBeVisible()
  })
})
