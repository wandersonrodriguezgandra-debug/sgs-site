import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageSEO } from '@/components/common/PageSEO'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <>
      <PageSEO
        title="Página não encontrada"
        description="A página solicitada não foi encontrada no site do SGS."
        canonicalPath={pathname}
        noIndex
      />
      <main
        id="main-content"
        data-testid="page-not-found"
        className="flex min-h-[75vh] flex-col items-center justify-center px-4 pb-16 pt-28 text-center"
      >
        <h1 className="text-8xl font-bold text-sgs-accent sm:text-9xl">404</h1>
        <p className="mt-4 text-xl text-sgs-text-secondary sm:text-2xl">
          Página não encontrada
        </p>
        <p className="mt-2 text-sgs-text-tertiary">
          A página que você procura não existe ou foi movida.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button>
            <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
            Voltar para o início
          </Button>
        </Link>
      </main>
    </>
  )
}
