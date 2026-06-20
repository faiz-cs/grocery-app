import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import CategoryStrip from '@/components/store/CategoryStrip'
import { ChevronRight, Clock, ShieldCheck, Truck, Percent } from 'lucide-react'
import type { Category, Product } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: banners }, { data: categories }, { data: featuredProducts }, { data: dealsProducts }] =
    await Promise.all([
      supabase.from('banners').select('*').eq('is_active', true).order('display_order'),
      supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
      supabase.from('products').select('*, category:categories(*)').eq('is_available', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(12),
      supabase.from('products').select('*, category:categories(*)').eq('is_available', true).not('original_price', 'is', null).limit(8),
    ])

  return (
    <div>
      {/* Category strip — sticky-feel quick nav, Blinkit style */}
      <CategoryStrip categories={(categories as Category[]) || []} />

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-10">

        {/* Hero — dark premium banner */}
        <div className="relative rounded-[28px] overflow-hidden bg-ink-900">
          <div className="relative z-10 p-7 md:p-10 max-w-lg">
            <span className="badge bg-lime-400 text-ink-900 mb-3">
              {banners?.[0]?.title ? 'Today\'s Special' : 'Supermarket savings'}
            </span>
            <h1 className="text-[26px] md:text-[34px] font-extrabold leading-[1.1] tracking-tight text-white mb-2">
              {banners?.[0]?.title || 'Everything your home needs, delivered fast'}
            </h1>
            <p className="text-ink-300 text-sm md:text-[15px] font-medium mb-6">
              {banners?.[0]?.subtitle || 'Groceries, essentials & more — order on WhatsApp in seconds'}
            </p>
            <Link href="/categories" className="btn-accent px-6 py-3">
              Shop Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full bg-lime-400/[0.07]" />
          <div className="absolute right-8 bottom-[-60px] w-48 h-48 rounded-full bg-lime-400/[0.05]" />
        </div>

        {/* Trust strip — 4 compact tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: '15-min delivery', color: 'text-lime-600 bg-lime-50' },
            { icon: Percent, label: 'Daily deals', color: 'text-flame-500 bg-orange-50' },
            { icon: Truck, label: 'Free above ₹199', color: 'text-sky-600 bg-sky-50' },
            { icon: ShieldCheck, label: '100% quality', color: 'text-violet-600 bg-violet-50' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="card flex items-center gap-2.5 p-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs font-bold text-ink-700 leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Deals carousel — horizontal scroll */}
        {dealsProducts && dealsProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-flame-500 flex items-center justify-center">
                  <Percent className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-lg font-extrabold text-ink-900 tracking-tight">Deals For You</h2>
              </div>
              <Link href="/categories" className="text-xs text-ink-500 font-bold flex items-center gap-0.5 hover:text-ink-900">
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-3.5 overflow-x-auto scroll-row pb-2 -mx-4 px-4">
              {(dealsProducts as Product[]).map(product => (
                <div key={product.id} className="w-[150px] shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Shop by Aisle — category cards grid (BigBasket style) */}
        {categories && categories.length > 0 && (
          <section>
            <h2 className="text-lg font-extrabold text-ink-900 tracking-tight mb-4">Shop by Aisle</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {(categories as Category[]).map((cat, idx) => {
                const tints = ['bg-lime-50', 'bg-orange-50', 'bg-sky-50', 'bg-violet-50', 'bg-rose-50', 'bg-amber-50']
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`relative overflow-hidden rounded-3xl ${tints[idx % tints.length]} p-4 flex flex-col justify-between h-28 group hover:-translate-y-1 hover:shadow-lg transition-all`}
                  >
                    <span className="text-sm font-extrabold text-ink-800 leading-tight relative z-10">{cat.name}</span>
                    <div className="self-end w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center overflow-hidden">
                      {cat.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                      ) : <span className="text-xl">🛒</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Featured Products — dense grid */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-ink-900 tracking-tight">Best Sellers</h2>
                <p className="text-xs text-ink-400 font-semibold mt-0.5">Most ordered this week</p>
              </div>
              <Link href="/categories" className="text-xs text-ink-500 font-bold flex items-center gap-0.5 hover:text-ink-900">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {(featuredProducts as Product[]).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
