'use client'

import { useState } from 'react'
import { useCart, generateWhatsAppMessage } from '@/lib/cart'
import { formatCurrency, getWhatsAppUrl, DELIVERY_SLOTS } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    deliverySlot: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)

    try {
      const supabase = createClient()

      // Upsert customer
      const { data: customer } = await supabase
        .from('customers')
        .upsert({ name: form.name, phone: form.phone, address: form.address }, { onConflict: 'phone' })
        .select()
        .single()

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer?.id || null,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          delivery_slot: form.deliverySlot,
          notes: form.notes,
          total_amount: totalAmount,
          status: 'pending',
          whatsapp_sent: true,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      await supabase.from('order_items').insert(
        items.map(i => ({
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          product_price: i.product.price,
          quantity: i.quantity,
          subtotal: i.product.price * i.quantity,
        }))
      )

      // Build WhatsApp URL
      const msg = generateWhatsAppMessage(
        items,
        form.name,
        form.phone,
        form.address,
        form.deliverySlot,
        form.notes
      )
      const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
      const waUrl = getWhatsAppUrl(waPhone, msg)

      clearCart()
      window.open(waUrl, '_blank')
      router.push(`/orders?success=${order.id}`)
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No items to checkout</h2>
        <Link href="/categories" className="btn-primary mt-4">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-900">Delivery Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="input" placeholder="Your name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required type="tel"
                className="input" placeholder="+91 98765 43210" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} required
                className="input resize-none h-24" placeholder="House/flat number, street, area, city…" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Delivery Slot</label>
              <select name="deliverySlot" value={form.deliverySlot} onChange={handleChange} className="input">
                <option value="">Select a time slot</option>
                {DELIVERY_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Instructions</label>
              <textarea name="notes" value={form.notes} onChange={handleChange}
                className="input resize-none h-20" placeholder="Allergies, substitutions, gate code…" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="card p-5 sticky top-24 space-y-4">
            <h2 className="font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between gap-2 text-gray-700">
                  <span className="line-clamp-1">{product.name} × {quantity}</span>
                  <span className="font-medium shrink-0">{formatCurrency(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <button type="submit" disabled={loading} className="btn-whatsapp w-full py-3">
              <MessageCircle className="w-5 h-5" />
              {loading ? 'Placing Order…' : 'Place Order via WhatsApp'}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Payment collected on delivery (Cash / UPI)
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
