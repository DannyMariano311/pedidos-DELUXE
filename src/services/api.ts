import type { MenuData, Product, ProductCategory } from '../types'
import { DELIVERY_CATEGORY_ID } from '../types'

interface ApiResponse {
  categorias: { productCategories: ProductCategory[] }
  productos: { products: Product[] }
}

interface RawMenuResponse {
  categories: ProductCategory[]
  products: Product[]
  deliveryZones: Product[]
}

const MENU_URL = import.meta.env.VITE_API_URL ?? '/api/menu'

function parseMenuResponse(data: ApiResponse): RawMenuResponse {
  if (!data.categorias?.productCategories || !data.productos?.products) {
    throw new Error('Formato de respuesta inválido')
  }

  const allProducts = data.productos.products.filter((p) => p.active)

  const categories = data.categorias.productCategories
    .filter((c) => c.enableOnlineMenu && c.id !== DELIVERY_CATEGORY_ID)
    .sort((a, b) => categoryOrder(a.name) - categoryOrder(b.name))

  const deliveryZones = allProducts.filter((p) => p.productCategoryId === DELIVERY_CATEGORY_ID)
  const products = allProducts.filter((p) => p.productCategoryId !== DELIVERY_CATEGORY_ID)

  return { categories, products, deliveryZones }
}

function categoryOrder(name: string): number {
  const order: Record<string, number> = {
    HAMBURGUESAS: 1,
    PREMIUM: 2,
    SALCHIPAPAS: 3,
    ENTRADAS: 4,
    OTROS: 5,
    ALMUERZOS: 6,
    BEBIDAS: 7,
    GASEOSAS: 8,
    ADICIONES: 9,
  }
  return order[name] ?? 99
}

async function fetchMenuPayload(): Promise<ApiResponse> {
  const response = await fetch(MENU_URL)

  if (!response.ok) {
    throw new Error(`Error al cargar el menú (${response.status})`)
  }

  return (await response.json()) as ApiResponse
}

export async function fetchMenuData(): Promise<RawMenuResponse> {
  const data = await fetchMenuPayload()
  return parseMenuResponse(data)
}

export async function fetchMenu(): Promise<MenuData> {
  const { categories, products } = await fetchMenuData()
  return { categories, products }
}

export async function fetchDeliveryZones(): Promise<Product[]> {
  const { deliveryZones } = await fetchMenuData()
  return deliveryZones
}
