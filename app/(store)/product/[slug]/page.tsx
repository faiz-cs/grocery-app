import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/store/AddToCartButton'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight, Tag } from 'lucide-react'
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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {p.category && (
          <>
            <Link href={`/category/${p.category.slug}`} className="hover:text-brand-600">{p.category.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-gray-900 font-medium truncate">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-8xl">🛒</div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 badge bg-red-500 text-white text-sm px-3 py-1">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            {p.category && (
              <Link href={`/category/${p.category.slug}`} className="text-xs text-brand-600 font-medium uppercase tracking-wide hover:underline">
                {p.category.name}
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{p.name}</h1>
            <p className="text-sm text-gray-500 mt-1">per {p.unit}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(p.price)}</span>
            {p.original_price && (
              <span className="text-lg text-gray-400 line-through">{formatCurrency(p.original_price)}</span>
            )}
            {discount && (
              <span className="badge bg-green-100 text-green-700">Save {discount}%</span>
            )}
          </div>

          {p.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
          )}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${p.is_available ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${p.is_available ? 'text-green-700' : 'text-red-600'}`}>
              {p.is_available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {p.is_available && <AddToCartButton product={p} />}

          <div className="card p-4 flex items-start gap-3 bg-brand-50 border-brand-100">
            <Tag className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
            <p className="text-xs text-brand-800">
              Add to cart and place your order. We&apos;ll send you a WhatsApp confirmation with your delivery details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
