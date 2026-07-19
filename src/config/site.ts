import type { SiteConfig } from '@/types'

const DEFAULT_SITE_URL = 'https://sgs-site-byk.pages.dev'

function normalizeSiteUrl(value: string | undefined): string {
  const candidate = value?.trim() || DEFAULT_SITE_URL

  try {
    const url = new URL(candidate)
    return url.href.replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

const siteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL)

export const siteConfig: SiteConfig = {
  name: 'SGS',
  description: 'Sistema de Gestão de Segurança do Trabalho',
  url: siteUrl,
  logo: `${siteUrl}/images/brand/logo.svg`,
}
