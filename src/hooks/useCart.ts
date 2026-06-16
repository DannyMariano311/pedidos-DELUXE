import { useCallback, useMemo, useState } from 'react'
import type { CartItem, Product } from '../types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1, comment: '' }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === productId)
      if (!existing) return prev
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.product.id !== productId)
      }
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      )
    })
  }, [])

  const deleteItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const setQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    )
  }, [])

  const setItemComment = useCallback((productId: number, comment: string) => {
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, comment } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  )

  const getQuantity = useCallback(
    (productId: number) => items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  )

  const getItemComment = useCallback(
    (productId: number) => items.find((i) => i.product.id === productId)?.comment ?? '',
    [items]
  )

  return {
    items,
    addItem,
    removeItem,
    deleteItem,
    setQuantity,
    setItemComment,
    clearCart,
    totalItems,
    subtotal,
    getQuantity,
    getItemComment,
  }
}
