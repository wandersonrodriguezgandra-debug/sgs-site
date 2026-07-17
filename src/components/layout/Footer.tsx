import { Mail, Phone, MessageCircle, Globe } from 'lucide-react'
import { siteConfig } from '@/config/site'
import Logo from '@/components/ui/Logo'

const solutions = [
  { label: 'Benefícios', href: '#benefits' },
  { label: 'Módulos', href: '#modules' },
  { label: 'Como funciona', href: '#how-it-works' },
  { label: 'Planos', href: '#pricing' },
]

const modulesLinks = [
  { label: 'DDS', href: '#module-dds' },
  { label: 'APR', href: '#module-apr' },
  { label: 'Inspeções', href: '#module-inspections' },
  { label: 'Treinamentos', href: '#module-training' },
  { label: 'Documentos', href: '#module-documents' },
  { label: 'Dashboard', href: '#module-dashboard' },
]

const company = [
  { label: 'Sobre', href: '#about' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contato', href: '#contact' },
  { label: 'Política de Privacidade', href: '#privacy' },
  { label: 'Termos de Uso', href: '#terms' },
]

const socialLinks = [
  { label: 'LinkedIn', href: siteConfig.contact.social.linkedin },
  { label: 'Instagram', href: siteConfig.contact.social.instagram },
  { label: 'YouTube', href: siteConfig.contact.social.youtube },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const whatsappDigits = siteConfig.contact.whatsapp.replace(/\D/g, '')

  return (
    <footer data-testid="footer" className="bg-sgs-blue-950 text-sgs-text-inverse">
      <div className="container-sgs py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo className="mb-4" />
            <p className="max-w-sm text-sm leading-relaxed text-sgs-text-tertiary">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-lg p-2 text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light hover:bg-white/5"
                >
                  <Globe className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sgs-text-inverse">
              Soluções
            </h3>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sgs-text-inverse">
              Módulos
            </h3>
            <ul className="space-y-3">
              {modulesLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sgs-text-inverse">
              Empresa
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-sgs-blue-800 pt-8">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-2 text-sm text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {siteConfig.contact.email}
          </a>
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center gap-2 text-sm text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.contact.phone}
          </a>
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-sgs-text-tertiary transition-colors hover:text-sgs-accent-light"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <div className="mt-6 border-t border-sgs-blue-800 pt-6">
          <p className="text-center text-xs text-sgs-text-tertiary">
            &copy; {currentYear} {siteConfig.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
