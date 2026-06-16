import { Minus, Plus, Trash2 } from 'lucide-react'

interface QuantityControlsProps {
  quantity: number
  onAdd: () => void
  onRemove: () => void
  onDelete: () => void
  productName: string
  size?: 'sm' | 'md'
}

export function QuantityControls({
  quantity,
  onAdd,
  onRemove,
  onDelete,
  productName,
  size = 'sm',
}: QuantityControlsProps) {
  const btnSize = size === 'md' ? 'h-11 w-11' : 'h-9 w-9'
  const iconSize = size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  const qtyText = size === 'md' ? 'text-lg min-w-[2rem]' : 'text-sm min-w-[1.5rem]'

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1 rounded-full border border-white/20 bg-deluxe-black">
        <button
          type="button"
          onClick={onRemove}
          className={`flex ${btnSize} items-center justify-center rounded-full text-deluxe-white transition-colors hover:bg-white/10`}
          aria-label={`Reducir cantidad de ${productName}`}
        >
          <Minus className={iconSize} />
        </button>
        <span className={`${qtyText} text-center font-semibold`}>{quantity}</span>
        <button
          type="button"
          onClick={onAdd}
          className={`flex ${btnSize} items-center justify-center rounded-full text-deluxe-white transition-colors hover:bg-white/10`}
          aria-label={`Aumentar cantidad de ${productName}`}
        >
          <Plus className={iconSize} />
        </button>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className={`flex ${btnSize} items-center justify-center rounded-full border border-red-400/30 text-red-400 transition-colors hover:bg-red-400/10`}
        aria-label={`Eliminar ${productName} del pedido`}
        title="Eliminar del pedido"
      >
        <Trash2 className={iconSize} />
      </button>
    </div>
  )
}
