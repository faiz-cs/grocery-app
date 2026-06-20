import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/store/ProductCard'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Category, Product } from '@/types'

export const revalidate = 60

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', (category as Category).id)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 font-medium mb-3">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/categories" className="hover:text-emerald-700">Categories</Link>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">{(category as Category).name}</h1>
        <p className="text-sm text-stone-400 font-medium mt-0.5">{products?.length || 0} products available</p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {(products as Product[]).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-bold text-stone-500">No products yet</p>
          <p className="text-sm text-stone-400 mt-1">Check back soon!</p>
        </div>
      )}
    </div>
  )
}
