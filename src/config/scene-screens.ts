// Configuração das telas do notebook — preparado para substituição pelas imagens oficiais
// IMAGEM TEMPORÁRIA — todas as telas são placeholders até receber as capturas oficiais do SGS

export interface SceneScreen {
  id: string
  label: string
  src: string
  alt: string
  aspectRatio: number
  recommendedWidth: number
  recommendedHeight: number
  isTemporary: boolean
}

export const sceneScreens: SceneScreen[] = [
  {
    id: 'dashboard',
    label: 'Dashboard principal',
    src: '',
    alt: 'Dashboard do SGS — indicadores, gráficos e alertas em tempo real',
    aspectRatio: 16 / 10,
    recommendedWidth: 1920,
    recommendedHeight: 1200,
    isTemporary: true,
  },
  {
    id: 'companies',
    label: 'Gestão de empresas',
    src: '',
    alt: 'Módulo de empresas do SGS — cadastro e gestão',
    aspectRatio: 16 / 10,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    isTemporary: true,
  },
  {
    id: 'dds',
    label: 'DDS',
    src: '',
    alt: 'Módulo DDS do SGS — Diário de Discussão de Segurança',
    aspectRatio: 16 / 10,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    isTemporary: true,
  },
  {
    id: 'apr',
    label: 'APR',
    src: '',
    alt: 'Módulo APR do SGS — Análise Preliminar de Riscos',
    aspectRatio: 16 / 10,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    isTemporary: true,
  },
  {
    id: 'inspections',
    label: 'Inspeções',
    src: '',
    alt: 'Módulo de inspeções do SGS',
    aspectRatio: 16 / 10,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    isTemporary: true,
  },
  {
    id: 'reports',
    label: 'Relatórios',
    src: '',
    alt: 'Módulo de relatórios do SGS',
    aspectRatio: 16 / 10,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    isTemporary: true,
  },
]
