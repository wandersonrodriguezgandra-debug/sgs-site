import type { NavigationLink } from '@/types'

export const navigationLinks: NavigationLink[] = [
  { label: 'Início', href: '#hero' },
  {
    label: 'Soluções',
    href: '#solutions',
    children: [
      { label: 'Benefícios', href: '#benefits' },
      { label: 'Módulos', href: '#modules' },
      { label: 'Como funciona', href: '#how-it-works' },
    ],
  },
  { label: 'Planos', href: '#pricing' },
  { label: 'Blog', href: '#blog' },
  { label: 'Sobre', href: '#about' },
  { label: 'Contato', href: '#contact' },
]

export const headerCta = {
  demo: { label: 'Solicitar demonstração', href: '#demo' },
  login: { label: 'Acessar o sistema', href: 'https://app.sgs.com.br' },
}
