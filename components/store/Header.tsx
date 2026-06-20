'use client'

import Link from 'next/link'
import { ShoppingCart, Search, X, MapPin } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import Image from 'next/image'

export default function Header() {
  const { totalItems, totalAmount } = useCart()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .eq('is_available', true)
        .ilike('name', `%${query.trim()}%`)
        .limit(6)
      setResults((data as Product[]) || [])
      setOpen(true)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const clear = () => { setQuery(''); setResults([]); setOpen(false) }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 h-[68px]">
          {/* Logo + location stacked */}
          <Link href="/" className="flex items-center gap-2.5 mr-2 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm shrink-0">
              <svg viewBox="0 0 512 512" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M140 220 L372 220 L340 360 Q336 380 316 380 L196 380 Q176 380 172 360 Z" fill="white"/>
                <path d="M190 220 Q170 160 210 130 Q240 108 256 120" stroke="white" strokeWidth="36" strokeLinecap="round"/>
                <path d="M322 220 Q342 160 302 130 Q272 108 256 120" stroke="white" strokeWidth="36" strokeLinecap="round"/>
                <line x1="200" y1="270" x2="312" y2="270" stroke="#059669" strokeWidth="22" strokeLinecap="round"/>
                <line x1="210" y1="310" x2="302" y2="310" stroke="#059669" strokeWidth="22" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-stone-900 text-base tracking-tight">
                {process.env.NEXT_PUBLIC_STORE_NAME || 'FreshMart'}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-stone-400 font-medium">
                <MapPin className="w-2.5 h-2.5" /> Delivering nearby
              </span>
            </div>
          </Link>

          {/* Search with live dropdown */}
          <div ref={ref} className="relative flex-1 max-w-xl">
            <div className="flex items-center gap-2 bg-stone-100 rounded-2xl px-4 py-2.5 transition-colors focus-within:bg-stone-50 focus-within:ring-2 focus-within:ring-emerald-100">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search for atta, rice, oil…"
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none"
              />
              {query && (
                <button onClick={clear} className="text-stone-400 hover:text-stone-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {open && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl shadow-stone-900/10 border border-stone-100 overflow-hidden z-50">
                {loading ? (
                  <div className="p-4 text-sm text-stone-400 text-center">Searching…</div>
                ) : results.length > 0 ? (
                  <>
                    {results.map(product => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={clear}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-stone-100 overflow-hidden shrink-0 relative">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="44px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🛒</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-900 truncate">{product.name}</p>
                          <p className="text-xs text-stone-400">{(product as any).category?.name}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-700 shrink-0">{formatCurrency(product.price)}</span>
                      </Link>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={clear}
                      className="block px-4 py-3 text-sm text-center text-emerald-700 font-semibold hover:bg-emerald-50 border-t border-stone-100"
                    >
                      See all results for &quot;{query}&quot;
                    </Link>
                  </>
                ) : (
                  <div className="p-4 text-sm text-stone-400 text-center">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-emerald-700 text-white pl-3.5 pr-4 py-2.5 rounded-2xl text-sm font-semibold hover:bg-emerald-800 transition-colors shrink-0 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:flex flex-col items-start leading-none gap-0.5">
              <span className="text-[10px] text-emerald-200 font-medium">{totalItems} items</span>
              <span>{totalItems > 0 ? formatCurrency(totalAmount) : 'Cart'}</span>
            </span>
            {totalItems > 0 && (
              <span className="sm:hidden absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
