import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

interface PageSEOProps {
  title: string
  description?: string
  canonicalUrl?: string
}

export function PageSEO({ title, description, canonicalUrl }: PageSEOProps) {
  useEffect(() => {
    const previousTitle = document.title
    const fullTitle = `${title} | ${siteConfig.name}`
    document.title = fullTitle

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`
      let meta = document.querySelector<HTMLMetaElement>(selector)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    if (description) {
      const desc = description
      setMeta('description', desc)
      setMeta('og:description', desc, true)
      setMeta('twitter:description', desc)
    }

    setMeta('og:title', fullTitle, true)
    setMeta('og:type', 'website', true)
    setMeta('twitter:card', 'summary_large_image')

    const url = canonicalUrl || siteConfig.url
    setMeta('og:url', url, true)

    if (canonicalUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonicalUrl)
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description, canonicalUrl])

  return null
}
