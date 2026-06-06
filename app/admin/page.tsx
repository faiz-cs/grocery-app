import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, ORDER_STATUSES } from '@/lib/utils'
import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react'
import type { Order } from '@/types'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const [
    { count: totalOrders },
    { count: totalCustomers },
    { count: totalProducts },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total_amount').neq('status', 'cancelled'),
  ])

  const totalRevenue = (revenue || []).reduce((s: number, o: any) => s + Number(o.total_amount), 0)

  const STATS = [
    { label: 'Total Orders', value: totalOrders || 0, icon: ShoppingBag, color: 'blue' },
    { label: 'Customers', value: totalCustomers || 0, icon: Users, color: 'green' },
    { label: 'Products', value: totalProducts || 0, icon: Package, color: 'purple' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'orange' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              color === 'blue' ? 'bg-blue-50 text-blue-600' :
              color === 'green' ? 'bg-green-50 text-green-600' :
              color === 'purple' ? 'bg-purple-50 text-purple-600' :
              'bg-orange-50 text-orange-600'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {(recentOrders as Order[] || []).map(order => {
            const status = ORDER_STATUSES[order.status]
            return (
              <div key={order.id} className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-gray-400">#{order.id.slice(0,8).toUpperCase()}</span>
                    <span className={`badge text-xs ${
                      status.color === 'green' ? 'bg-green-100 text-green-700' :
                      status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      status.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                      status.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>{status.label}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-400">{order.customer_phone}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                </div>
              </div>
            )
          })}
          {(!recentOrders || recentOrders.length === 0) && (
            <p className="p-8 text-center text-gray-400 text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
