import { lazy, Suspense, useState } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import ProductShowcaseSection from '@/components/sections/ProductShowcaseSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import SecuritySection from '@/components/sections/SecuritySection'
import ProblemSection from '@/components/sections/ProblemSection'
import ModulesShowcaseSection from '@/components/sections/ModulesShowcaseSection'
import { PageSEO } from '@/components/common/PageSEO'
import { FaqJsonLd, OrganizationJsonLd, SoftwareAppJsonLd } from '@/components/seo/JsonLd'
import { faqItems } from '@/config/faq'
import { siteConfig } from '@/config/site'
import ScrollProvider from '@/components/scroll/ScrollProvider'
import LuminanceArc from '@/components/motion/LuminanceArc'
import { useInView } from '@/hooks/useInView'
import { shouldPin } from '@/lib/scanner-pin'

const ScannerSection = lazy(() => import('@/components/sections/ScannerSection'))
const DashboardSection = lazy(() => import('@/components/sections/DashboardSection'))
const PricingSection = lazy(() => import('@/components/sections/PricingSection'))
const FAQSection = lazy(() => import('@/components/sections/FAQSection'))
const DemoFormSection = lazy(() => import('@/components/sections/DemoFormSection'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-sgs-accent border-t-transparent rounded-full animate-spin" /></div>}>
      {children}
    </Suspense>
  )
}

// O scanner carrega GSAP (~65 KB gzip) além do próprio chunk — só dispara o
// import() quando a seção se aproxima do viewport, para não competir com o
// hero pelo LCP logo no carregamento inicial da página.
function LazyScannerSection() {
  const [setRef, isNear] = useInView<HTMLDivElement>({ rootMargin: '600px 0px', triggerOnce: true })
  const [pinned] = useState(shouldPin)

  if (!isNear) {
    // Reserves the same footprint the mounted variant will occupy (the
    // pinned scroll distance on desktop, or a single viewport for the
    // static mobile/reduced-motion stack) so anchors below it don't shift
    // once the real section mounts and GSAP's pin-spacer resizes the page.
    return (
      <div
        id="scanner"
        ref={setRef}
        className="bg-sgs-blue-950"
        style={{ height: pinned ? '320vh' : '100vh' }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div id="scanner" ref={setRef}>
      <SuspenseWrapper>
        <ScannerSection />
      </SuspenseWrapper>
    </div>
  )
}

export default function HomePage() {
  return (
    <ScrollProvider>
      <PageSEO
        title="Sistema de Gestão de Segurança do Trabalho"
        description="O SGS centraliza riscos, ações, treinamentos, exames e evidências de SST em uma operação rastreável."
        canonicalPath="/"
      />
      <SoftwareAppJsonLd
        name={siteConfig.name}
        description={siteConfig.description}
        url={siteConfig.url}
      />
      <OrganizationJsonLd
        name={siteConfig.name}
        url={siteConfig.url}
        logo={siteConfig.logo}
      />
      <FaqJsonLd items={faqItems} />
      <LuminanceArc />
      <main id="main-content" data-testid="page-home">
        <div data-luminance="0"><HeroSection /></div>
        <div data-luminance="0.15"><ProductShowcaseSection /></div>
        <div data-luminance="0.3"><ProblemSection /></div>
        <div data-luminance="0.45"><LazyScannerSection /></div>
        <div data-luminance="0.6"><ModulesShowcaseSection /></div>
        <div data-luminance="0.7"><HowItWorksSection /></div>
        <div data-luminance="0.8"><SuspenseWrapper><DashboardSection /></SuspenseWrapper></div>
        <div data-luminance="0.85"><SecuritySection /></div>
        <div data-luminance="0.92"><SuspenseWrapper><PricingSection /></SuspenseWrapper></div>
        <div data-luminance="0.97"><SuspenseWrapper><FAQSection /></SuspenseWrapper></div>
        <div data-luminance="1"><SuspenseWrapper><DemoFormSection /></SuspenseWrapper></div>
      </main>
    </ScrollProvider>
  )
}
