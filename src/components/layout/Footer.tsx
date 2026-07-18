import { ArrowUpRight, Globe, MessageCircle } from 'lucide-react'
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
]

const socialLinks = [
  { label: 'LinkedIn', href: siteConfig.contact.social.linkedin, icon: Globe },
  { label: 'Instagram', href: siteConfig.contact.social.instagram, icon: MessageCircle },
  { label: 'YouTube', href: siteConfig.contact.social.youtube, icon: ArrowUpRight },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer data-testid="footer" className="relative overflow-hidden bg-sgs-blue-950 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sgs-cyan/70 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-sgs-accent/15 blur-3xl" aria-hidden="true" />

      <div className="container-sgs relative z-10 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <Logo className="mb-5 [&_span:first-child]:!text-white [&_span:last-child]:!text-white/45" />
            <p className="max-w-md text-sm leading-relaxed text-white/50">
              {siteConfig.description}. Uma operação conectada, rastreável e pronta para decisões melhores.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/10 p-2.5 text-white/45 transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-sgs-cyan/40 hover:bg-sgs-cyan/10 hover:text-sgs-cyan"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-4 lg:justify-end" aria-label="Navegação do rodapé">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} {siteConfig.name}. Todos os direitos reservados.</p>
          <p>Segurança do Trabalho com contexto, continuidade e controle.</p>
        </div>
      </div>
    </footer>
  )
}
