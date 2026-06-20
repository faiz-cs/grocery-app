import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Grid3x3 } from 'lucide-react'
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
      <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-1">All Categories</h1>
      <p className="text-sm text-stone-400 font-medium mb-6">Browse everything we offer</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(categories as Category[] || []).map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="card p-5 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 transition-all group"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 flex items-center justify-center overflow-hidden">
              {cat.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-3xl" />
              ) : (
                <Grid3x3 className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <span className="text-sm font-bold text-stone-800 text-center group-hover:text-emerald-700 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
