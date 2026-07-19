export interface MediaImage {
  src: string
  alt: string
  title?: string
  category: string
  temporary: boolean
  recommendedSize?: string
}

export interface NavigationLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface Module {
  icon: string
  name: string
  description: string
  category: string
  href: string
  badge?: string
}

export interface Step {
  number: number
  title: string
  description: string
  image?: string
}

export interface Plan {
  name: string
  description: string
  highlighted: boolean
  features: string[]
  cta: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface TeamMember {
  name: string
  role: string
  avatar: string
}

export interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  content: string
  avatar: string
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  logo: string
}
