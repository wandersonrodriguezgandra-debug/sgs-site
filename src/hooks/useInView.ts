import { useRef, useState, useEffect, useCallback } from 'react'

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0,
  triggerOnce = true,
  rootMargin = '0px',
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null!)
  const [isInView, setIsInView] = useState(false)

  const setRef = useCallback((node: T | null) => {
    ref.current = node!
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, triggerOnce, rootMargin])

  return [setRef, isInView] as const
}
