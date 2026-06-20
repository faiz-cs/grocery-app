import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/store/ProductCard'
import { ChevronRight, Leaf, Clock, MessageCircle } from 'lucide-react'
import type { Banner, Category, Product } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: banners }, { data: categories }, { data: featuredProducts }] =
    await Promise.all([
      supabase.from('banners').select('*').eq('is_active', true).order('display_order'),
      supabase.from('categories').select('*').eq('is_active', true).order('display_order').limit(8),
      supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8),
    ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 space-y-9">
      {/* Hero Banner */}
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white">
        <div className="p-7 md:p-12 relative z-10 max-w-lg">
          <span className="inline-block badge bg-amber-400 text-emerald-950 mb-3 px-3 py-1">
            🌿 Fresh stock daily
          </span>
          <h1 className="text-[28px] md:text-4xl font-extrabold leading-tight tracking-tight mb-2">
            {banners?.[0]?.title || 'Groceries delivered to your door'}
          </h1>
          <p className="text-emerald-100/90 text-sm md:text-base font-medium">
            {banners?.[0]?.subtitle || 'Order in minutes — confirm instantly via WhatsApp'}
          </p>
          <Link href="/categories" className="mt-6 inline-flex items-center gap-2 bg-white text-emerald-800 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-emerald-50 active:scale-95 transition-all shadow-lg shadow-emerald-950/20">
            Start Shopping <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Decorative blobs */}
        <div className="absolute right-[-60px] top-[-60px] w-72 h-72 rounded-full bg-white/[0.06]" />
        <div className="absolute right-10 bottom-[-80px] w-56 h-56 rounded-full bg-amber-400/10" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[120px] opacity-[0.08] hidden md:block select-none">🛒</div>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Leaf, label: 'Fresh Daily', sub: 'Farm sourced', color: 'emerald' },
          { icon: Clock, label: 'Fast Delivery', sub: 'Same-day slots', color: 'amber' },
          { icon: MessageCircle, label: 'Easy Orders', sub: 'Via WhatsApp', color: 'sky' },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
              color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              color === 'amber' ? 'bg-amber-50 text-amber-600' :
              'bg-sky-50 text-sky-600'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-bold text-stone-800">{label}</p>
            <p className="text-[11px] text-stone-400 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Shop by Category</h2>
            <Link href="/categories" className="text-sm text-emerald-700 font-bold flex items-center gap-0.5 hover:underline">
              All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {(categories as Category[]).map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-3xl bg-white border border-stone-100 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center text-xl overflow-hidden">
                  {cat.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : '🛒'}
                </div>
                <span className="text-[11px] text-center text-stone-700 font-bold line-clamp-2 group-hover:text-emerald-700 leading-tight">
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
            <div>
              <h2 className="section-title">Best Sellers</h2>
              <p className="text-xs text-stone-400 font-medium mt-0.5">Loved by your neighbours</p>
            </div>
            <Link href="/categories" className="text-sm text-emerald-700 font-bold flex items-center gap-0.5 hover:underline">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {(featuredProducts as Product[]).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
