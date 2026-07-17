import { useCallback } from 'react'

const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23e2e8f0">' +
    '<rect width="400" height="300"/>' +
    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="16" font-family="sans-serif">Sem imagem</text>' +
    '</svg>'
  )

export function useImageError(placeholder: string = DEFAULT_PLACEHOLDER) {
  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = placeholder
    },
    [placeholder]
  )

  return handleError
}
