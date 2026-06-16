import {
  Beef,
  Beer,
  Coffee,
  CupSoda,
  Drumstick,
  Flame,
  GlassWater,
  Hamburger,
  MapPin,
  Pizza,
  Salad,
  Sandwich,
  Sparkles,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

const categoryIconMap: Record<string, LucideIcon> = {
  HAMBURGUESAS: Hamburger,
  PREMIUM: Star,
  SALCHIPAPAS: Flame,
  ENTRADAS: Salad,
  OTROS: UtensilsCrossed,
  ALMUERZOS: Drumstick,
  BEBIDAS: GlassWater,
  GASEOSAS: CupSoda,
  ADICIONES: Sparkles,
  DOMICILIOS: MapPin,
}

const productIconHints: [RegExp, LucideIcon][] = [
  [/hamburg|clasica|especial|toxica|picosa|porky|mini|mixta|americana|callejera/i, Hamburger],
  [/salchi|mexicana|bipolar|quesuda|medusa|ovni|chicken/i, Flame],
  [/arepa|patacon|perro|perra|taco|sandwich|nugget|quesadilla|combo|compartido|cajita/i, Sandwich],
  [/empanada|nacho|dedito|entrada/i, Salad],
  [/jugo|limonada|milo|michelada|piña|frapu|café|guanábana|mango|mora|maracuya|fresa|cereza/i, Coffee],
  [/coca|postobon|cerveza|hit|soda|agua|gaseosa/i, CupSoda],
  [/cerveza|michelada/i, Beer],
  [/arroz|cazuela|pasta|almuerzo|frijol/i, Drumstick],
  [/queso|tocineta|guacamole|pollo|carne|papa|crema|postre|salchicha|butifarra|pico de gallo/i, Beef],
  [/premium|ovni|medusa/i, Star],
  [/pizza/i, Pizza],
]

export function getCategoryIcon(categoryName: string): LucideIcon {
  return categoryIconMap[categoryName.toUpperCase()] ?? UtensilsCrossed
}

export function getProductIcon(productName: string, categoryName?: string): LucideIcon {
  for (const [pattern, icon] of productIconHints) {
    if (pattern.test(productName)) return icon
  }
  if (categoryName) return getCategoryIcon(categoryName)
  return UtensilsCrossed
}
