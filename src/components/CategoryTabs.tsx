import { getCategoryIcon } from '../utils/categoryIcons'
import type { ProductCategory } from '../types'

interface CategoryTabsProps {
  categories: ProductCategory[]
  activeId: number
  onSelect: (id: number) => void
}

export function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.name)
        const isActive = activeId === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-deluxe-black'
                : 'border border-white/15 text-deluxe-silver hover:border-white/30 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
