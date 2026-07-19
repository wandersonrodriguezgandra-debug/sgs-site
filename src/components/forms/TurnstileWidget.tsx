import { useEffect, useRef, useState } from 'react'
import { loadTurnstile, TURNSTILE_RESET_EVENT } from '@/lib/turnstile'

type WidgetStatus = 'idle' | 'loading' | 'ready' | 'verified' | 'error'

interface TurnstileWidgetProps {
  siteKey: string
}

export default function TurnstileWidget({ siteKey }: TurnstileWidgetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<WidgetStatus>('idle')

  useEffect(() => {
    if (!siteKey || !wrapperRef.current) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [siteKey])

  useEffect(() => {
    const clearToken = () => {
      setToken('')
      setStatus('ready')
    }
    window.addEventListener(TURNSTILE_RESET_EVENT, clearToken)
    return () => window.removeEventListener(TURNSTILE_RESET_EVENT, clearToken)
  }, [])

  useEffect(() => {
    if (!siteKey || !shouldLoad || !widgetContainerRef.current) return

    let active = true
    let widgetId: string | null = null
    setStatus('loading')

    void loadTurnstile()
      .then((turnstile) => {
        if (!active || !widgetContainerRef.current) return

        setStatus('ready')
        widgetId = turnstile.render(widgetContainerRef.current, {
          sitekey: siteKey,
          action: 'demo_request',
          appearance: 'interaction-only',
          language: 'pt-BR',
          size: 'flexible',
          theme: 'light',
          'response-field': false,
          callback: (nextToken) => {
            setToken(nextToken)
            setStatus('verified')
          },
          'error-callback': () => {
            setToken('')
            setStatus('error')
          },
          'expired-callback': () => {
            setToken('')
            setStatus('ready')
          },
          'timeout-callback': () => {
            setToken('')
            setStatus('ready')
          },
        })
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [shouldLoad, siteKey])

  return (
    <div ref={wrapperRef} className="space-y-2" data-testid="turnstile-widget">
      <p className="text-sm font-medium text-sgs-text-primary">Verificação de segurança</p>

      {!siteKey ? (
        <p role="alert" className="text-sm text-sgs-danger">
          A verificação de segurança está indisponível no momento.
        </p>
      ) : (
        <>
          <div ref={widgetContainerRef} className="min-h-1 w-full" />
          <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className={
              status === 'error' ? 'text-xs text-sgs-danger' : 'text-xs text-sgs-text-tertiary'
            }
          >
            {status === 'verified'
              ? 'Verificação concluída.'
              : status === 'error'
                ? 'Não foi possível concluir a verificação. Tente novamente.'
                : 'Proteção automática contra envios abusivos.'}
          </p>
        </>
      )}
    </div>
  )
}
