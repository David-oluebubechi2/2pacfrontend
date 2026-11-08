import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-sand text-gold ${className}`}
        aria-label={alt}
      >
        <span className="font-display text-4xl tracking-widest select-none">2PC</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}
