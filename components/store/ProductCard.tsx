'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ShoppingBag, Clock } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/lib/cart'
import { formatCurrency, cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find(i => i.product.id === product.id)
  const quantity = cartItem?.quantity || 0

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null

  return (
    <div className={cn(
      'group flex flex-col overflow-hidden rounded-2xl bg-white border border-ink-100 hover:border-ink-200 hover:shadow-md transition-all duration-150',
      className
    )}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-ink-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-50">
            <ShoppingBag className="w-8 h-8 text-ink-200" />
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-flame-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
            {discount}% OFF
          </span>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex items-center justify-center">
            <span className="badge bg-ink-800 text-white">Sold Out</span>
          </div>
        )}
        {/* Quick delivery time chip on hover */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm text-ink-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            <Clock className="w-2.5 h-2.5" /> 15 MINS
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 gap-0.5">
        <p className="text-[11px] text-ink-400 font-semibold uppercase tracking-wide">{product.unit}</p>
        <Link
          href={`/product/${product.slug}`}
          className="text-[13px] font-bold text-ink-800 line-clamp-2 leading-snug min-h-[2.3em] hover:text-ink-900"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-[14.5px] font-extrabold text-ink-900">{formatCurrency(product.price)}</span>
            {product.original_price && (
              <span className="text-[10.5px] text-ink-300 line-through font-semibold">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {product.is_available && (
            quantity === 0 ? (
              <button
                onClick={() => addItem(product)}
                className="w-full flex items-center justify-center gap-1 bg-white text-lime-700 border-[1.5px] border-lime-500 rounded-lg py-1.5 text-[11px] font-extrabold hover:bg-lime-500 hover:text-white active:scale-95 transition-all duration-150"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-lime-500 rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-lime-600 active:scale-90 transition-all text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="flex-1 text-center text-[12.5px] font-extrabold text-white">{quantity}</span>
                <button
                  onClick={() => addItem(product, 1)}
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-lime-600 active:scale-90 transition-all text-white"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
