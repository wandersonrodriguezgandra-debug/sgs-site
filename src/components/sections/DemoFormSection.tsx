'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import TurnstileWidget from '@/components/forms/TurnstileWidget'
import { resetTurnstile } from '@/lib/turnstile'
import { DEMO_INTEREST_LABELS, isDemoInterest } from '@/config/privacy'
import FormField from '@/components/ui/FormField'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'

interface DemoFormValues {
  nome: string
  empresa: string
  email: string
  telefone: string
  interesse: string
}

interface DemoRequestPayload extends DemoFormValues {
  privacyAccepted: true
  requestId: string
  turnstileToken: string
  website: string
}

type FormErrorKey = keyof DemoFormValues | 'privacy'
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const FORM_REQUEST_TIMEOUT_MS = 15_000
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''

const interestOptions = [
  { label: 'Selecione o foco principal', value: '' },
  ...Object.entries(DEMO_INTEREST_LABELS).map(([value, label]) => ({ label, value })),
]

function createInitialFormData(): DemoFormValues {
  const requestedInterest = new URLSearchParams(window.location.search).get('interesse') ?? ''

  return {
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    interesse: isDemoInterest(requestedInterest) ? requestedInterest : '',
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  if (!phone) return true

  const digits = phone.replace(/\D/g, '')
  return /^[+\d\s().-]+$/.test(phone) && digits.length >= 10 && digits.length <= 15
}

function isFormFieldName(name: string): name is keyof DemoFormValues {
  return (
    name === 'nome' ||
    name === 'empresa' ||
    name === 'email' ||
    name === 'telefone' ||
    name === 'interesse'
  )
}

function isSuccessfulResponse(value: unknown): value is { success: true } {
  return typeof value === 'object' && value !== null && 'success' in value && value.success === true
}

function getSubmissionErrorMessage(status: number): string {
  if (status === 400) {
    return 'Não foi possível validar os dados. Revise os campos e a verificação de segurança.'
  }

  if (status === 403) {
    return 'A verificação de segurança expirou ou não pôde ser confirmada. Tente novamente.'
  }

  if (status === 503) {
    return 'O envio está temporariamente indisponível. Tente novamente em alguns minutos.'
  }

  return 'Não foi possível enviar sua solicitação agora. Tente novamente.'
}

export default function DemoFormSection() {
  const [formData, setFormData] = useState<DemoFormValues>(createInitialFormData)
  const [errors, setErrors] = useState<Partial<Record<FormErrorKey, string>>>({})
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const requestIdRef = useRef(crypto.randomUUID())
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'success') return
    successRef.current?.focus()
  }, [status])

  const markFormEdited = () => {
    setSubmissionError(null)
    if (status === 'error') {
      requestIdRef.current = crypto.randomUUID()
      setStatus('idle')
    }
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    if (!isFormFieldName(name)) return

    setFormData((previous) => ({ ...previous, [name]: value }))
    markFormEdited()

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<FormErrorKey, string>> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    else if (formData.nome.trim().length > 120) newErrors.nome = 'Use no máximo 120 caracteres'

    if (!formData.empresa.trim()) newErrors.empresa = 'Empresa é obrigatória'
    else if (formData.empresa.trim().length > 160) newErrors.empresa = 'Use no máximo 160 caracteres'

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!validateEmail(formData.email.trim()) || formData.email.trim().length > 254) {
      newErrors.email = 'E-mail inválido'
    }

    if (!validatePhone(formData.telefone.trim())) {
      newErrors.telefone = 'Telefone inválido'
    }

    if (!formData.interesse) {
      newErrors.interesse = 'Selecione o foco principal da demonstração'
    }

    if (!privacyAccepted) {
      newErrors.privacy = 'Você precisa autorizar o uso dos dados para esta solicitação'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionError(null)

    if (status === 'submitting') return
    if (!validate()) return

    const browserFormData = new FormData(event.currentTarget)
    const turnstileToken = browserFormData.get('cf-turnstile-response')
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      setStatus('error')
      setSubmissionError('Conclua a verificação de segurança antes de enviar.')
      return
    }

    setStatus('submitting')

    const payload: DemoRequestPayload = {
      nome: formData.nome.trim(),
      empresa: formData.empresa.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      interesse: formData.interesse,
      privacyAccepted: true,
      requestId: requestIdRef.current,
      turnstileToken,
      website,
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), FORM_REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      const responseBody: unknown = await response.json().catch(() => null)

      if (!response.ok || !isSuccessfulResponse(responseBody)) {
        resetTurnstile()
        setStatus('error')
        setSubmissionError(getSubmissionErrorMessage(response.status))
        return
      }

      setStatus('success')
    } catch (error: unknown) {
      resetTurnstile()
      setStatus('error')
      setSubmissionError(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'O envio demorou mais que o esperado. Verifique sua conexão e tente novamente.'
          : 'Não foi possível conectar ao serviço de envio. Tente novamente.',
      )
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  if (status === 'success') {
    return (
      <Section id="contato" variant="muted" data-testid="demo-form-section">
        <div
          ref={successRef}
          className="mx-auto max-w-2xl text-center focus:outline-none"
          data-testid="form-success"
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          <Card className="sgs-form-success p-12">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-sgs-success" aria-hidden="true" />
            <Heading as="h2" align="center" className="mb-2">
              Solicitação enviada
            </Heading>
            <Text size="md" className="text-center">
              Recebemos sua solicitação. Nossa equipe usará os dados informados apenas para
              combinar os próximos passos com você.
            </Text>
          </Card>
        </div>
      </Section>
    )
  }

  return (
    <Section
      id="contato"
      variant="muted"
      className="relative overflow-hidden !py-24 md:!py-32"
      data-testid="demo-form-section"
    >
      <div className="sgs-light-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <div className="mb-10 text-center">
            <div className="mb-5 inline-flex rounded-full border border-sgs-blue-100 bg-white px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sgs-accent shadow-sm">
              Próximo passo
            </div>
            <Heading as="h2" align="center" className="!text-3xl !leading-[1.08] md:!text-5xl">
              Veja o SGS aplicado à sua operação
            </Heading>
            <Text size="md" className="mt-4 text-center">
              Conte o essencial. A demonstração será direcionada ao seu cenário, sem apresentação
              genérica e sem compromisso.
            </Text>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <ParallaxLayer speed={8}>
            <Card className="sgs-form-card">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
                data-testid="demo-form"
              >
                <div hidden>
                  <label htmlFor="field-website">Não preencha este campo</label>
                  <input
                    id="field-website"
                    name="website"
                    type="text"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Nome"
                    name="nome"
                    required
                    maxLength={120}
                    autoComplete="name"
                    error={errors.nome}
                    value={formData.nome}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Empresa"
                    name="empresa"
                    required
                    maxLength={160}
                    autoComplete="organization"
                    error={errors.empresa}
                    value={formData.empresa}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="E-mail"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    error={errors.email}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Telefone"
                    name="telefone"
                    type="tel"
                    maxLength={32}
                    autoComplete="tel"
                    error={errors.telefone}
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <FormField
                  label="Foco principal da demonstração"
                  name="interesse"
                  type="select"
                  required
                  error={errors.interesse}
                  value={formData.interesse}
                  onChange={handleChange}
                  options={interestOptions}
                />

                <div className="space-y-1">
                  <div className="flex items-start gap-3">
                    <input
                      id="privacy-consent"
                      type="checkbox"
                      data-testid="privacy-checkbox"
                      checked={privacyAccepted}
                      aria-invalid={Boolean(errors.privacy)}
                      aria-describedby={errors.privacy ? 'privacy-error' : undefined}
                      onChange={(event) => {
                        setPrivacyAccepted(event.target.checked)
                        markFormEdited()
                        if (event.target.checked && errors.privacy) {
                          setErrors((previous) => ({ ...previous, privacy: undefined }))
                        }
                      }}
                      className="h-6 w-6 shrink-0 rounded border-sgs-border text-sgs-accent focus:ring-sgs-accent"
                    />
                    <p className="text-sm text-sgs-text-secondary">
                      <label htmlFor="privacy-consent" className="cursor-pointer">
                        Autorizo o uso destes dados para responder à minha solicitação.
                      </label>{' '}
                      Consulte a{' '}
                      <a
                        href="/privacidade"
                        className="text-sgs-accent underline hover:text-sgs-accent-dark"
                      >
                        política de privacidade
                      </a>
                      .
                    </p>
                  </div>
                  {errors.privacy && (
                    <p id="privacy-error" role="alert" className="ml-8 text-sm text-sgs-danger">
                      {errors.privacy}
                    </p>
                  )}
                </div>

                <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} />

                <Button
                  type="submit"
                  data-testid="form-submit"
                  loading={status === 'submitting'}
                  className="w-full"
                >
                  {status === 'submitting' ? 'Enviando...' : 'Solicitar demonstração'}
                </Button>

                {status === 'error' && submissionError && (
                  <p
                    role="alert"
                    data-testid="form-error"
                    className="text-center text-sm text-sgs-danger"
                  >
                    {submissionError}
                  </p>
                )}
              </form>
            </Card>
          </ParallaxLayer>
        </Reveal>
      </div>
    </Section>
  )
}
