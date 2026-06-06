'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { CartItem, Product } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        localStorage.removeItem('cart')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId))
    } else {
      setItems(prev =>
        prev.map(i =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// Generate WhatsApp order message
export function generateWhatsAppMessage(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  deliverySlot: string,
  notes: string
): string {
  const lines = [
    `🛒 *New Order*`,
    ``,
    `👤 *Customer:* ${customerName}`,
    `📞 *Phone:* ${customerPhone}`,
    `📍 *Address:* ${customerAddress}`,
    deliverySlot ? `🕐 *Delivery Slot:* ${deliverySlot}` : '',
    ``,
    `📦 *Order Items:*`,
    ...items.map(
      (i, idx) =>
        `${idx + 1}. ${i.product.name} × ${i.quantity} ${i.product.unit} — ₹${(i.product.price * i.quantity).toFixed(2)}`
    ),
    ``,
    `💰 *Total: ₹${items.reduce((s, i) => s + i.product.price * i.quantity, 0).toFixed(2)}*`,
    notes ? `\n📝 *Notes:* ${notes}` : '',
    ``,
    `_Order placed via website_`,
  ]
    .filter(l => l !== undefined)
    .join('\n')

  return encodeURIComponent(lines)
}
