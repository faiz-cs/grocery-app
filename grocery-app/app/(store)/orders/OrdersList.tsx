'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, ORDER_STATUSES } from '@/lib/utils'
import Link from 'next/link'
import { ClipboardList, CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import type { Order } from '@/types'

export default function OrdersList() {
  const searchParams = useSearchParams()
  const successId = searchParams.get('success')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const phone = localStorage.getItem('customer_phone') || ''
    if (!phone) { setLoading(false); return }

    const supabase = createClient()
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {successId && (
        <div className="card p-5 mb-6 border-green-200 bg-green-50 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Order placed successfully!</p>
            <p className="text-sm text-green-700 mt-0.5">WhatsApp has been opened with your order details. The store will confirm shortly.</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-600">No orders yet</p>
          <Link href="/categories" className="btn-primary mt-6">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const status = ORDER_STATUSES[order.status]
            return (
              <div key={order.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`badge ${
                    status.color === 'green' ? 'bg-green-100 text-green-700' :
                    status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    status.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                    status.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {status.label}
                  </span>
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    {order.order_items.map(i => `${i.product_name} ×${i.quantity}`).join(', ')}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
