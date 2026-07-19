import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import { PageSEO } from '@/components/common/PageSEO'
import { PRIVACY_POLICY_VERSION } from '@/config/privacy'

const summaryItems = [
  'Dados informados no formulário de contato',
  'Uso limitado ao atendimento da solicitação',
  'Sem venda de dados ou perfil publicitário',
  'Canal direto para exercer direitos da LGPD',
]

export default function PrivacyPage() {
  return (
    <>
      <PageSEO
        title="Política de Privacidade"
        description="Saiba quais dados o site do SGS trata, para quais finalidades e como exercer seus direitos previstos na LGPD."
        canonicalPath="/privacidade"
      />

      <main id="main-content" data-testid="page-privacy" className="bg-white pt-16 md:pt-20">
        <header className="border-b border-sgs-blue-100 bg-sgs-blue-950 text-white">
          <div className="container-sgs py-16 md:py-24">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sgs-cyan-light">
              Transparência e LGPD
            </p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
              Política de Privacidade
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
              Esta política explica, em linguagem direta, como o site institucional do SGS trata
              os dados enviados pelo formulário de contato e pela verificação de segurança.
            </p>
            <p className="mt-8 text-sm font-medium text-white/70">
              Versão vigente: <time dateTime={PRIVACY_POLICY_VERSION}>18 de julho de 2026</time>
            </p>
          </div>
        </header>

        <div className="container-sgs grid gap-12 py-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.7fr)] lg:gap-20 lg:py-20">
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Resumo da política">
            <div className="rounded-2xl border border-sgs-blue-100 bg-sgs-blue-50/60 p-6 md:p-7">
              <h2 className="font-heading text-lg font-semibold text-sgs-text-primary">
                Em poucas palavras
              </h2>
              <ul className="mt-5 space-y-4">
                {summaryItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-sgs-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sgs-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/?interesse=privacidade_dados#contato"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-sgs-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sgs-accent-dark"
            >
              Exercer meus direitos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </aside>

          <article className="privacy-content max-w-3xl">
            <section aria-labelledby="privacy-controller">
              <h2 id="privacy-controller" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                1. Quem é responsável pelo tratamento
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                O SGS — Sistema de Gestão de Segurança do Trabalho — é responsável pelas decisões
                sobre o tratamento realizado neste site e pelo atendimento das solicitações
                relacionadas a esses dados.
              </p>
            </section>

            <section aria-labelledby="privacy-data" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-data" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                2. Quais dados são tratados
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                No formulário, tratamos nome, empresa, e-mail, telefone opcional e o foco escolhido
                para a solicitação. A Cloudflare também pode processar endereço IP, token de
                verificação e outros sinais técnicos necessários para prevenir envios abusivos.
              </p>
              <p className="mt-4 rounded-xl border border-sgs-blue-100 bg-sgs-blue-50/60 p-5 text-sm leading-relaxed text-sgs-text-secondary">
                Não envie CPF, dados médicos, documentos de trabalhadores ou qualquer informação
                sensível. O formulário não possui campo de mensagem livre e não envia seus dados à
                Sophie ou à OpenAI.
              </p>
            </section>

            <section aria-labelledby="privacy-purpose" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-purpose" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                3. Para que os dados são usados
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                Usamos os dados fornecidos para responder à solicitação, direcionar a demonstração
                ao contexto informado e manter o registro operacional desse atendimento. Os sinais
                técnicos da Cloudflare são usados somente para segurança, prevenção de abuso e
                disponibilidade do canal.
              </p>
            </section>

            <section aria-labelledby="privacy-processors" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-processors" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                4. Operadores e compartilhamento
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                O site utiliza a Cloudflare para hospedagem e verificação antiabuso, e a Resend para
                encaminhar a solicitação por e-mail. Esses fornecedores tratam apenas os dados
                necessários à prestação dos respectivos serviços. Não vendemos dados pessoais nem
                os compartilhamos para publicidade comportamental.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href="https://www.cloudflare.com/policies/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-sgs-accent underline decoration-sgs-blue-200 underline-offset-4 hover:text-sgs-accent-dark"
                  >
                    Política de privacidade da Cloudflare
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://resend.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-sgs-accent underline decoration-sgs-blue-200 underline-offset-4 hover:text-sgs-accent-dark"
                  >
                    Política de privacidade da Resend
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-sgs-text-secondary">
                A infraestrutura desses fornecedores pode envolver tratamento internacional, sujeito
                às salvaguardas e aos contratos adotados por cada operador.
              </p>
            </section>

            <section aria-labelledby="privacy-retention" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-retention" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                5. Armazenamento e segurança
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                A Function do formulário não grava a solicitação em banco de dados: ela valida o
                envio e o encaminha ao e-mail operacional. A mensagem permanece somente pelo período
                necessário ao atendimento, à proteção de direitos e ao cumprimento de obrigações
                legais aplicáveis. Aplicamos limitação de tamanho, validação de origem, proteção
                antiabuso e minimização dos campos coletados.
              </p>
            </section>

            <section aria-labelledby="privacy-rights" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-rights" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                6. Seus direitos
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                Você pode pedir confirmação do tratamento, acesso, correção, informação sobre
                compartilhamento, portabilidade quando aplicável, anonimização, bloqueio, eliminação
                e revogação do consentimento, nos termos da LGPD.
              </p>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                Para exercer um direito, use o formulário e selecione
                <strong className="font-semibold text-sgs-text-primary"> “Privacidade e direitos sobre dados”</strong>.
                Poderemos solicitar informações mínimas para confirmar a identidade do titular antes
                de concluir o atendimento.
              </p>
            </section>

            <section aria-labelledby="privacy-cookies" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-cookies" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                7. Cookies e decisões automatizadas
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                O site não usa cookies de publicidade nem ferramentas próprias de análise de
                comportamento. A verificação Turnstile pode usar mecanismos técnicos de segurança.
                A análise automática serve apenas para bloquear abuso no formulário e não produz
                decisões jurídicas, profissionais ou relacionadas a trabalhadores.
              </p>
            </section>

            <section aria-labelledby="privacy-updates" className="mt-12 border-t border-sgs-border pt-12">
              <h2 id="privacy-updates" className="font-heading text-2xl font-semibold text-sgs-text-primary md:text-3xl">
                8. Atualizações desta política
              </h2>
              <p className="mt-4 leading-relaxed text-sgs-text-secondary">
                Mudanças relevantes serão publicadas nesta página com uma nova data de vigência. A
                versão aceita no formulário também é registrada junto à solicitação.
              </p>
            </section>
          </article>
        </div>
      </main>
    </>
  )
}
