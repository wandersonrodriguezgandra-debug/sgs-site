import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SkipLink } from '@/components/common/SkipLink'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import PrivacyPage from '@/pages/PrivacyPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SkipLink />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  )
}
