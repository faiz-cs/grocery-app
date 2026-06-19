import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/store/ProductCard'
import { ChevronRight, Zap, Leaf, Clock } from 'lucide-react'
import type { Banner, Category, Product } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: banners }, { data: categories }, { data: featuredProducts }] =
    await Promise.all([
      supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .limit(8),
      supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8),
    ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Hero Banner */}
      {banners && banners.length > 0 ? (
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 text-white relative shadow-2xl">
          <div className="p-8 md:p-14 relative z-10">
            <h1 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-lg">{banners[0].title}</h1>
            {banners[0].subtitle && (
              <p className="text-white/90 text-sm md:text-lg font-medium drop-shadow-md mb-8">{banners[0].subtitle}</p>
            )}
            <Link href="/categories" className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg">
              Shop Now <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute right-20 bottom-0 w-56 h-56 rounded-full bg-orange-400/10 translate-y-1/3" />
        </div>
      ) : (
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 text-white p-8 md:p-14 relative shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-lg">Fresh Groceries,<br />Delivered Fast</h1>
          <p className="text-white/90 font-medium mb-8 drop-shadow-md">Order in minutes via WhatsApp</p>
          <Link href="/categories" className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg">
            Browse Products <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Leaf, label: 'Fresh Daily', sub: 'Farm to doorstep' },
          { icon: Clock, label: 'Fast Delivery', sub: 'Same day slots' },
          { icon: Zap, label: 'Easy Orders', sub: 'Via WhatsApp' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="card p-5 text-center border-2 border-purple-100 hover:shadow-xl transition-all transform hover:scale-105">
            <Icon className="w-7 h-7 text-purple-600 mx-auto mb-2 drop-shadow-sm" />
            <p className="text-sm font-bold text-gray-900">{label}</p>
            <p className="text-xs text-gray-600 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <Link href="/categories" className="text-sm text-purple-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {(categories as Category[]).map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all group transform hover:scale-110"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-200 to-cyan-200 flex items-center justify-center text-2xl overflow-hidden shadow-md">
                  {cat.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  ) : '🛒'}
                </div>
                <span className="text-xs text-center text-gray-800 font-bold line-clamp-2 group-hover:text-purple-700">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">✨ Featured Products</h2>
            <Link href="/categories" className="text-sm text-purple-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(featuredProducts as Product[]).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}