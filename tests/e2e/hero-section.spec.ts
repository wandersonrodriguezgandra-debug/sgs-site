import { test, expect } from '@playwright/test'
import { waitForPageReady } from '../helpers/test-utils'

const heroTitle = 'O sistema que enxerga o risco, organiza a resposta e comprova a proteção.'

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)
  })

  test('should display the hero section with key elements', async ({ page }) => {
    const heroSection = page.locator('[data-testid="hero-section"]')
    const heading = page.locator('[data-testid="hero-title"]')

    await expect(heroSection).toBeVisible()
    await expect(heroSection).toHaveAttribute('aria-labelledby', 'hero-title')
    await expect(heading).toBeVisible()
    await expect(heading).toHaveAttribute('id', 'hero-title')
    await expect(heading).toHaveText(heroTitle)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('[data-testid="hero-description"]')).toBeVisible()
  })

  test('should show CTA buttons in hero', async ({ page }) => {
    const demoCta = page.locator('[data-testid="hero-cta-demo"]')
    const modulesCta = page.locator('[data-testid="hero-cta-modules"]')

    await expect(demoCta).toBeVisible()
    await expect(demoCta).toHaveText('Solicitar demonstração')
    await expect(demoCta).toHaveAttribute('href', '#contato')
    await expect(modulesCta).toBeVisible()
    await expect(modulesCta).toHaveText('Conhecer os módulos')
    await expect(modulesCta).toHaveAttribute('href', '#modules')
  })
})
