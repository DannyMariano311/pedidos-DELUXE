import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCategoryIcon } from '../utils/categoryIcons'
import type { ProductCategory } from '../types'

interface CategoryTabsProps {
  categories: ProductCategory[]
  activeId: number
  onSelect: (id: number) => void
}

export function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      observer.disconnect()
    }
  }, [categories, updateScrollState])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const activeBtn = el.querySelector<HTMLElement>(`[data-category-id="${activeId}"]`)
    activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeId])

  function scrollBy(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.65
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-deluxe-black to-transparent" />
          <button
            type="button"
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-deluxe-charcoal/95 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-deluxe-smoke"
            aria-label="Ver categorías anteriores"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name)
          const isActive = activeId === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              data-category-id={cat.id}
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

      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-deluxe-black to-transparent" />
          <button
            type="button"
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-deluxe-charcoal/95 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-deluxe-smoke"
            aria-label="Ver más categorías"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
}
