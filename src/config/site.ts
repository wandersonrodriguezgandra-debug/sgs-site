import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'SGS',
  description: 'Sistema de Gestão de Segurança do Trabalho',
  url: import.meta.env.VITE_SITE_URL || 'https://example.com',
  logo: '/images/brand/logo.svg',
  contact: {
    email: 'contato@sgs.com.br',
    phone: '(11) 99999-0000',
    whatsapp: '(11) 99999-0000',
    social: {
      linkedin: 'https://linkedin.com/company/sgs',
      instagram: 'https://instagram.com/sgs',
      youtube: 'https://youtube.com/@sgs',
    },
  },
}
