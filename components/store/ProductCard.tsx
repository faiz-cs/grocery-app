'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
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
    <div className={cn('card group flex flex-col overflow-hidden hover:shadow-md transition-shadow', className)}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 badge bg-red-500 text-white text-[10px] px-1.5 py-0.5">
            -{discount}%
          </span>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-gray-200 text-gray-600 text-xs">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 gap-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors leading-tight"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-400">{product.unit}</p>

        {/* Price row */}
        <div className="mt-auto pt-1.5">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-sm font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {/* Add to cart controls — full width */}
          {product.is_available && (
            quantity === 0 ? (
              <button
                onClick={() => addItem(product)}
                className="w-full flex items-center justify-center gap-1 bg-brand-600 text-white rounded-lg py-1.5 text-xs font-semibold hover:bg-brand-700 active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-gray-50 rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <span className="flex-1 text-center text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => addItem(product, 1)}
                  className="w-7 h-7 rounded-md bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 active:scale-95 transition-all shadow-sm"
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
