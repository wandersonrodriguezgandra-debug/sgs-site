import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

test.describe('Demo Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
    await scrollToElement(page, 'demo-form-section')
  })

  test('should render the form section', async ({ page }) => {
    await expect(page.locator('[data-testid="demo-form-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="demo-form"]')).toBeVisible()
  })

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.locator('[data-testid="form-submit"]').click()
    await page.waitForTimeout(300)

    const alerts = page.locator('[role="alert"]')
    await expect(alerts.first()).toBeVisible()
  })

  test('should submit form successfully', async ({ page }) => {
    await page.locator('input[name="nome"]').fill('João Silva')
    await page.locator('input[name="empresa"]').fill('Empresa Teste')
    await page.locator('input[name="email"]').fill('joao@empresa.com')
    await page.locator('[data-testid="privacy-checkbox"]').check()

    await page.locator('[data-testid="form-submit"]').click()
    await page.waitForTimeout(2000)

    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.locator('input[name="nome"]').fill('João Silva')
    await page.locator('input[name="empresa"]').fill('Empresa Teste')
    await page.locator('input[name="email"]').fill('email-invalido')
    await page.locator('[data-testid="privacy-checkbox"]').check()

    await page.locator('[data-testid="form-submit"]').click()
    await page.waitForTimeout(300)

    await expect(page.locator('text=E-mail inválido')).toBeVisible()
  })

  test('should require privacy checkbox', async ({ page }) => {
    await page.locator('input[name="nome"]').fill('João Silva')
    await page.locator('input[name="empresa"]').fill('Empresa Teste')
    await page.locator('input[name="email"]').fill('joao@empresa.com')

    await page.locator('[data-testid="form-submit"]').click()
    await page.waitForTimeout(300)

    await expect(page.locator('p[role="alert"] >> text=privacidade')).toBeVisible()
  })
})
