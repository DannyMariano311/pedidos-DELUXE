import type { KeyboardEvent, MouseEvent } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  categoryName: string
  quantity: number
  onOpen: () => void
  onAdd: () => void
  onRemove: () => void
}

export function ProductCard({
  product,
  categoryName,
  quantity,
  onOpen,
  onAdd,
  onRemove,
}: ProductCardProps) {
  const inCart = quantity > 0

  function stopPropagation(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation()
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
        inCart
          ? 'border-white/30 bg-deluxe-charcoal shadow-lg shadow-white/5'
          : 'border-white/10 bg-deluxe-charcoal/80 hover:border-white/20'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          image={product.image}
          name={product.name}
          categoryName={categoryName}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        {inCart && (
          <div className="absolute right-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-deluxe-black">
            {quantity}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-tight text-deluxe-white">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-deluxe-silver">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold text-deluxe-white">
            {formatPrice(product.price)}
          </span>

          {inCart ? (
            <div
              className="flex items-center gap-1 rounded-full border border-white/20 bg-deluxe-black"
              onClick={stopPropagation}
              onKeyDown={stopPropagation}
              role="presentation"
            >
              <button
                type="button"
                onClick={onRemove}
                className="flex h-9 w-9 items-center justify-center rounded-full text-deluxe-white transition-colors hover:bg-white/10"
                aria-label={`Quitar ${product.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={onAdd}
                className="flex h-9 w-9 items-center justify-center rounded-full text-deluxe-white transition-colors hover:bg-white/10"
                aria-label={`Agregar ${product.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                stopPropagation(e)
                onAdd()
              }}
              className="flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-deluxe-black transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
