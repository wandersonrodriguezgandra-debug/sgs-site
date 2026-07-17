import { lazy, Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import TrustSection from '@/components/sections/TrustSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import ModulesSection from '@/components/sections/ModulesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import SecuritySection from '@/components/sections/SecuritySection'
import ProblemSection from '@/components/sections/ProblemSection'
import ModulesShowcaseSection from '@/components/sections/ModulesShowcaseSection'
import ConversionSection from '@/components/sections/ConversionSection'
import ScannerSection from '@/components/sections/ScannerSection'
import FrozenTimeSection from '@/components/sections/FrozenTimeSection'
import { FaqJsonLd } from '@/components/seo/JsonLd'
import { faqItems } from '@/config/faq'
import ScrollProvider from '@/components/scroll/ScrollProvider'
import ScrollProgress from '@/components/scroll/ScrollProgress'
import SectionTransition from '@/components/scroll/SectionTransition'
import WebGLSectionTransition from '@/components/three/WebGLSectionTransition'

const DashboardSection = lazy(() => import('@/components/sections/DashboardSection'))
const DifferentialsSection = lazy(() => import('@/components/sections/DifferentialsSection'))
const PricingSection = lazy(() => import('@/components/sections/PricingSection'))
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'))
const FAQSection = lazy(() => import('@/components/sections/FAQSection'))
const DemoFormSection = lazy(() => import('@/components/sections/DemoFormSection'))
const FinalCTASection = lazy(() => import('@/components/sections/FinalCTASection'))

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
      <ScrollProgress />
      <main id="main-content" data-testid="page-home">
        <HeroSection />

        <WebGLSectionTransition>
          <TrustSection />
        </WebGLSectionTransition>

        <SectionTransition delay={0.1} parallax>
          <BenefitsSection />
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <ProblemSection />
        </SectionTransition>

        {/* DRAMATIC: Scanner sweeps across identifying risks */}
        <ScannerSection />

        <SectionTransition delay={0.05} parallax>
          <ModulesSection />
        </SectionTransition>

        {/* DRAMATIC: Frozen time analysis */}
        <FrozenTimeSection />

        <SectionTransition delay={0.05} stagger={0.15}>
          <ModulesShowcaseSection />
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <HowItWorksSection />
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><DashboardSection /></SuspenseWrapper>
        </SectionTransition>

        <SectionTransition delay={0.05} parallax>
          <SecuritySection />
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><DifferentialsSection /></SuspenseWrapper>
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><PricingSection /></SuspenseWrapper>
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><TestimonialsSection /></SuspenseWrapper>
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><FAQSection /></SuspenseWrapper>
        </SectionTransition>

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><DemoFormSection /></SuspenseWrapper>
        </SectionTransition>

        <ConversionSection />

        <SectionTransition delay={0.05}>
          <SuspenseWrapper><FinalCTASection /></SuspenseWrapper>
        </SectionTransition>
      </main>
    </ScrollProvider>
  )
}
