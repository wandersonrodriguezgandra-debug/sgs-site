'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import FormField from '@/components/ui/FormField'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'

interface FormData {
  nome: string
  empresa: string
  cargo: string
  email: string
  telefone: string
  colaboradores: string
  interesse: string
  mensagem: string
}

const colaboradoresOptions = [
  { label: 'Selecione...', value: '' },
  { label: '1 a 10', value: '1-10' },
  { label: '11 a 50', value: '11-50' },
  { label: '51 a 200', value: '51-200' },
  { label: '201 a 500', value: '201-500' },
  { label: 'Mais de 500', value: '500+' },
]

const interesseOptions = [
  { label: 'Selecione...', value: '' },
  { label: 'Módulos', value: 'modulos' },
  { label: 'Planos', value: 'planos' },
  { label: 'Implantação', value: 'implantacao' },
  { label: 'Outros', value: 'outros' },
]

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  if (!phone) return true
  return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(phone.replace(/\s/g, ''))
}

const initialFormData: FormData = {
  nome: '',
  empresa: '',
  cargo: '',
  email: '',
  telefone: '',
  colaboradores: '',
  interesse: '',
  mensagem: '',
}

export default function DemoFormSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'privacy', string>>>({})
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData | 'privacy', string>> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.empresa.trim()) newErrors.empresa = 'Empresa é obrigatória'
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }
    if (formData.telefone && !validatePhone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido'
    }
    if (!privacyAccepted) {
      newErrors.privacy = 'Você precisa aceitar a política de privacidade'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || status === 'submitting') return

    setStatus('submitting')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
    <Section id="contato" variant="muted" data-testid="demo-form-section">
      <div className="mx-auto max-w-2xl text-center" data-testid="form-success">
        <Card className="p-12">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-sgs-success" />
          <Heading as="h2" align="center" className="mb-2">
            Solicitação enviada!
          </Heading>
            <Text size="md" className="text-center">
              Recebemos sua solicitação de demonstração. Nossa equipe entrará em
              contato em até 24 horas úteis.
            </Text>
          </Card>
        </div>
      </Section>
    )
  }

  return (
    <Section id="contato" variant="muted" data-testid="demo-form-section">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <Heading as="h2" align="center">
            Solicitar demonstração
          </Heading>
          <Text size="md" className="mt-4 text-center">
            Preencha o formulário abaixo e nossa equipe entrará em contato para
            agendar uma demonstração personalizada do SGS.
          </Text>
        </div>

        <Card>
          <form onSubmit={handleSubmit} noValidate className="space-y-5" data-testid="demo-form">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Nome"
                name="nome"
                required
                error={errors.nome}
                value={formData.nome}
                onChange={handleChange}
              />
              <FormField
                label="Empresa"
                name="empresa"
                required
                error={errors.empresa}
                value={formData.empresa}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
              />
              <FormField
                label="E-mail"
                name="email"
                type="email"
                required
                error={errors.email}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Telefone"
                name="telefone"
                type="tel"
                error={errors.telefone}
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-0000"
              />
              <FormField
                label="Quantidade de colaboradores"
                name="colaboradores"
                type="select"
                options={colaboradoresOptions}
                value={formData.colaboradores}
                onChange={handleChange}
              />
            </div>

            <FormField
              label="Interesse"
              name="interesse"
              type="select"
              options={interesseOptions}
              value={formData.interesse}
              onChange={handleChange}
            />

            <FormField
              label="Mensagem"
              name="mensagem"
              type="textarea"
              value={formData.mensagem}
              onChange={handleChange}
              rows={4}
              placeholder="Conte-nos um pouco sobre suas necessidades..."
            />

            <div className="space-y-1">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  data-testid="privacy-checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked)
                    if (e.target.checked && errors.privacy) {
                      setErrors((prev) => ({ ...prev, privacy: undefined }))
                    }
                  }}
                  className="mt-1 h-4 w-4 rounded border-sgs-border text-sgs-accent focus:ring-sgs-accent"
                />
                <span className="text-sm text-sgs-text-secondary">
                  Aceito a{' '}
                  <a
                    href="/privacidade"
                    className="text-sgs-accent underline hover:text-sgs-accent-dark"
                  >
                    política de privacidade
                  </a>{' '}
                  e concordo em receber comunicações do SGS.
                </span>
              </label>
              {errors.privacy && (
                <p role="alert" className="ml-7 text-sm text-sgs-danger">
                  {errors.privacy}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="form-submit"
              disabled={status === 'submitting'}
              className="w-full"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Solicitar demonstração'
              )}
            </Button>

            {status === 'error' && (
              <p role="alert" className="text-center text-sm text-sgs-danger">
                Ocorreu um erro ao enviar sua solicitação. Tente novamente.
              </p>
            )}
          </form>
        </Card>
      </div>
    </Section>
  )
}
