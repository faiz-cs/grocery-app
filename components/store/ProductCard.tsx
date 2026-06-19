'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <div className={cn('card group flex flex-col overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-purple-100', className)}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-gradient-to-br from-purple-50 to-cyan-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-cyan-100">
            <ShoppingCart className="w-10 h-10 text-purple-300" />
          </div>
        )}
        {discount && (
          <span className="absolute top-3 left-3 badge bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] px-2 py-1 font-bold shadow-lg">
            -{discount}%
          </span>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur flex items-center justify-center">
            <span className="badge bg-gray-800 text-white text-xs px-3 py-1.5">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors leading-tight"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-500 font-medium">{product.unit}</p>

        {/* Price row */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-lg font-bold text-purple-600">
              {formatCurrency(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>

          {/* Add to cart controls — full width */}
          {product.is_available && (
            quantity === 0 ? (
              <button
                onClick={() => addItem(product)}
                className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg py-2 text-xs font-bold hover:shadow-lg active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-1 border border-purple-200">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-md bg-white border-2 border-purple-300 flex items-center justify-center hover:bg-purple-100 active:scale-95 transition-all shadow-sm font-bold"
                >
                  <Minus className="w-3 h-3 text-purple-600" />
                </button>
                <span className="flex-1 text-center text-sm font-bold text-purple-700">{quantity}</span>
                <button
                  onClick={() => addItem(product, 1)}
                  className="w-7 h-7 rounded-md bg-gradient-to-r from-purple-600 to-purple-500 text-white flex items-center justify-center hover:shadow-md active:scale-95 transition-all shadow-sm"
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