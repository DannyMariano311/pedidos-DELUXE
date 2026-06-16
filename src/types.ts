export interface ProductCategory {
  id: number
  name: string
  productCategoryId: number | null
  enableOnlineMenu: boolean | null
  enableQrMenu: boolean | null
}

export interface Product {
  id: number
  name: string
  price: number
  description: string | null
  active: boolean
  productCategoryId: number
  image: string | null
  sellAlone: boolean
}

export interface MenuData {
  categories: ProductCategory[]
  products: Product[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface DeliveryInfo {
  zone: Product | null
  address: string
  reference: string
  comments: string
}

export const DELIVERY_CATEGORY_ID = 14
export const WHATSAPP_NUMBER = '573207146368'
