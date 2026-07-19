import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

interface PageSEOProps {
  title: string
  description: string
  canonicalPath?: string
  noIndex?: boolean
}

function getCanonicalUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).href
}

export function PageSEO({
  title,
  description,
  canonicalPath = '/',
  noIndex = false,
}: PageSEOProps) {
  useEffect(() => {
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

    setMeta('description', description)
    setMeta('og:description', description, true)
    setMeta('twitter:description', description)

    setMeta('og:title', fullTitle, true)
    setMeta('og:type', 'website', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    const url = getCanonicalUrl(canonicalPath)
    setMeta('og:url', url, true)

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)
  }, [title, description, canonicalPath, noIndex])

  return null
}
