'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
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
      'group flex flex-col overflow-hidden rounded-3xl bg-white border border-stone-100 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.06)] hover:shadow-[0_8px_24px_-4px_rgba(28,25,23,0.12)] hover:-translate-y-0.5 transition-all duration-200',
      className
    )}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-stone-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
            <ShoppingBag className="w-9 h-9 text-stone-300" />
          </div>
        )}
        {discount && (
          <span className="absolute top-2.5 left-2.5 badge bg-amber-500 text-white text-[10px] px-2 py-1 shadow-sm">
            {discount}% OFF
          </span>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="badge bg-stone-800 text-white text-xs px-3 py-1">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-[13.5px] font-semibold text-stone-800 line-clamp-2 hover:text-emerald-700 transition-colors leading-snug min-h-[2.4em]"
        >
          {product.name}
        </Link>
        <p className="text-xs text-stone-400 font-medium">{product.unit}</p>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-[15px] font-extrabold text-stone-900">
              {formatCurrency(product.price)}
            </span>
            {product.original_price && (
              <span className="text-[11px] text-stone-400 line-through font-medium">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {product.is_available && (
            quantity === 0 ? (
              <button
                onClick={() => addItem(product)}
                className="w-full flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl py-2 text-xs font-bold hover:bg-emerald-700 hover:text-white hover:border-emerald-700 active:scale-95 transition-all duration-150"
              >
                <Plus className="w-3.5 h-3.5" /> ADD
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-emerald-700 rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-800 active:scale-90 transition-all text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center text-sm font-extrabold text-white">{quantity}</span>
                <button
                  onClick={() => addItem(product, 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-800 active:scale-90 transition-all text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
