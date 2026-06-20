'use client'

import Link from 'next/link'
import { ShoppingCart, Search, X, MapPin, ChevronDown, Zap } from 'lucide-react'
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
    if (query.trim().length < 2) { setResults([]); setOpen(false); return }
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
    <header className="sticky top-0 z-50 bg-ink-900">
      {/* Top strip — delivery promise */}
      <div className="bg-lime-400 text-ink-900">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-extrabold tracking-wide">
          <Zap className="w-3 h-3 fill-ink-900" /> DELIVERY IN 15–30 MINS
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          {/* Logo + location */}
          <Link href="/" className="flex items-center gap-2.5 mr-1 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 512 512" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M140 220 L372 220 L340 360 Q336 380 316 380 L196 380 Q176 380 172 360 Z" fill="#121419"/>
                <path d="M190 220 Q170 160 210 130 Q240 108 256 120" stroke="#121419" strokeWidth="36" strokeLinecap="round"/>
                <path d="M322 220 Q342 160 302 130 Q272 108 256 120" stroke="#121419" strokeWidth="36" strokeLinecap="round"/>
                <line x1="200" y1="270" x2="312" y2="270" stroke="#a3e25c" strokeWidth="22" strokeLinecap="round"/>
                <line x1="210" y1="310" x2="302" y2="310" stroke="#a3e25c" strokeWidth="22" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-white text-[15px] tracking-tight">
                {process.env.NEXT_PUBLIC_STORE_NAME || 'FreshMart'}
              </span>
              <button className="flex items-center gap-0.5 text-[11px] text-ink-300 font-semibold">
                <MapPin className="w-2.5 h-2.5 text-lime-400" /> Your area <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </Link>

          {/* Search */}
          <div ref={ref} className="relative flex-1 max-w-xl">
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-lime-400">
              <Search className="w-4 h-4 text-ink-400 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search for items..."
                className="flex-1 bg-transparent text-sm text-ink-800 placeholder-ink-400 outline-none font-medium"
              />
              {query && (
                <button onClick={clear} className="text-ink-400 hover:text-ink-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {open && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/20 border border-ink-100 overflow-hidden z-50">
                {loading ? (
                  <div className="p-4 text-sm text-ink-400 text-center font-medium">Searching…</div>
                ) : results.length > 0 ? (
                  <>
                    {results.map(product => (
                      <Link key={product.id} href={`/product/${product.slug}`} onClick={clear}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50 transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-ink-50 overflow-hidden shrink-0 relative">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="44px" />
                          ) : <div className="w-full h-full flex items-center justify-center text-lg">🛒</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-ink-900 truncate">{product.name}</p>
                          <p className="text-xs text-ink-400 font-medium">{(product as any).category?.name}</p>
                        </div>
                        <span className="text-sm font-extrabold text-ink-900 shrink-0">{formatCurrency(product.price)}</span>
                      </Link>
                    ))}
                    <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={clear}
                      className="block px-4 py-3 text-sm text-center text-ink-900 font-extrabold hover:bg-lime-50 border-t border-ink-100">
                      See all results
                    </Link>
                  </>
                ) : (
                  <div className="p-4 text-sm text-ink-400 text-center font-medium">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-2 bg-lime-400 text-ink-900 pl-3 pr-3.5 py-2.5 rounded-xl text-sm font-extrabold hover:bg-lime-300 transition-colors shrink-0">
            <ShoppingCart className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">{totalItems > 0 ? formatCurrency(totalAmount) : 'Cart'}</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-flame-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-ink-900">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
