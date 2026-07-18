'use client'

import { useState, type FormEvent } from 'react'
import { m } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import FormField from '@/components/ui/FormField'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'

interface FormData {
  nome: string
  empresa: string
  email: string
  telefone: string
  mensagem: string
}

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
  email: '',
  telefone: '',
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
        <m.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <Card className="sgs-form-success p-12">
          <m.div initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 14 }}>
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-sgs-success" />
          </m.div>
          <Heading as="h2" align="center" className="mb-2">
            Solicitação enviada!
          </Heading>
            <Text size="md" className="text-center">
              Recebemos sua solicitação. Nossa equipe usará os dados informados
              para combinar os próximos passos com você.
            </Text>
          </Card>
        </m.div>
        </div>
      </Section>
    )
  }

  return (
    <Section id="contato" variant="muted" className="relative overflow-hidden !py-24 md:!py-32" data-testid="demo-form-section">
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
            Conte o essencial. A demonstração será direcionada ao seu cenário,
            sem apresentação genérica e sem compromisso.
          </Text>
        </div>
        </Reveal>

        <Reveal delay={0.12}>
        <ParallaxLayer speed={8}>
        <Card className="sgs-form-card">
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
                label="E-mail"
                name="email"
                type="email"
                required
                error={errors.email}
                value={formData.email}
                onChange={handleChange}
              />
              <FormField
                label="Telefone"
                name="telefone"
                type="tel"
                error={errors.telefone}
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>

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
        </ParallaxLayer>
        </Reveal>
      </div>
    </Section>
  )
}
