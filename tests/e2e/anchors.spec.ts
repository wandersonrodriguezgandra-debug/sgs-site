import { test, expect, type Page } from '@playwright/test'
import { waitForPageReady, viewports } from '../helpers/test-utils'

async function expectAnchorPosition(page: Page, hash: string) {
  const id = hash.slice(1)

  await expect(page).toHaveURL(new RegExp(`${hash}$`))
  await expect.poll(
    () =>
      page.evaluate((targetId) => {
        const target = document.getElementById(targetId)
        const header = document.querySelector<HTMLElement>('[data-testid="header"]')
        if (!target || !header) return false

        if (targetId === 'hero') return window.scrollY <= 2

        const expectedTop = header.getBoundingClientRect().height + 16
        return Math.abs(target.getBoundingClientRect().top - expectedTop) <= 3
      }, id),
    { timeout: 6_000 },
  ).toBe(true)
}

async function getLocalHashes(page: Page, selector: string) {
  const hashes = await page.locator(selector).evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => Boolean(href?.startsWith('#') && href.length > 1)),
  )
  return [...new Set(hashes)]
}

test.describe('Anchor navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop)
    await page.goto('/')
    await waitForPageReady(page)
  })

  test('positions every header anchor below the fixed header', async ({ page }) => {
    const hashes = await getLocalHashes(page, '[data-testid="header"] a[href^="#"]')

    for (const hash of hashes) {
      await page.locator(`[data-testid="header"] a[href="${hash}"]`).first().click()
      await expectAnchorPosition(page, hash)
    }
  })

  test('positions every footer anchor below the fixed header', async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]')
    const hashes = await getLocalHashes(page, '[data-testid="footer"] a[href^="#"]')

    for (const hash of hashes) {
      await footer.scrollIntoViewIfNeeded()
      await footer.locator(`a[href="${hash}"]`).first().click()
      await expectAnchorPosition(page, hash)
    }
  })

  test('corrects an initial hash after lazy sections settle', async ({ page }) => {
    await page.goto('/#contato')
    await expectAnchorPosition(page, '#contato')
  })

  test('keeps hash navigation correct with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await page.locator('[data-testid="header"] a[href="#pricing"]').click()
    await expectAnchorPosition(page, '#pricing')
  })

  test('restores the correct offset when navigating browser history', async ({ page }) => {
    await page.locator('[data-testid="header"] a[href="#modules"]').click()
    await expectAnchorPosition(page, '#modules')
    await page.locator('[data-testid="header"] a[href="#pricing"]').click()
    await expectAnchorPosition(page, '#pricing')

    await page.goBack()
    await expectAnchorPosition(page, '#modules')
  })
})
