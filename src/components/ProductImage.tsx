import { useState } from 'react'
import { getProductIcon } from '../utils/categoryIcons'

interface ProductImageProps {
  image: string | null
  name: string
  categoryName: string
  className?: string
}

export function ProductImage({ image, name, categoryName, className = '' }: ProductImageProps) {
  const [imgError, setImgError] = useState(false)
  const Icon = getProductIcon(name, categoryName)
  const showImage = image && !imgError

  if (showImage) {
    return (
      <img
        src={image}
        alt={name}
        className={`object-cover ${className}`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-deluxe-smoke to-deluxe-charcoal ${className}`}
    >
      <Icon className="h-10 w-10 text-deluxe-silver/60" strokeWidth={1.5} />
    </div>
  )
}
