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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-ink-900 md:hidden">
      <div className="flex">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center gap-1 py-2.5 relative">
              <div className="relative">
                <Icon className={cn('w-[19px] h-[19px] transition-colors', isActive ? 'text-lime-400' : 'text-ink-400')} strokeWidth={isActive ? 2.5 : 2} />
                {href === '/cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-0.5 bg-flame-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-ink-900">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-lime-400' : 'text-ink-400')}>
                {label}
              </span>
              {isActive && <div className="absolute bottom-0 w-8 h-[3px] bg-lime-400 rounded-t-full" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
