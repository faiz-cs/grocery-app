'use client'

import { useCart } from '@/lib/cart'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Link href="/categories" className="btn-primary">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Your Cart <span className="text-gray-400 font-normal text-lg">({totalItems} items)</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-2xl">🛒</div>
                )}
              </div>
              <div className="flex flex-col flex-1 gap-1 min-w-0">
                <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-gray-900 hover:text-brand-600 line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-400">{product.unit}</p>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="font-bold text-gray-900">{formatCurrency(product.price * quantity)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 flex items-center justify-center ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full py-3">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/categories" className="btn-secondary w-full mt-3 py-2.5 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
