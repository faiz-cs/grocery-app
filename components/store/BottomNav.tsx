'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3x3, ShoppingCart, ClipboardList, User } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/categories', icon: Grid3x3, label: 'Categories' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/orders', icon: ClipboardList, label: 'Orders' },
  { href: '/account', icon: User, label: 'Account' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-100 md:hidden pb-safe">
      <div className="flex">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 relative"
            >
              <div className={cn(
                'relative flex items-center justify-center w-10 h-7 rounded-full transition-all',
                isActive ? 'bg-emerald-100' : ''
              )}>
                <Icon className={cn('w-[18px] h-[18px] transition-colors', isActive ? 'text-emerald-700' : 'text-stone-400')} strokeWidth={isActive ? 2.5 : 2} />
                {href === '/cart' && totalItems > 0 && (
                  <span className="absolute -top-1 -right-0.5 min-w-[16px] h-4 px-1 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-semibold transition-colors', isActive ? 'text-emerald-700' : 'text-stone-400')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
