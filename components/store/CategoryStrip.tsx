'use client'

import Link from 'next/link'
import type { Category } from '@/types'

export default function CategoryStrip({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null

  return (
    <div className="bg-white border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-5 overflow-x-auto scroll-row py-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-ink-50 group-hover:bg-lime-50 flex items-center justify-center overflow-hidden transition-colors">
                {cat.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">🛒</span>
                )}
              </div>
              <span className="text-[10.5px] font-bold text-ink-600 group-hover:text-ink-900 whitespace-nowrap leading-none">
                {cat.name.length > 12 ? cat.name.slice(0, 11) + '…' : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
