import { type Page } from '@playwright/test'

export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

export async function assertNoConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  return errors
}

export async function scrollToElement(page: Page, testId: string) {
  await page.locator(`[data-testid="${testId}"]`).first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
}

export const viewports = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  wide: { width: 1920, height: 1080 },
} as const

export const TEST_IDS = {
  HEADER: 'header',
  FOOTER: 'footer',
  MENU_TOGGLE: 'menu-toggle',
  PAGE_HOME: 'page-home',
  HERO_SECTION: 'hero-section',
  HERO_BADGE: 'hero-badge',
  HERO_TITLE: 'hero-title',
  HERO_CTA_DEMO: 'hero-cta-demo',
  HERO_CTA_MODULES: 'hero-cta-modules',
  MODULES_SECTION: 'modules-section',
  MODULE_DIALOG: 'module-dialog',
  DIALOG_CLOSE: 'dialog-close',
  DEMO_FORM_SECTION: 'demo-form-section',
  DEMO_FORM: 'demo-form',
  FORM_SUCCESS: 'form-success',
  PRIVACY_CHECKBOX: 'privacy-checkbox',
  FORM_SUBMIT: 'form-submit',
  FAQ_SECTION: 'faq-section',
  PRICING_SECTION: 'pricing-section',
  TESTIMONIALS_SECTION: 'testimonials-section',
  HOW_IT_WORKS_SECTION: 'how-it-works-section',
  PROGRESSIVE_SCENE: 'progressive-scene',
  PROBLEM_SECTION: 'problem-section',
  MODULES_SHOWCASE_SECTION: 'modules-showcase-section',
  CONVERSION_SECTION: 'conversion-section',
  CONVERSION_CTA_DEMO: 'conversion-cta-demo',
  CONVERSION_CTA_CHAT: 'conversion-cta-chat',
}
