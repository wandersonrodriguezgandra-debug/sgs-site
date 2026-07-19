import { lazy, Suspense } from 'react'
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
      <main id="main-content" data-testid="page-home">
        <HeroSection />
        <ProductShowcaseSection />
        <ProblemSection />
        <SuspenseWrapper><ScannerSection /></SuspenseWrapper>
        <ModulesShowcaseSection />
        <HowItWorksSection />
        <SuspenseWrapper><DashboardSection /></SuspenseWrapper>
        <SecuritySection />
        <SuspenseWrapper><PricingSection /></SuspenseWrapper>
        <SuspenseWrapper><FAQSection /></SuspenseWrapper>
        <SuspenseWrapper><DemoFormSection /></SuspenseWrapper>
      </main>
    </ScrollProvider>
  )
}
