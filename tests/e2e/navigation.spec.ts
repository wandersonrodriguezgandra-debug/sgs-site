import { test, expect } from '@playwright/test'
import { viewports } from '../helpers/test-utils'

test.describe('Navigation', () => {
  test('should render header with navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="header"]')).toBeVisible()
  })

  test('should show login and CTA buttons on desktop', async ({ page }) => {
    await page.setViewportSize(viewports.desktop)
    await page.goto('/')
    await expect(page.locator('[data-testid="login-link"]')).toBeVisible()
    await expect(page.locator('[data-testid="cta-demo"]')).toBeVisible()
  })

  test('should toggle mobile menu on small viewport', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)
    await page.goto('/')

    const menuToggle = page.locator('[data-testid="menu-toggle"]')
    await expect(menuToggle).toBeVisible()

    await menuToggle.click()
    await page.waitForTimeout(500)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    await dialog.locator('button[aria-label="Fechar menu"]').click()
    await page.waitForTimeout(500)
    await expect(dialog).not.toBeVisible()
  })

  test('should open and close mobile menu via escape key', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)
    await page.goto('/')

    await page.locator('[data-testid="menu-toggle"]').click()
    await page.waitForTimeout(300)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await expect(dialog).not.toBeVisible()
  })
})
