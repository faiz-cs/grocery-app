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
          <span className="absolute top-2 left-2 badge bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-gray-200 text-gray-600">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <Link href={`/product/${product.slug}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors">
          {product.name}
        </Link>
        <p className="text-xs text-gray-400">{product.unit}</p>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.original_price && (
              <span className="ml-1 text-xs text-gray-400 line-through">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {product.is_available && (
            quantity === 0 ? (
              <button
                onClick={() => addItem(product)}
                className="flex items-center gap-1 bg-brand-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => addItem(product, 1)}
                  className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors"
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
