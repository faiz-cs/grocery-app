import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/store/AddToCartButton'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight, MessageCircleHeart } from 'lucide-react'
import type { Product } from '@/types'

export const revalidate = 60

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', params.slug)
    .single()

  if (!product) notFound()

  const p = product as Product

  const discount =
    p.original_price && p.original_price > p.price
      ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
      : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 font-medium mb-6">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        {p.category && (
          <>
            <Link href={`/category/${p.category.slug}`} className="hover:text-emerald-700">{p.category.name}</Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-stone-700 font-semibold truncate">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square rounded-[28px] overflow-hidden bg-stone-50 border border-stone-100">
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-200 text-8xl">🛒</div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 badge bg-amber-500 text-white text-sm px-3 py-1.5 shadow-md">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            {p.category && (
              <Link href={`/category/${p.category.slug}`} className="text-xs text-emerald-700 font-bold uppercase tracking-wider hover:underline">
                {p.category.name}
              </Link>
            )}
            <h1 className="text-[26px] font-extrabold text-stone-900 mt-1.5 leading-tight tracking-tight">{p.name}</h1>
            <p className="text-sm text-stone-400 font-medium mt-1">per {p.unit}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-[32px] font-extrabold text-stone-900 tracking-tight">{formatCurrency(p.price)}</span>
            {p.original_price && (
              <span className="text-lg text-stone-400 line-through font-medium">{formatCurrency(p.original_price)}</span>
            )}
            {discount && (
              <span className="badge bg-emerald-50 text-emerald-700">Save {discount}%</span>
            )}
          </div>

          {p.description && (
            <p className="text-stone-500 text-sm leading-relaxed">{p.description}</p>
          )}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${p.is_available ? 'bg-emerald-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-bold ${p.is_available ? 'text-emerald-700' : 'text-red-600'}`}>
              {p.is_available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {p.is_available && <AddToCartButton product={p} />}

          <div className="card p-4 flex items-start gap-3 bg-gradient-to-br from-emerald-50 to-emerald-50/40 border-emerald-100">
            <MessageCircleHeart className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Add to cart and checkout — we&apos;ll send your order straight to WhatsApp for quick confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
