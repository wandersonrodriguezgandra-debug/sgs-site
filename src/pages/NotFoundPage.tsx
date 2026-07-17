import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      data-testid="page-not-found"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
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
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar para o início
        </Button>
      </Link>
    </main>
  )
}
