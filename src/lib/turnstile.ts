interface TurnstileRenderOptions {
  sitekey: string
  action: string
  appearance: 'interaction-only'
  language: string
  size: 'flexible'
  theme: 'light'
  'response-field': false
  callback: (token: string) => void
  'error-callback': () => void
  'expired-callback': () => void
  'timeout-callback': () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  remove: (widgetId: string) => void
  reset: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_ID = 'cloudflare-turnstile-script'
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
export const TURNSTILE_RESET_EVENT = 'sgs:turnstile-reset'

let scriptPromise: Promise<TurnstileApi> | null = null

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    const script = existingScript ?? document.createElement('script')

    const handleLoad = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('Turnstile API indisponível após o carregamento'))
    }

    const handleError = () => reject(new Error('Falha ao carregar o Turnstile'))

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })

    if (!existingScript) {
      script.id = SCRIPT_ID
      script.src = SCRIPT_URL
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }).catch((error: unknown) => {
    scriptPromise = null
    document.getElementById(SCRIPT_ID)?.remove()
    throw error
  })

  return scriptPromise
}

export function resetTurnstile(): void {
  window.dispatchEvent(new Event(TURNSTILE_RESET_EVENT))
  window.turnstile?.reset()
}
