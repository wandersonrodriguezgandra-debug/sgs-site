'use client'

import { lazy, Suspense, useState, useEffect } from 'react'
import { ArrowRight, Play, LayoutDashboard, FileText, Shield, BarChart3 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'
import Reveal from '@/components/motion/Reveal'
import BlurReveal from '@/components/motion/BlurReveal'
import Stagger from '@/components/motion/Stagger'
import MaskedTextReveal from '@/components/motion/MaskedTextReveal'
import Magnetic from '@/components/interaction/Magnetic'
import AnimatedCounter from '@/components/scroll/AnimatedCounter'
import HeroBackground from '@/components/sections/HeroBackground'
import FloatingDashboard from '@/components/ui/FloatingDashboard'
import FloatingCards from '@/components/sections/FloatingCards'
import SceneFallback from '@/components/three/SceneFallback'
import WebGLErrorBoundary from '@/components/three/WebGLErrorBoundary'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

const Hero3DScene = lazy(() => import('@/components/three/Hero3DScene'))

const metrics = [
  { icon: <LayoutDashboard size={18} />, label: 'Gestão centralizada' },
  { icon: <FileText size={18} />, label: 'Documentação rastreável' },
  { icon: <Shield size={18} />, label: 'Controle de riscos' },
  { icon: <BarChart3 size={18} />, label: 'Decisões baseadas em dados' },
]

function SceneLoader() {
  return (
    <div className="relative w-full max-w-lg mx-auto min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
      <FloatingDashboard />
    </div>
  )
}

export default function HeroSection() {
  const webgl = useWebGLSupport()
  const isTouch = useIsTouchDevice()
  const [use3D, setUse3D] = useState(false)

  useEffect(() => {
    setUse3D(webgl.supported && !isTouch)
  }, [webgl.supported, isTouch])

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* Deep cinematic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sgs-blue-950 via-[#0a1628] to-sgs-blue-900" />
      <HeroBackground />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 vignette pointer-events-none z-[1]" aria-hidden="true" />

      <div className="container-sgs relative z-10 py-24 md:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <BlurReveal delay={0.1} duration={0.6}>
              <Badge variant="info" data-testid="hero-badge">
                Sistema de Gestão de Segurança
              </Badge>
            </BlurReveal>

            <div data-testid="hero-title">
              <MaskedTextReveal
                text="Segurança inteligente para operações que não podem parar"
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-sgs-text-inverse text-balance leading-[1.1]"
                delay={0.3}
                stagger={0.035}
                duration={0.6}
              />
            </div>

            <BlurReveal delay={0.6} duration={0.6} blur={6}>
              <Text size="lg" className="text-white/60 max-w-lg" color="primary" data-testid="hero-description">
                Centralize empresas, trabalhadores, documentos, inspeções, APRs, DDS, relatórios e indicadores em uma única plataforma.
              </Text>
            </BlurReveal>

            <Reveal delay={0.9} direction="up" distance={20}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Magnetic strength={5} radius={200}>
                  <Button size="lg" variant="primary" className="group" data-testid="hero-cta-demo">
                    Solicitar demonstração
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Magnetic>
                <Magnetic strength={5} radius={200}>
                  <Button size="lg" variant="outline" className="group" data-testid="hero-cta-modules">
                    <Play size={20} className="transition-transform duration-300 group-hover:scale-110" />
                    Conhecer o SGS
                  </Button>
                </Magnetic>
              </div>
            </Reveal>

            <Stagger className="flex flex-wrap gap-x-6 gap-y-2 pt-4" staggerDelay={0.12} delay={1.3}>
              <div className="flex items-center gap-1.5 text-white/60">
                <AnimatedCounter from={0} to={2000} duration={2} prefix="+" className="text-sgs-accent-light font-bold tabular-nums" />
                <span className="text-sm">empresas confiam</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <span className="text-sgs-accent-light font-bold tabular-nums">99,7%</span>
                <span className="text-sm">uptime</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <span className="text-sgs-accent-light text-sm">Gestão em tempo real</span>
              </div>
            </Stagger>

            <Stagger className="grid grid-cols-2 gap-3 pt-4" staggerDelay={0.08} delay={1.6}>
              {metrics.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-white/70">
                  <span className="text-sgs-accent-light shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </Stagger>
          </div>

          <Reveal direction="right" delay={1.5} duration={0.8} distance={40}>
            <div className="lg:relative lg:inset-auto lg:z-auto lg:pointer-events-auto absolute inset-0 z-0 pointer-events-none opacity-30 lg:opacity-100 transition-opacity duration-700">
              {use3D ? (
                <WebGLErrorBoundary fallback={<SceneFallback />}>
                  <Suspense fallback={<SceneLoader />}>
                    <Hero3DScene />
                  </Suspense>
                </WebGLErrorBoundary>
              ) : (
                <div className="relative">
                  <FloatingDashboard />
                  <FloatingCards />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
