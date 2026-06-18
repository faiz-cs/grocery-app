'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, ORDER_STATUSES } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    const supabase = createClient()
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (statusFilter) query = query.eq('status', statusFilter)

    const { data } = await query
    setOrders((data as Order[]) || [])
    setLoading(false)
  }, [statusFilter])

  useEffect(() => {
    setLoading(true)
    fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistically update UI immediately
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o)
    )
    setUpdatingId(orderId)

    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      // Revert on failure
      console.error('Status update failed:', error)
      fetchOrders()
    }

    setUpdatingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn-secondary text-sm px-4 py-2"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === value
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Order</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Customer</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-8 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-500">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_phone}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-xs text-gray-600 max-w-xs truncate">
                        {order.order_items?.map(i => `${i.product_name} ×${i.quantity}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs border rounded-lg px-2 py-1.5 bg-white cursor-pointer transition-all
                          focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20
                          ${updatingId === order.id ? 'opacity-50 cursor-wait' : ''}
                          ${order.status === 'delivered' ? 'border-green-300 bg-green-50 text-green-700' :
                            order.status === 'cancelled' ? 'border-red-200 bg-red-50 text-red-600' :
                            order.status === 'pending' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                            'border-gray-200'
                          }`}
                      >
                        {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
