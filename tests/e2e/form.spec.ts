import { test, expect } from '@playwright/test'
import { waitForPageReady, scrollToElement } from '../helpers/test-utils'

interface SubmittedPayload {
  nome: string
  empresa: string
  email: string
  interesse: string
  privacyAccepted: boolean
  requestId: string
  turnstileToken: string
}

async function fillRequiredFields(page: import('@playwright/test').Page) {
  await page.locator('input[name="nome"]').fill('João Silva')
  await page.locator('input[name="empresa"]').fill('Empresa Teste')
  await page.locator('input[name="email"]').fill('joao@empresa.com')
  await page.locator('select[name="interesse"]').selectOption('riscos_acoes')
  await page.locator('[data-testid="privacy-checkbox"]').check()
}

async function completeSecurityCheck(page: import('@playwright/test').Page) {
  await page.locator('[data-testid="demo-form"]').evaluate((form) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'cf-turnstile-response'
    input.value = 'turnstile-test-token'
    form.appendChild(input)
  })
}

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

  test('should show validation errors on empty submit without calling the API', async ({ page }) => {
    let requestCount = 0
    await page.route('**/api/demo-request', async (route) => {
      requestCount += 1
      await route.abort()
    })

    await page.locator('[data-testid="form-submit"]').click()

    await expect(page.getByText('Nome é obrigatório')).toBeVisible()
    expect(requestCount).toBe(0)
  })

  test('should submit only after a successful API response', async ({ page }) => {
    let submittedPayload: SubmittedPayload | null = null
    await page.route('**/api/demo-request', async (route) => {
      submittedPayload = route.request().postDataJSON() as SubmittedPayload
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    await fillRequiredFields(page)
    await completeSecurityCheck(page)
    await page.locator('[data-testid="form-submit"]').click()

    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="form-success"]')).toBeFocused()
    expect(submittedPayload).toMatchObject({
      nome: 'João Silva',
      empresa: 'Empresa Teste',
      email: 'joao@empresa.com',
      interesse: 'riscos_acoes',
      privacyAccepted: true,
      turnstileToken: 'turnstile-test-token',
    })
    expect(submittedPayload?.requestId).toMatch(/^[0-9a-f-]{36}$/i)
  })

  test('should keep the form and show an honest error when the API fails', async ({ page }) => {
    await page.route('**/api/demo-request', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      })
    })

    await fillRequiredFields(page)
    await completeSecurityCheck(page)
    await page.locator('[data-testid="form-submit"]').click()

    await expect(page.locator('[data-testid="form-error"]')).toContainText(
      'temporariamente indisponível',
    )
    await expect(page.locator('[data-testid="demo-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="form-success"]')).toHaveCount(0)
  })

  test('should not call the API without a security token', async ({ page }) => {
    let requestCount = 0
    await page.route('**/api/demo-request', async (route) => {
      requestCount += 1
      await route.abort()
    })

    await fillRequiredFields(page)
    await page.locator('[data-testid="form-submit"]').click()

    await expect(page.locator('[data-testid="form-error"]')).toContainText(
      'Conclua a verificação de segurança',
    )
    expect(requestCount).toBe(0)
  })

  test('should validate email format', async ({ page }) => {
    await page.locator('input[name="nome"]').fill('João Silva')
    await page.locator('input[name="empresa"]').fill('Empresa Teste')
    await page.locator('input[name="email"]').fill('email-invalido')
    await page.locator('select[name="interesse"]').selectOption('visao_geral')
    await page.locator('[data-testid="privacy-checkbox"]').check()

    await page.locator('[data-testid="form-submit"]').click()

    await expect(page.getByText('E-mail inválido')).toBeVisible()
  })

  test('should require privacy consent', async ({ page }) => {
    await page.locator('input[name="nome"]').fill('João Silva')
    await page.locator('input[name="empresa"]').fill('Empresa Teste')
    await page.locator('input[name="email"]').fill('joao@empresa.com')
    await page.locator('select[name="interesse"]').selectOption('visao_geral')

    await page.locator('[data-testid="form-submit"]').click()

    await expect(page.locator('#privacy-error')).toContainText('autorizar o uso dos dados')
  })
})
