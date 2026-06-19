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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-purple-200 md:hidden shadow-2xl">
      <div className="flex">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-bold transition-all relative',
                isActive 
                  ? 'text-purple-600 bg-gradient-to-t from-purple-50 to-transparent' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                {href === '/cart' && totalItems > 0 && (
                  <span className="absolute -top-3 -right-3 min-w-5 h-5 px-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}