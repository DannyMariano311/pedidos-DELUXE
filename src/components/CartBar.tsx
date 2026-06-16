import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '../utils/format'

interface CartBarProps {
  itemCount: number
  subtotal: number
  onOpenCheckout: () => void
}

export function CartBar({ itemCount, subtotal, onOpenCheckout }: CartBarProps) {
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-deluxe-black/95 p-4 backdrop-blur-lg safe-bottom">
      <button
        type="button"
        onClick={onOpenCheckout}
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-deluxe-black shadow-xl transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-deluxe-black text-xs font-bold text-white">
              {itemCount}
            </span>
          </div>
          <span className="font-semibold">Ver pedido</span>
        </div>
        <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
      </button>
    </div>
  )
}
