import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import Logo from '@/components/ui/Logo'

const footerLinks = [
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Módulos', href: '#modules' },
  { label: 'Como funciona', href: '#how-it-works' },
  { label: 'Segurança', href: '#security' },
  { label: 'Planos', href: '#pricing' },
  { label: 'Dúvidas', href: '#faq' },
  { label: 'Contato', href: '#contato' },
  { label: 'Privacidade', href: '/privacidade' },
]

export function Footer() {
  const { pathname } = useLocation()
  const isHomePage = pathname === '/'
  const currentYear = new Date().getFullYear()
  const resolveHref = (href: string) =>
    href.startsWith('#') && !isHomePage ? `/${href}` : href

  return (
    <footer data-testid="footer" className="border-t border-white/15 bg-sgs-blue-950 text-white">
      <div className="container-sgs py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.8fr_1fr] lg:gap-14">
          <div>
            <Logo
              href={resolveHref('#hero')}
              className="mb-5 [&_span:first-child]:!text-white [&_span:last-child]:!text-white/70"
            />
            <p className="max-w-md text-sm leading-relaxed text-white/75">
              {siteConfig.description}. Uma operação conectada, rastreável e pronta para decisões melhores.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold text-white">Navegação</h2>
            <nav className="mt-4 grid grid-cols-2 gap-x-5" aria-label="Navegação do rodapé">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={resolveHref(link.href)}
                  className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-white/75 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sgs-cyan-light">
              Próximo passo
            </p>
            <h2 className="mt-3 font-heading text-xl font-semibold leading-snug text-white">
              Veja o SGS aplicado à sua operação.
            </h2>
            <a
              href={resolveHref('#contato')}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
            >
              Solicitar demonstração
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} {siteConfig.name}. Todos os direitos reservados.</p>
          <p>Segurança do Trabalho com contexto, continuidade e controle.</p>
        </div>
      </div>
    </footer>
  )
}
