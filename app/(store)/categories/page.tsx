import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Category } from '@/types'

export const revalidate = 60

const TINTS = ['bg-lime-50', 'bg-orange-50', 'bg-sky-50', 'bg-violet-50', 'bg-rose-50', 'bg-amber-50']

export default async function CategoriesPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight mb-1">All Categories</h1>
      <p className="text-sm text-ink-400 font-semibold mb-6">Browse our full range</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {(categories as Category[] || []).map((cat, idx) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`relative overflow-hidden rounded-3xl ${TINTS[idx % TINTS.length]} p-4 flex flex-col justify-between h-32 group hover:-translate-y-1 hover:shadow-lg transition-all`}
          >
            <span className="text-[15px] font-extrabold text-ink-800 leading-tight relative z-10">{cat.name}</span>
            <div className="self-end w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center overflow-hidden">
              {cat.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              ) : <span className="text-2xl">🛒</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
