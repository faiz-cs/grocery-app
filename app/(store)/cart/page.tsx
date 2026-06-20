'use client'

import { useCart } from '@/lib/cart'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-forest-50 flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-9 h-9 text-forest-300" />
        </div>
        <h2 className="text-xl font-extrabold text-forest-800 mb-1.5">Your cart is empty</h2>
        <p className="text-forest-400 text-sm font-medium mb-8">Add some items to get started.</p>
        <Link href="/categories" className="btn-accent px-8 py-3">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-forest-900 tracking-tight mb-1">My Cart</h1>
      <p className="text-sm text-forest-400 font-semibold mb-6">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-3.5 flex gap-3.5">
              <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden bg-forest-50 shrink-0">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="72px" />
                ) : <div className="absolute inset-0 flex items-center justify-center text-forest-300 text-2xl">🛒</div>}
              </div>
              <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                <Link href={`/product/${product.slug}`} className="text-sm font-bold text-forest-800 hover:text-ink-950 line-clamp-2 leading-snug">
                  {product.name}
                </Link>
                <p className="text-xs text-forest-400 font-semibold">{product.unit}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-1">
                  <span className="font-extrabold text-forest-900">{formatCurrency(product.price * quantity)}</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-forest-200 flex items-center justify-center hover:bg-forest-50 active:scale-90 transition-all">
                      <Minus className="w-3 h-3 text-forest-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold text-forest-900">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center hover:bg-forest-700 active:scale-90 transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(product.id)}
                      className="w-7 h-7 rounded-lg text-forest-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center ml-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="card p-5 sticky top-24 space-y-4">
            <h2 className="font-extrabold text-forest-900">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-forest-500 font-semibold">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-forest-700 font-bold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-forest-500 font-semibold">
                <span>Delivery</span>
                <span className="text-forest-600 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Free
                </span>
              </div>
              <div className="border-t border-dashed border-forest-200 pt-3 flex justify-between font-extrabold text-forest-900 text-base">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-accent w-full py-3.5">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/categories" className="btn-secondary w-full py-2.5 text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
