import { useEffect, useState } from 'react'
import { AlertCircle, MapPin, MessageSquare, Send, X } from 'lucide-react'
import type { CartItem, DeliveryInfo, Product } from '../types'
import { formatPrice } from '../utils/format'
import { buildOrderMessage, getWhatsAppUrl } from '../utils/whatsapp'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  subtotal: number
  deliveryZones: Product[]
  onClearCart: () => void
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
  deliveryZones,
  onClearCart,
}: CheckoutModalProps) {
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    zone: null,
    address: '',
    reference: '',
    comments: '',
  })
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!isOpen) setTouched(false)
  }, [isOpen])

  if (!isOpen) return null

  const deliveryFee = delivery.zone?.price ?? 0
  const total = subtotal + deliveryFee
  const addressError = touched && !delivery.address.trim()
  const zoneError = touched && !delivery.zone

  const message = buildOrderMessage(items, delivery, subtotal, deliveryFee)
  const whatsappUrl = getWhatsAppUrl(message)
  const canSend = delivery.zone && delivery.address.trim() && items.length > 0

  function handleSend() {
    setTouched(true)
    if (!canSend) return
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    onClearCart()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-deluxe-charcoal shadow-2xl animate-slide-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-xl font-bold text-white">Tu pedido</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-deluxe-silver transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
              Productos
            </h3>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-deluxe-black/50 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{item.product.name}</p>
                    <p className="text-sm text-deluxe-silver">
                      {formatPrice(item.product.price)} c/u
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-white">x{item.quantity}</span>
                  <span className="shrink-0 font-bold text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
              <MapPin className="h-4 w-4" />
              Zona de domicilio *
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {deliveryZones.map((zone) => {
                const selected = delivery.zone?.id === zone.id
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setDelivery((d) => ({ ...d, zone }))}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      selected
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/15 text-deluxe-silver hover:border-white/30'
                    } ${zoneError ? 'border-red-400/60' : ''}`}
                  >
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm">{formatPrice(zone.price)}</p>
                  </button>
                )
              })}
            </div>
            {zoneError && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                Selecciona una zona de domicilio
              </p>
            )}
          </section>

          <section className="mb-4">
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
              Dirección *
            </label>
            <textarea
              value={delivery.address}
              onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))}
              placeholder="Calle, número, barrio, ciudad..."
              rows={2}
              className={`w-full resize-none rounded-xl border bg-deluxe-black/50 px-4 py-3 text-white placeholder:text-deluxe-silver/50 focus:border-white/40 focus:outline-none ${
                addressError ? 'border-red-400/60' : 'border-white/15'
              }`}
            />
            {addressError && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                La dirección es obligatoria
              </p>
            )}
          </section>

          <section className="mb-4">
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
              Punto de referencia
            </label>
            <input
              type="text"
              value={delivery.reference}
              onChange={(e) => setDelivery((d) => ({ ...d, reference: e.target.value }))}
              placeholder="Ej: Frente al parque, casa blanca..."
              className="w-full rounded-xl border border-white/15 bg-deluxe-black/50 px-4 py-3 text-white placeholder:text-deluxe-silver/50 focus:border-white/40 focus:outline-none"
            />
          </section>

          <section className="mb-6">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
              <MessageSquare className="h-4 w-4" />
              Comentarios adicionales
            </label>
            <textarea
              value={delivery.comments}
              onChange={(e) => setDelivery((d) => ({ ...d, comments: e.target.value }))}
              placeholder="Sin cebolla, extra salsa, alergias..."
              rows={2}
              className="w-full resize-none rounded-xl border border-white/15 bg-deluxe-black/50 px-4 py-3 text-white placeholder:text-deluxe-silver/50 focus:border-white/40 focus:outline-none"
            />
          </section>

          <section className="mb-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-deluxe-silver">
              Vista previa del mensaje
            </h3>
            <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-deluxe-black/80 p-4 text-sm leading-relaxed text-deluxe-pearl">
              {message}
            </pre>
          </section>
        </div>

        <div className="border-t border-white/10 bg-deluxe-black/60 px-5 py-4 safe-bottom">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-deluxe-silver">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-deluxe-silver">
              <span>Domicilio</span>
              <span>{delivery.zone ? formatPrice(deliveryFee) : '—'}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-lg font-bold text-white transition-all hover:bg-[#20bd5a] active:scale-[0.98]"
          >
            <Send className="h-5 w-5" />
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
