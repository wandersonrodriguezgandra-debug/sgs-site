import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { navigationLinks, headerCta } from '@/config/navigation'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Header() {
  const isScrolled = useScrollHeader()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const navRef = useRef<HTMLElement>(null)

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  // Track active section for indicator
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer()
      }
    }
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  return (
    <header
      data-testid="header"
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-sgs-blue-100/70 bg-white/[0.88] backdrop-blur-xl transition-all duration-500',
        isScrolled ? 'shadow-[0_10px_35px_rgba(0,61,128,0.08)]' : 'shadow-[0_1px_0_rgba(0,61,128,0.04)]',
      )}
    >
      <div className="container-sgs">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Logo />

          <nav
            ref={navRef}
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navegação principal"
          >
            {navigationLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <div key={link.href} className="group relative">
                  <a
                    href={link.href}
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                      'text-sgs-text-secondary hover:text-sgs-accent hover:bg-sgs-blue-50',
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {link.label}
                      {link.children && (
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </span>
                    {/* Active section indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className={cn(
                          'absolute -bottom-1 left-3 right-3 h-0.5 rounded-full',
                          'bg-sgs-accent'
                        )}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </a>
                  {link.children && (
                    <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 translate-y-1 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="min-w-[220px] rounded-xl bg-white p-2 shadow-sgs-lg ring-1 ring-black/5 backdrop-blur-sm">
                        {link.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-sgs-text-secondary transition-colors hover:bg-sgs-blue-50 hover:text-sgs-accent"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={headerCta.login.href}
              data-testid="login-link"
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                'text-sgs-text-secondary hover:text-sgs-accent',
              )}
            >
              {headerCta.login.label}
            </a>
            <Button href={headerCta.demo.href} size="sm" data-testid="cta-demo">
              {headerCta.demo.label}
            </Button>
          </div>

          <button
            type="button"
            data-testid="menu-toggle"
            onClick={toggleDrawer}
            aria-label={isDrawerOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isDrawerOpen}
            className={cn(
              'rounded-lg p-2 transition-colors duration-200 lg:hidden',
              'text-sgs-text-primary hover:bg-sgs-blue-50',
            )}
          >
            {isDrawerOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
            >
              <div className="flex h-16 items-center justify-between px-4 border-b border-sgs-border-light">
                <Logo />
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Fechar menu"
                  className="rounded-lg p-2 text-sgs-text-primary hover:bg-sgs-blue-50"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Navegação mobile">
                {navigationLinks.map((link) => (
                  <div key={link.href}>
                    <a
                      href={link.href}
                      onClick={closeDrawer}
                      aria-current={activeSection === link.href.replace('#', '') ? 'page' : undefined}
                      className={cn(
                        'block rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-sgs-blue-50 hover:text-sgs-accent',
                        activeSection === link.href.replace('#', '')
                          ? 'text-sgs-accent bg-sgs-blue-50'
                          : 'text-sgs-text-primary'
                      )}
                    >
                      {link.label}
                    </a>
                    {link.children && (
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-sgs-border-light pl-4">
                        {link.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={closeDrawer}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-sgs-text-secondary transition-colors hover:bg-sgs-blue-50 hover:text-sgs-accent"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="flex flex-col gap-3 border-t border-sgs-border px-4 py-6">
                <Button href={headerCta.demo.href} className="w-full">
                  {headerCta.demo.label}
                </Button>
                <a
                  href={headerCta.login.href}
                  className="w-full rounded-lg bg-sgs-blue-50 px-6 py-2.5 text-center text-sm font-semibold text-sgs-accent transition-colors hover:bg-sgs-blue-100"
                >
                  {headerCta.login.label}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
