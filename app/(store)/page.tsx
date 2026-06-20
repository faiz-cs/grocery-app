import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import CategoryStrip from '@/components/store/CategoryStrip'
import { ChevronRight, Clock, ShieldCheck, Truck, Tag } from 'lucide-react'
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
      <CategoryStrip categories={(categories as Category[]) || []} />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">

        {/* Hero — clean cream/forest, Instacart style */}
        <div className="relative rounded-[28px] overflow-hidden bg-forest-50 border border-forest-100">
          <div className="relative z-10 px-7 py-10 md:px-12 md:py-14 max-w-xl">
            <span className="badge bg-carrot-100 text-carrot-700 mb-4">
              🥕 Fresh picks, every day
            </span>
            <h1 className="text-[28px] md:text-[40px] font-extrabold leading-[1.08] tracking-tight text-forest-900 mb-3">
              {banners?.[0]?.title || 'Groceries delivered to your door'}
            </h1>
            <p className="text-forest-600 text-[15px] md:text-base font-medium mb-7">
              {banners?.[0]?.subtitle || 'Order on WhatsApp and get it delivered fast — no app download needed'}
            </p>
            <Link href="/categories" className="btn-accent px-7">
              Start Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-[-30px] bottom-[-30px] text-[160px] opacity-[0.06] hidden md:block select-none leading-none">
            🥬
          </div>
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: 'Fast delivery', sub: 'Same-day slots' },
            { icon: Tag, label: 'Daily deals', sub: 'Save more' },
            { icon: Truck, label: 'Free delivery', sub: 'On all orders' },
            { icon: ShieldCheck, label: 'Quality assured', sub: 'Fresh stock' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="card flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                <Icon className="w-[18px] h-[18px] text-forest-700" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-forest-900 leading-tight">{label}</p>
                <p className="text-[11px] text-forest-400 font-medium">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Deals carousel */}
        {dealsProducts && dealsProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-carrot-500 flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-forest-900 tracking-tight">Today&apos;s Deals</h2>
              </div>
              <Link href="/categories" className="text-xs text-forest-600 font-bold flex items-center gap-0.5 hover:text-forest-900">
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

        {/* Shop by Category */}
        {categories && categories.length > 0 && (
          <section>
            <h2 className="text-xl font-extrabold text-forest-900 tracking-tight mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {(categories as Category[]).map(cat => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="card relative overflow-hidden p-4 flex flex-col justify-between h-28 group hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-sm font-extrabold text-forest-900 leading-tight relative z-10">{cat.name}</span>
                  <div className="self-end w-12 h-12 rounded-full bg-forest-50 flex items-center justify-center overflow-hidden">
                    {cat.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : <span className="text-xl">🛒</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-forest-900 tracking-tight">Best Sellers</h2>
                <p className="text-xs text-forest-400 font-semibold mt-0.5">Most ordered this week</p>
              </div>
              <Link href="/categories" className="text-xs text-forest-600 font-bold flex items-center gap-0.5 hover:text-forest-900">
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
