export const TEST_IDS = {
  // Layout
  HEADER: 'header',
  FOOTER: 'footer',
  MENU_TOGGLE: 'menu-toggle',
  LOGIN_LINK: 'login-link',
  CTA_DEMO: 'cta-demo',

  // Pages
  PAGE_HOME: 'page-home',
  PAGE_NOT_FOUND: 'page-not-found',

  // Hero
  HERO_SECTION: 'hero-section',
  HERO_BADGE: 'hero-badge',
  HERO_TITLE: 'hero-title',
  HERO_DESCRIPTION: 'hero-description',
  HERO_CTA_DEMO: 'hero-cta-demo',
  HERO_CTA_MODULES: 'hero-cta-modules',

  // Audio
  AUDIO_CONTROL: 'audio-control',
  AUDIO_TOGGLE: 'audio-toggle',
  AUDIO_VOLUME: 'audio-volume',

  // Modules
  MODULES_SECTION: 'modules-section',

  // Form
  DEMO_FORM_SECTION: 'demo-form-section',
  DEMO_FORM: 'demo-form',
  FORM_SUCCESS: 'form-success',
  PRIVACY_CHECKBOX: 'privacy-checkbox',
  FORM_SUBMIT: 'form-submit',

  // FAQ
  FAQ_SECTION: 'faq-section',

  // Pricing
  PRICING_SECTION: 'pricing-section',

  // Testimonials
  TESTIMONIALS_SECTION: 'testimonials-section',

  // How it works
  HOW_IT_WORKS_SECTION: 'how-it-works-section',

  // Scene
  PROGRESSIVE_SCENE: 'progressive-scene',
  SCENE_LOADING: 'scene-loading',
  SCENE_ERROR: 'scene-error',
  SCENE_CANVAS: 'scene-canvas',

  // Dialog
  MODULE_DIALOG: 'module-dialog',
  DIALOG_CLOSE: 'dialog-close',

  // Scroll
  SCROLL_PROGRESS: 'scroll-progress',
} as const

export type TestId = (typeof TEST_IDS)[keyof typeof TEST_IDS]
