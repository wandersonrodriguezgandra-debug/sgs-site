import { test, expect } from '@playwright/test'

test.describe('Cinematic Intro', () => {
  test('should display cinematic intro with intro=force', async ({ page }) => {
    await page.goto('/?intro=force')
    const intro = page.getByTestId('cinematic-preloader')
    await expect(intro).toBeVisible()
  })

  test('should show skip button after 2 seconds', async ({ page }) => {
    await page.goto('/?intro=force')
    const skipButton = page.getByTestId('skip-intro')
    await expect(skipButton).toBeVisible({ timeout: 3000 })
  })

  test('should skip intro when button is clicked', async ({ page }) => {
    await page.goto('/?intro=force')
    const skipButton = page.getByTestId('skip-intro')
    await expect(skipButton).toBeVisible({ timeout: 3000 })
    await page.$eval('[data-testid="skip-intro"]', (el) => (el as HTMLButtonElement).click())
    await page.waitForTimeout(1000)
    const intro = page.getByTestId('cinematic-preloader')
    await expect(intro).toHaveCount(0)
  })

  test('should not play intro on subsequent visits', async ({ page }) => {
    await page.goto('/?intro=force')
    const skipButton = page.getByTestId('skip-intro')
    await expect(skipButton).toBeVisible({ timeout: 3000 })
    await page.$eval('[data-testid="skip-intro"]', (el) => (el as HTMLButtonElement).click())
    await page.waitForTimeout(500)
    await page.goto('/')
    const intro = page.getByTestId('cinematic-preloader')
    await expect(intro).not.toBeVisible()
  })

  test('should not play intro with intro=off param', async ({ page }) => {
    await page.goto('/?intro=off')
    const intro = page.getByTestId('cinematic-preloader')
    await expect(intro).not.toBeVisible()
  })

  test('should respect reduced motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/?intro=force')
    const intro = page.getByTestId('cinematic-preloader')
    await expect(intro).toBeVisible()
  })

  test('skip button should be keyboard accessible', async ({ page }) => {
    await page.goto('/?intro=force')
    const skipButton = page.getByTestId('skip-intro')
    await expect(skipButton).toBeVisible({ timeout: 3000 })
    await skipButton.focus()
    await expect(skipButton).toBeFocused()
    await page.keyboard.press('Enter')
    const intro = page.getByTestId('cinematic-preloader')
    await expect(intro).toHaveCount(0, { timeout: 3000 })
  })

  test('after intro, main content should be accessible', async ({ page }) => {
    await page.goto('/?intro=force')
    const skipButton = page.getByTestId('skip-intro')
    await expect(skipButton).toBeVisible({ timeout: 3000 })
    await page.$eval('[data-testid="skip-intro"]', (el) => (el as HTMLButtonElement).click())
    await page.waitForTimeout(1000)
    const main = page.locator('#main-content')
    await expect(main).toBeVisible()
  })
})
