import { useEffect, useMemo, useState } from 'react'
import { Loader2, RefreshCw, UtensilsCrossed } from 'lucide-react'
import { CartBar } from './components/CartBar'
import { CategoryTabs } from './components/CategoryTabs'
import { CheckoutModal } from './components/CheckoutModal'
import { ProductCard } from './components/ProductCard'
import { useCart } from './hooks/useCart'
import { fetchMenuData } from './services/api'
import type { MenuData, Product, ProductCategory } from './types'
import { getCategoryIcon } from './utils/categoryIcons'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-deluxe-black text-deluxe-silver">
      <Loader2 className="h-10 w-10 animate-spin text-white" />
      <p className="text-sm">Cargando menú...</p>
    </div>
  )
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-deluxe-black px-6 text-center">
      <p className="text-deluxe-silver">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-deluxe-black"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  )
}

export default function App() {
  const [menu, setMenu] = useState<MenuData | null>(null)
  const [deliveryZones, setDeliveryZones] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const cart = useCart()

  async function loadMenu() {
    setLoading(true)
    setError(null)
    try {
      const { categories, products, deliveryZones: zones } = await fetchMenuData()
      setMenu({ categories, products })
      setDeliveryZones(zones)
      setActiveCategoryId((prev) => {
        if (prev !== null && categories.some((c) => c.id === prev)) return prev
        return categories[0]?.id ?? null
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
  }, [])

  const activeCategory = useMemo((): ProductCategory | null => {
    if (!menu || activeCategoryId === null) return null
    return menu.categories.find((c) => c.id === activeCategoryId) ?? null
  }, [menu, activeCategoryId])

  const categoryProducts = useMemo(() => {
    if (!menu || activeCategoryId === null) return []
    return menu.products.filter((p) => p.productCategoryId === activeCategoryId)
  }, [menu, activeCategoryId])

  if (loading) return <LoadingScreen />
  if (error || !menu || activeCategoryId === null || !activeCategory) {
    return <ErrorScreen message={error ?? 'Sin datos'} onRetry={loadMenu} />
  }

  const CategoryIcon = getCategoryIcon(activeCategory.name)

  return (
    <div className="min-h-screen bg-deluxe-black text-deluxe-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-deluxe-black/90 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-deluxe-charcoal">
              <UtensilsCrossed className="h-5 w-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                DELUXE <span className="text-deluxe-silver">BURGER</span>
              </h1>
              <p className="text-sm text-deluxe-silver">Arma tu pedido y envíalo a cocina</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl border-t border-white/5 px-4 py-3">
          <CategoryTabs
            categories={menu.categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-6">
        <div className="mb-5 flex items-center gap-3 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-deluxe-charcoal">
            <CategoryIcon className="h-5 w-5 text-deluxe-silver" strokeWidth={1.75} />
          </div>
          <h2 className="font-display text-2xl font-semibold">{activeCategory.name}</h2>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={activeCategory.name}
                quantity={cart.getQuantity(product.id)}
                onAdd={() => cart.addItem(product)}
                onRemove={() => cart.removeItem(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-deluxe-silver">
            No hay productos en esta categoría.
          </p>
        )}
      </main>

      <CartBar
        itemCount={cart.totalItems}
        subtotal={cart.subtotal}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        deliveryZones={deliveryZones}
        onClearCart={cart.clearCart}
      />
    </div>
  )
}
