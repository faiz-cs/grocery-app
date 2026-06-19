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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(categories as Category[] || []).map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="card p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-brand-200 border border-transparent transition-all group"
          >
            <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center overflow-hidden">
              {cat.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <Grid3x3 className="w-8 h-8 text-brand-400" />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-brand-700 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
