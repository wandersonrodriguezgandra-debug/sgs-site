import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SkipLink } from '@/components/common/SkipLink'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PageSEO } from '@/components/common/PageSEO'
import { SoftwareAppJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { CinematicTimeProvider } from '@/providers/CinematicTimeProvider'
import { AudioExperienceProvider } from '@/providers/AudioExperienceProvider'
import CursorProvider from '@/providers/CursorProvider'
import CinematicPreloader from '@/components/intro/CinematicPreloader'
import AudioControl from '@/components/ui/AudioControl'
import GrainOverlay from '@/components/ui/GrainOverlay'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { siteConfig } from '@/config/site'

export default function App() {
  return (
    <BrowserRouter>
      <CinematicTimeProvider>
          <AudioExperienceProvider>
            <MotionProvider>
              <ErrorBoundary>
                <CursorProvider>
                <GrainOverlay />
                <CinematicPreloader />
                <PageSEO title="Home" description="Sistema de Gestão de Segurança do Trabalho" />
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
                <SkipLink />
                <Header />
                <AudioControl />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
                </CursorProvider>
              </ErrorBoundary>
            </MotionProvider>
          </AudioExperienceProvider>
      </CinematicTimeProvider>
    </BrowserRouter>
  )
}
