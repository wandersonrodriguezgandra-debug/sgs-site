import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholders/screenshot.svg',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(className)}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  )
}
