import type { FAQItem } from '@/types'

interface SoftwareAppJsonLdProps {
  name: string
  description: string
  url: string
}

export function SoftwareAppJsonLd({ name, description, url }: SoftwareAppJsonLdProps) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

interface OrganizationJsonLdProps {
  name: string
  url: string
  logo?: string
}

export function OrganizationJsonLd({ name, url, logo }: OrganizationJsonLdProps) {
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
  }

  if (logo) {
    json.logo = logo
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

interface FaqJsonLdProps {
  items: FAQItem[]
}

export function FaqJsonLd({ items }: FaqJsonLdProps) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
