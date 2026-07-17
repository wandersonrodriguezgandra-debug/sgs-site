import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

test.describe('Modules Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await scrollToElement(page, 'modules-section')
  })

  test('should render the modules section', async ({ page }) => {
    await expect(page.locator('[data-testid="modules-section"]')).toBeVisible()
  })

  test('should display module cards', async ({ page }) => {
    const cards = page.locator('[data-testid^="module-card-"]')
    await expect(cards.first()).toBeVisible()
  })

  test('should filter modules by category', async ({ page }) => {
    const filterButton = page.locator('[data-testid="category-filter-gestão"]')
    await expect(filterButton).toBeVisible()
    await filterButton.click()
    await page.waitForTimeout(300)
    await expect(filterButton).toHaveClass(/bg-sgs-accent/)
  })

  test('should open module detail dialog on card click', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="module-card-"]').first()
    await firstCard.click()
    await page.waitForTimeout(500)

    const dialog = page.locator('[data-testid="module-dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('h2')).toBeVisible()
  })

  test('should close module dialog via close button', async ({ page }) => {
    await page.locator('[data-testid^="module-card-"]').first().click()
    await page.waitForTimeout(500)

    await page.locator('[data-testid="dialog-close"]').click()
    await page.waitForTimeout(500)
    await expect(page.locator('[data-testid="module-dialog"]')).not.toBeVisible()
  })

  test('should close module dialog via escape key', async ({ page }) => {
    await page.locator('[data-testid^="module-card-"]').first().click()
    await page.waitForTimeout(500)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await expect(page.locator('[data-testid="module-dialog"]')).not.toBeVisible()
  })
})
