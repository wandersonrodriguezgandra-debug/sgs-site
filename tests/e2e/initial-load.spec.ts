import { test, expect } from '@playwright/test'
import { waitForPageReady, viewports } from '../helpers/test-utils'

test.describe('Initial Load', () => {
  test('should load the home page with correct title and meta', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/SGS/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Sistema de Gestão/
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /SGS/
    )
  })

  test('should display the page-home data-testid', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="page-home"]')).toBeVisible()
  })

  test('should return 404 for unknown routes', async ({ page }) => {
    const response = await page.goto('/pagina-inexistente')
    await expect(page.locator('[data-testid="page-not-found"]')).toBeVisible()
    await expect(page.locator('text=404')).toBeVisible()
  })

  test('should have no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await waitForPageReady(page)
    await page.waitForTimeout(1000)

    expect(errors).toEqual([])
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)
    await page.goto('/')
    await waitForPageReady(page)
    await expect(page.locator('[data-testid="header"]')).toBeVisible()
    await expect(page.locator('[data-testid="menu-toggle"]')).toBeVisible()
  })

  test('should be responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize(viewports.desktop)
    await page.goto('/')
    await waitForPageReady(page)
    await expect(page.locator('[data-testid="header"]')).toBeVisible()
  })
})
