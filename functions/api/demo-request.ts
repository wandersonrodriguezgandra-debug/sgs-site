interface Env {
  RESEND_API_KEY?: string
  DEMO_TO_EMAIL?: string
  DEMO_FROM_EMAIL?: string
  TURNSTILE_SECRET_KEY?: string
}

interface PagesContext {
  request: Request
  env: Env
}

interface DemoRequest {
  nome: string
  empresa: string
  email: string
  telefone: string
  interesse: keyof typeof INTEREST_LABELS
  privacyAccepted: true
  requestId: string
  turnstileToken: string
  website: string
}

type TurnstileValidation = 'valid' | 'invalid' | 'unavailable'

const MAX_BODY_BYTES = 16_384
const RESEND_REQUEST_TIMEOUT_MS = 8_000
const TURNSTILE_REQUEST_TIMEOUT_MS = 4_000
const PRIVACY_POLICY_VERSION = '2026-07-18'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const JSON_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
}
const INTEREST_LABELS = {
  centralizar_sst: 'Centralizar rotinas e documentos de SST',
  riscos_acoes: 'Organizar riscos e planos de ação',
  treinamentos_exames: 'Acompanhar treinamentos e exames',
  visao_geral: 'Conhecer a plataforma de forma geral',
} as const

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isInterest(value: string): value is keyof typeof INTEREST_LABELS {
  return Object.hasOwn(INTEREST_LABELS, value)
}

function readTrimmedString(
  input: Record<string, unknown>,
  key: string,
  maximumLength: number,
  required: boolean,
): string | null {
  const value = input[key]

  if (typeof value !== 'string') return required ? null : ''

  const trimmedValue = value.trim()
  if ((required && trimmedValue.length === 0) || trimmedValue.length > maximumLength) return null

  return trimmedValue
}

function parseDemoRequest(value: unknown): DemoRequest | null {
  if (!isRecord(value) || value.privacyAccepted !== true) return null

  const nome = readTrimmedString(value, 'nome', 120, true)
  const empresa = readTrimmedString(value, 'empresa', 160, true)
  const email = readTrimmedString(value, 'email', 254, true)
  const telefone = readTrimmedString(value, 'telefone', 32, false)
  const interesse = readTrimmedString(value, 'interesse', 40, true)
  const requestId = readTrimmedString(value, 'requestId', 36, true)
  const turnstileToken = readTrimmedString(value, 'turnstileToken', 2_048, true)
  const website = readTrimmedString(value, 'website', 200, false)

  if (
    nome === null ||
    empresa === null ||
    email === null ||
    telefone === null ||
    interesse === null ||
    requestId === null ||
    turnstileToken === null ||
    website === null ||
    !EMAIL_PATTERN.test(email) ||
    !isInterest(interesse) ||
    !UUID_PATTERN.test(requestId)
  ) {
    return null
  }

  if (telefone) {
    const digits = telefone.replace(/\D/g, '')
    if (!/^[+\d\s().-]+$/.test(telefone) || digits.length < 10 || digits.length > 15) return null
  }

  return {
    nome,
    empresa,
    email,
    telefone,
    interesse,
    privacyAccepted: true,
    requestId,
    turnstileToken,
    website,
  }
}

async function readLimitedBody(request: Request): Promise<string | null> {
  const declaredLength = Number(request.headers.get('Content-Length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return null
  if (!request.body) return ''

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  const chunks: string[] = []
  let receivedBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      receivedBytes += value.byteLength
      if (receivedBytes > MAX_BODY_BYTES) {
        await reader.cancel()
        return null
      }

      chunks.push(decoder.decode(value, { stream: true }))
    }

    chunks.push(decoder.decode())
    return chunks.join('')
  } finally {
    reader.releaseLock()
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function formatOptionalValue(value: string): string {
  return value || 'Não informado'
}

function buildEmailContent(
  request: DemoRequest,
  consentedAt: string,
): { html: string; text: string } {
  const interestLabel = INTEREST_LABELS[request.interesse]

  return {
    text: [
      'Nova solicitação de demonstração do SGS',
      '',
      `Nome: ${request.nome}`,
      `Empresa: ${request.empresa}`,
      `E-mail: ${request.email}`,
      `Telefone: ${formatOptionalValue(request.telefone)}`,
      `Foco: ${interestLabel}`,
      '',
      `Consentimento registrado em: ${consentedAt}`,
      `Versão da política de privacidade: ${PRIVACY_POLICY_VERSION}`,
      'Finalidade autorizada: responder a esta solicitação de demonstração.',
    ].join('\n'),
    html: `
      <h1>Nova solicitação de demonstração do SGS</h1>
      <p><strong>Nome:</strong> ${escapeHtml(request.nome)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(request.empresa)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(request.email)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(formatOptionalValue(request.telefone))}</p>
      <p><strong>Foco:</strong> ${escapeHtml(interestLabel)}</p>
      <hr />
      <p><strong>Consentimento registrado em:</strong> ${escapeHtml(consentedAt)}</p>
      <p><strong>Versão da política de privacidade:</strong> ${PRIVACY_POLICY_VERSION}</p>
      <p><strong>Finalidade autorizada:</strong> responder a esta solicitação de demonstração.</p>
    `.trim(),
  }
}

function getRecipients(value: string | undefined): string[] | null {
  if (!value) return null

  const recipients = value
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean)

  if (
    recipients.length === 0 ||
    recipients.length > 10 ||
    recipients.some((recipient) => !EMAIL_PATTERN.test(recipient))
  ) {
    return null
  }

  return recipients
}

async function validateTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
  expectedHostname: string,
  allowTestingToken: boolean,
): Promise<TurnstileValidation> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        secret,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
        idempotency_key: crypto.randomUUID(),
      }),
    })

    if (!response.ok) return 'unavailable'

    const result: unknown = await response.json().catch(() => null)
    if (!isRecord(result)) return 'unavailable'
    if (result.success !== true) return 'invalid'

    const isOfficialTestingResponse =
      isRecord(result.metadata) && result.metadata.result_with_testing_key === true

    if (allowTestingToken && isOfficialTestingResponse) return 'valid'
    if (result.action !== 'demo_request' || result.hostname !== expectedHostname) return 'invalid'

    return 'valid'
  } catch {
    return 'unavailable'
  } finally {
    clearTimeout(timeout)
  }
}

