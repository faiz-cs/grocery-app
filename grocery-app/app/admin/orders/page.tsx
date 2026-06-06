import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, ORDER_STATUSES } from '@/lib/utils'
import OrderStatusSelect from './OrderStatusSelect'
import type { Order } from '@/types'

export const revalidate = 0

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string }
}) {
  const supabase = createClient()
  const statusFilter = searchParams.status || ''
  const query = searchParams.q || ''

  let req = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (statusFilter) req = req.eq('status', statusFilter)
  if (query) req = req.or(`customer_name.ilike.%${query}%,customer_phone.ilike.%${query}%`)

  const { data: orders } = await req.limit(100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{orders?.length || 0} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: '', label: 'All' }, ...Object.entries(ORDER_STATUSES).map(([k, v]) => ({ value: k, label: v.label }))].map(({ value, label }) => (
          <a key={value} href={`/admin/orders${value ? `?status=${value}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === value ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {label}
          </a>
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
              {(orders as Order[] || []).map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-gray-500">#{order.id.slice(0,8).toUpperCase()}</span>
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
                  <td className="px-5 py-4 font-bold text-gray-900">{formatCurrency(order.total_amount)}</td>
                  <td className="px-5 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
