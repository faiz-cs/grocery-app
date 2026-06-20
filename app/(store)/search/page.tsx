import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import { Search } from 'lucide-react'
import type { Product } from '@/types'

export const revalidate = 0

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q?.trim() || ''
  const supabase = createClient()

  let products: Product[] = []
  if (query.length >= 2) {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .ilike('name', `%${query}%`)
      .order('is_featured', { ascending: false })
      .limit(40)
    products = (data as Product[]) || []
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <form className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Search products…"
            className="input pl-11 py-3"
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-3">Search</button>
      </form>

      {query.length >= 2 ? (
        products.length > 0 ? (
          <>
            <p className="text-sm text-forest-500 mb-4">{products.length} results for &quot;<strong>{query}</strong>&quot;</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-forest-400">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )
      ) : (
        <div className="text-center py-20 text-gray-300">
          <Search className="w-12 h-12 mx-auto mb-3" />
          <p className="text-forest-500">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  )
}