export const onRequest = async ({ request, env }: PagesContext): Promise<Response> => {
  if (request.method !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Método não permitido.' }, { Allow: 'POST' })
  }

  const requestUrl = new URL(request.url)
  const origin = request.headers.get('Origin')
  if (!origin || origin !== requestUrl.origin) {
    return jsonResponse(403, { success: false, message: 'Origem não permitida.' })
  }

  const contentType = request.headers.get('Content-Type')?.split(';', 1)[0]?.trim().toLowerCase()
  if (contentType !== 'application/json') {
    return jsonResponse(400, { success: false, message: 'Conteúdo inválido.' })
  }

  const rawBody = await readLimitedBody(request)
  if (rawBody === null) {
    return jsonResponse(413, { success: false, message: 'Solicitação muito grande.' })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return jsonResponse(400, { success: false, message: 'Conteúdo inválido.' })
  }

  const demoRequest = parseDemoRequest(body)
  if (!demoRequest) {
    return jsonResponse(400, { success: false, message: 'Dados inválidos.' })
  }

  if (demoRequest.website) {
    return jsonResponse(400, { success: false, message: 'Dados inválidos.' })
  }

  const apiKey = env.RESEND_API_KEY?.trim()
  const from = env.DEMO_FROM_EMAIL?.trim()
  const to = getRecipients(env.DEMO_TO_EMAIL)
  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim()
  if (!apiKey || !from || !to || !turnstileSecret) {
    console.error('[demo-request] Configuração de envio ausente ou inválida')
    return jsonResponse(503, {
      success: false,
      message: 'Serviço de envio temporariamente indisponível.',
    })
  }

  const turnstileValidation = await validateTurnstile(
    demoRequest.turnstileToken,
    turnstileSecret,
    request.headers.get('CF-Connecting-IP'),
    requestUrl.hostname,
    requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1',
  )

  if (turnstileValidation === 'unavailable') {
    console.error('[demo-request] Serviço de verificação antiabuso indisponível')
    return jsonResponse(503, {
      success: false,
      message: 'Verificação de segurança temporariamente indisponível.',
    })
  }

  if (turnstileValidation === 'invalid') {
    return jsonResponse(403, {
      success: false,
      message: 'Verificação de segurança inválida ou expirada.',
    })
  }

  const content = buildEmailContent(demoRequest, new Date().toISOString())
  const resendController = new AbortController()
  const resendTimeout = setTimeout(() => resendController.abort(), RESEND_REQUEST_TIMEOUT_MS)

  let resendResponse: Response
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `demo-${demoRequest.requestId}`,
      },
      signal: resendController.signal,
      body: JSON.stringify({
        from,
        to,
        reply_to: demoRequest.email,
        subject: 'Nova solicitação de demonstração do SGS',
        html: content.html,
        text: content.text,
      }),
    })
  } catch {
    console.error('[demo-request] Falha de rede ao contatar o provedor de e-mail')
    return jsonResponse(502, {
      success: false,
      message: 'Não foi possível concluir o envio.',
    })
  } finally {
    clearTimeout(resendTimeout)
  }

  if (!resendResponse.ok) {
    console.error(`[demo-request] Provedor de e-mail respondeu com status ${resendResponse.status}`)
    return jsonResponse(502, {
      success: false,
      message: 'Não foi possível concluir o envio.',
    })
  }

  return jsonResponse(200, { success: true })
}
