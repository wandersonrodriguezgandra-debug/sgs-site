import type { MediaImage } from '@/types'

export const images = {
  brand: {
    logo: {
      src: '/images/brand/logo.svg',
      alt: 'SGS — Sistema de Gestão de Segurança do Trabalho',
      title: 'SGS',
      category: 'brand',
      temporary: true,
      recommendedSize: '200x50px',
    } satisfies MediaImage,
    logoIcon: {
      src: '/images/brand/icon.svg',
      alt: 'Ícone SGS',
      title: 'SGS',
      category: 'brand',
      temporary: true,
      recommendedSize: '40x40px',
    } satisfies MediaImage,
  },
  hero: {
    dashboard: {
      src: '/images/hero/dashboard-preview.svg',
      alt: 'Preview do dashboard do SGS — IMAGEM TEMPORÁRIA',
      title: 'Dashboard SGS',
      category: 'hero',
      temporary: true,
      recommendedSize: '800x600px',
    } satisfies MediaImage,
  },
  dashboard: {
    main: {
      src: '/images/dashboard/main-preview.svg',
      alt: 'Painel principal do SGS — IMAGEM TEMPORÁRIA. Substituir pela captura oficial do dashboard.',
      title: 'Dashboard principal SGS',
      category: 'dashboard',
      temporary: true,
      recommendedSize: '1200x800px',
    } satisfies MediaImage,
  },
  modules: {
    default: {
      src: '/images/modules/module-preview.svg',
      alt: 'Preview do módulo — IMAGEM TEMPORÁRIA',
      category: 'modules',
      temporary: true,
      recommendedSize: '400x300px',
    } satisfies MediaImage,
  },
  about: {
    team: {
      src: '/images/about/team.svg',
      alt: 'Equipe SGS — IMAGEM TEMPORÁRIA',
      category: 'about',
      temporary: true,
      recommendedSize: '600x400px',
    } satisfies MediaImage,
  },
  placeholders: {
    testimonial: {
      src: '/images/placeholders/testimonial.svg',
      alt: 'Espaço reservado para depoimento de cliente',
      title: 'Depoimento',
      category: 'placeholders',
      temporary: true,
      recommendedSize: '80x80px',
    } satisfies MediaImage,
    blog: {
      src: '/images/placeholders/blog.svg',
      alt: 'Espaço reservado para imagem do blog',
      category: 'placeholders',
      temporary: true,
      recommendedSize: '800x400px',
    } satisfies MediaImage,
    screenshot: {
      src: '/images/placeholders/screenshot.svg',
      alt: 'Captura de tela do SGS — IMAGEM TEMPORÁRIA. Substituir pela imagem oficial.',
      category: 'placeholders',
      temporary: true,
      recommendedSize: '1200x800px',
    } satisfies MediaImage,
  },
} as const

export function getImage(
  category: keyof typeof images,
  name: string,
): MediaImage {
  const cat = images[category]
  if (cat && typeof cat === 'object' && name in cat) {
    return (cat as Record<string, MediaImage>)[name]
  }
  return {
    src: '/images/placeholders/screenshot.svg',
    alt: 'Imagem indisponível',
    category: 'placeholder',
    temporary: true,
  }
}
