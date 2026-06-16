import type { MenuData, Product, ProductCategory } from '../types'
import { DELIVERY_CATEGORY_ID } from '../types'

const API_URL = 'https://hook.us2.make.com/mou1z52pn4lq8pqwjtslfdaf6b3dpvta'
const API_KEY = 'DELUXEburger'

interface RawMenuResponse {
  categories: ProductCategory[]
  products: Product[]
  deliveryZones: Product[]
}

function parseMenuResponse(text: string): RawMenuResponse {
  const categoriesMatch = text.match(/Categorias:\s*(\{[\s\S]*?\})\s*Productos:/i)
  const productsMatch = text.match(/Productos:\s*(\{[\s\S]*\})/i)

  if (!categoriesMatch || !productsMatch) {
    throw new Error('Formato de respuesta inválido')
  }

  const categoriesData = JSON.parse(categoriesMatch[1]) as { productCategories: ProductCategory[] }
  const productsData = JSON.parse(productsMatch[1]) as { products: Product[] }

  const allProducts = productsData.products.filter((p) => p.active)

  const categories = categoriesData.productCategories
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

async function fetchRaw(): Promise<string> {
  const response = await fetch(API_URL, {
    headers: { 'x-make-apikey': API_KEY },
  })

  if (!response.ok) {
    throw new Error(`Error al cargar el menú (${response.status})`)
  }

  return response.text()
}

export async function fetchMenuData(): Promise<RawMenuResponse> {
  const text = await fetchRaw()
  return parseMenuResponse(text)
}

export async function fetchMenu(): Promise<MenuData> {
  const { categories, products } = await fetchMenuData()
  return { categories, products }
}

export async function fetchDeliveryZones(): Promise<Product[]> {
  const { deliveryZones } = await fetchMenuData()
  return deliveryZones
}
