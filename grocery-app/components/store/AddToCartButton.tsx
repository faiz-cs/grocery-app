'use client'

import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { Product } from '@/types'
import Link from 'next/link'

export default function AddToCartButton({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find(i => i.product.id === product.id)
  const quantity = cartItem?.quantity || 0

  if (quantity === 0) {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => addItem(product)}
          className="btn-primary flex-1 py-3"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-center">
      <div className="flex items-center gap-3 flex-1 justify-center bg-gray-100 rounded-xl p-2">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-bold text-gray-900 w-8 text-center">{quantity}</span>
        <button
          onClick={() => addItem(product, 1)}
          className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <Link href="/cart" className="btn-secondary py-3 px-5">
        View Cart
      </Link>
    </div>
  )
}
