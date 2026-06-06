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
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-brand-600 to-brand-800 text-white relative">
          <div className="p-8 md:p-12 relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{banners[0].title}</h1>
            {banners[0].subtitle && (
              <p className="text-brand-100 text-sm md:text-base">{banners[0].subtitle}</p>
            )}
            <Link href="/categories" className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors">
              Shop Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute right-16 bottom-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/3" />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-brand-600 to-brand-800 text-white p-8 md:p-12 relative">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Fresh Groceries,<br />Delivered Fast</h1>
          <p className="text-brand-100 mb-6">Order in minutes via WhatsApp</p>
          <Link href="/categories" className="inline-flex items-center gap-2 bg-white text-brand-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors">
            Browse Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Leaf, label: 'Fresh Daily', sub: 'Farm to doorstep' },
          { icon: Clock, label: 'Fast Delivery', sub: 'Same day slots' },
          { icon: Zap, label: 'Easy Orders', sub: 'Via WhatsApp' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="card p-4 text-center">
            <Icon className="w-6 h-6 text-brand-600 mx-auto mb-1.5" />
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Shop by Category</h2>
            <Link href="/categories" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {(categories as Category[]).map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-xl">
                  {cat.image_url ? (
                    <Image src={cat.image_url} alt={cat.name} width={48} height={48} className="object-cover rounded-xl" />
                  ) : '🛒'}
                </div>
                <span className="text-xs text-center text-gray-700 font-medium line-clamp-2 group-hover:text-brand-700">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Featured Products</h2>
            <Link href="/categories" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(featuredProducts as Product[]).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
