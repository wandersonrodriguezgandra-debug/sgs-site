import { lazy, Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import ProductShowcaseSection from '@/components/sections/ProductShowcaseSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import SecuritySection from '@/components/sections/SecuritySection'
import ProblemSection from '@/components/sections/ProblemSection'
import ModulesShowcaseSection from '@/components/sections/ModulesShowcaseSection'
import ScannerSection from '@/components/sections/ScannerSection'
import { FaqJsonLd } from '@/components/seo/JsonLd'
import { faqItems } from '@/config/faq'
import ScrollProvider from '@/components/scroll/ScrollProvider'

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
      <FaqJsonLd items={faqItems} />
      <main id="main-content" data-testid="page-home">
        <HeroSection />
        <ProductShowcaseSection />
        <ProblemSection />
        <ScannerSection />
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
