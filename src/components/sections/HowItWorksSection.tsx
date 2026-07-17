'use client'

import PinnedStorySection from '@/components/scroll/PinnedStorySection'
import { steps } from '@/config/steps'

export default function HowItWorksSection() {
  return (
    <PinnedStorySection
      steps={steps}
      title="Como funciona"
      subtitle="Em poucos passos sua empresa estará com a gestão de SST completa, organizada e digital."
      id="how-it-works"
    />
  )
}
