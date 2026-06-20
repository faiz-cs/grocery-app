import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Category } from '@/types'

export const revalidate = 60

export default async function CategoriesPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-forest-900 tracking-tight mb-1">All Categories</h1>
      <p className="text-sm text-forest-400 font-semibold mb-6">Browse our full range</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {(categories as Category[] || []).map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="card relative overflow-hidden p-5 flex flex-col items-center gap-3 group hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center overflow-hidden">
              {cat.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              ) : <span className="text-2xl">🛒</span>}
            </div>
            <span className="text-sm font-extrabold text-forest-900 text-center group-hover:text-carrot-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
