'use client'

import Link from 'next/link'
import { ShoppingCart, Search, MapPin } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/utils'

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              {process.env.NEXT_PUBLIC_STORE_NAME || 'FreshMart'}
            </span>
          </Link>

          {/* Address */}
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 flex-1">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>Delivering to your location</span>
          </div>

          {/* Search */}
          <Link
            href="/search"
            className="flex items-center gap-2 flex-1 md:max-w-sm bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search products…</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
