export const PRIVACY_POLICY_VERSION = '2026-07-18'

export const DEMO_INTEREST_LABELS = {
  centralizar_sst: 'Centralizar rotinas e documentos de SST',
  riscos_acoes: 'Organizar riscos e planos de ação',
  treinamentos_exames: 'Acompanhar treinamentos e exames',
  visao_geral: 'Conhecer a plataforma de forma geral',
  privacidade_dados: 'Privacidade e direitos sobre dados',
} as const

export type DemoInterest = keyof typeof DEMO_INTEREST_LABELS

export function isDemoInterest(value: string): value is DemoInterest {
  return Object.hasOwn(DEMO_INTEREST_LABELS, value)
}
