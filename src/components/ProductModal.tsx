import { Minus, Plus, X } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'
import { ProductImage } from './ProductImage'

interface ProductModalProps {
  product: Product | null
  categoryName: string
  quantity: number
  onClose: () => void
  onAdd: () => void
  onRemove: () => void
}

export function ProductModal({
  product,
  categoryName,
  quantity,
  onClose,
  onAdd,
  onRemove,
}: ProductModalProps) {
  if (!product) return null

  const inCart = quantity > 0

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-deluxe-charcoal shadow-2xl animate-slide-up sm:max-w-xl sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-[2/1]">
          <ProductImage
            image={product.image}
            name={product.name}
            categoryName={categoryName}
            className="h-full w-full"
          />
          {inCart && (
            <div className="absolute left-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-full bg-white px-2.5 text-sm font-bold text-deluxe-black">
              {quantity} en el pedido
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-deluxe-silver">
            {categoryName}
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
            {product.name}
          </h2>

          <p className="mt-4 text-2xl font-bold text-white">{formatPrice(product.price)}</p>

          {product.description ? (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
                Descripción
              </h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-deluxe-pearl">
                {product.description}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm italic text-deluxe-silver">
              Sin descripción adicional.
            </p>
          )}
        </div>

        <div className="border-t border-white/10 bg-deluxe-black/60 p-5 safe-bottom sm:p-6">
          {inCart ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-deluxe-silver">Cantidad en tu pedido</span>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-deluxe-charcoal px-2 py-1">
                <button
                  type="button"
                  onClick={onRemove}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                  aria-label={`Quitar ${product.name}`}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="min-w-[2rem] text-center text-lg font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={onAdd}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                  aria-label={`Agregar ${product.name}`}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-lg font-bold text-deluxe-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="h-5 w-5" />
              Agregar al pedido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
