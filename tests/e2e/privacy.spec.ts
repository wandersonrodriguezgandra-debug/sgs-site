import { test, expect } from '@playwright/test'
import { waitForPageReady, viewports } from '../helpers/test-utils'

test.describe('Privacy route', () => {
  test('renders a complete, indexable policy at /privacidade', async ({ page }) => {
    await page.goto('/privacidade')
    await waitForPageReady(page)

    await expect(page.locator('[data-testid="page-privacy"]')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeVisible()
    await expect(page).toHaveTitle('Política de Privacidade | SGS')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://sgs-site-byk.pages.dev/privacidade',
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
    await expect(page.getByText('Cloudflare', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Resend', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Sophie ou à OpenAI', { exact: false })).toBeVisible()
  })

  test('opens the rights channel with the correct interest preselected', async ({ page }) => {
    await page.goto('/privacidade')
    await page.getByRole('link', { name: 'Exercer meus direitos' }).click()

    await expect(page).toHaveURL(/\?interesse=privacidade_dados#contato$/)
    await expect(page.locator('#field-interesse')).toHaveValue('privacidade_dados')
  })

  test('returns from privacy to a home anchor below the fixed header', async ({ page }) => {
    await page.setViewportSize(viewports.desktop)
    await page.goto('/privacidade')
    await page.locator('[data-testid="header"] a[href="/#pricing"]').click()

    await expect(page).toHaveURL(/#pricing$/)
    await expect.poll(
      () =>
        page.evaluate(() => {
          const target = document.getElementById('pricing')
          const header = document.querySelector<HTMLElement>('[data-testid="header"]')
          if (!target || !header) return false

          const expectedTop = header.getBoundingClientRect().height + 16
          return Math.abs(target.getBoundingClientRect().top - expectedTop) <= 3
        }),
      { timeout: 6_000 },
    ).toBe(true)
  })

  test('contains no known placeholder or dead contact destination', async ({ page }) => {
    await page.goto('/')
    await waitForPageReady(page)

    const hrefs = await page.locator('a[href]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href') ?? ''),
    )
    const forbidden = /example\.com|app\.sgs\.com\.br|99999|linkedin\.com\/company\/sgs|instagram\.com\/sgs|youtube\.com\/@sgs/

    expect(hrefs.filter((href) => forbidden.test(href))).toEqual([])
  })
})
