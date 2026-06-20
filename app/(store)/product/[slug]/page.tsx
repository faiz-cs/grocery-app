import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/store/AddToCartButton'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight, Clock, ShieldCheck } from 'lucide-react'
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
      <nav className="flex items-center gap-1.5 text-xs text-ink-400 font-semibold mb-6">
        <Link href="/" className="hover:text-ink-900">Home</Link>
        <ChevronRight className="w-3 h-3" />
        {p.category && (
          <>
            <Link href={`/category/${p.category.slug}`} className="hover:text-ink-900">{p.category.name}</Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-ink-700 font-bold truncate">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square rounded-[28px] overflow-hidden bg-ink-50 border border-ink-100">
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-ink-200 text-8xl">🛒</div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 bg-flame-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-md">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            {p.category && (
              <Link href={`/category/${p.category.slug}`} className="text-xs text-lime-700 font-extrabold uppercase tracking-wider hover:underline">
                {p.category.name}
              </Link>
            )}
            <h1 className="text-[26px] font-extrabold text-ink-900 mt-1.5 leading-tight tracking-tight">{p.name}</h1>
            <p className="text-sm text-ink-400 font-semibold mt-1">per {p.unit}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-[32px] font-extrabold text-ink-900 tracking-tight">{formatCurrency(p.price)}</span>
            {p.original_price && (
              <span className="text-lg text-ink-300 line-through font-bold">{formatCurrency(p.original_price)}</span>
            )}
            {discount && <span className="badge bg-lime-100 text-lime-800">Save {discount}%</span>}
          </div>

          {p.description && (
            <p className="text-ink-500 text-sm leading-relaxed font-medium">{p.description}</p>
          )}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${p.is_available ? 'bg-lime-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-extrabold ${p.is_available ? 'text-lime-700' : 'text-red-600'}`}>
              {p.is_available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {p.is_available && <AddToCartButton product={p} />}

          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="card p-3.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-lime-600" />
              </div>
              <span className="text-xs font-bold text-ink-700">15-min delivery</span>
            </div>
            <div className="card p-3.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-xs font-bold text-ink-700">Quality assured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
