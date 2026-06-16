import type { CartItem, DeliveryInfo } from '../types'
import { WHATSAPP_NUMBER } from '../types'
import { WA } from './emojis'
import { formatPrice } from './format'

export function buildOrderMessage(
  items: CartItem[],
  delivery: DeliveryInfo,
  subtotal: number,
  deliveryFee: number
): string {
  const lines: string[] = [
    `${WA.burger} *PEDIDO DELUXE BURGER*`,
    '',
    `${WA.clipboard} *Productos:*`,
  ]

  for (const item of items) {
    const lineTotal = item.product.price * item.quantity
    lines.push(`• ${item.quantity}x ${item.product.name} — ${formatPrice(lineTotal)}`)
    if (item.comment.trim()) {
      lines.push(`   ↳ ${item.comment.trim()}`)
    }
  }

  lines.push('')
  lines.push(`${WA.money} *Subtotal:* ${formatPrice(subtotal)}`)
  lines.push('')

  if (delivery.zone) {
    lines.push(`${WA.truck} *Domicilio:*`)
    lines.push(`Zona: ${delivery.zone.name} — ${formatPrice(deliveryFee)}`)
    lines.push(`${WA.pin} Dirección: ${delivery.address}`)
    if (delivery.reference.trim()) {
      lines.push(`${WA.pushpin} Referencia: ${delivery.reference}`)
    }
    lines.push(`${WA.truck} *Costo domicilio:* ${formatPrice(deliveryFee)}`)
    lines.push(`${WA.money} *TOTAL:* ${formatPrice(subtotal + deliveryFee)}`)
  }

  if (delivery.comments.trim()) {
    lines.push('')
    lines.push(`${WA.speech} *Comentarios del pedido:* ${delivery.comments}`)
  }

  return lines.join('\n')
}

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`
}
