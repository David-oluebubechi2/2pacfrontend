import { useState } from 'react'

type Props = {
  src: string
  fallback: string
  alt: string
  className?: string
}

export function FallbackImage({ src, fallback, alt, className = '' }: Props) {
  const [current, setCurrent] = useState(src)

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onError={() => setCurrent(fallback)}
      className={`object-cover ${className}`}
    />
  )
}
