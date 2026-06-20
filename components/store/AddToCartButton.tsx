'use client'

import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { Product } from '@/types'
import Link from 'next/link'

export default function AddToCartButton({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find(i => i.product.id === product.id)
  const quantity = cartItem?.quantity || 0

  if (quantity === 0) {
    return (
      <button onClick={() => addItem(product)} className="btn-accent py-3.5">
        <ShoppingBag className="w-4 h-4" />
        Add to Cart
      </button>
    )
  }

  return (
    <div className="flex gap-3 items-center">
      <div className="flex items-center gap-3 flex-1 justify-center bg-lime-500 rounded-2xl p-2">
        <button onClick={() => updateQuantity(product.id, quantity - 1)}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all text-white">
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-extrabold text-white w-8 text-center">{quantity}</span>
        <button onClick={() => addItem(product, 1)}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all text-white">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <Link href="/cart" className="btn-secondary py-3.5 px-5">View Cart</Link>
    </div>
  )
}
