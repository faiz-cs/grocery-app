import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import type { Customer } from '@/types'

export const revalidate = 0

export default async function AdminCustomersPage() {
  const supabase = createClient()
  const { data: customers } = await supabase
    .from('customers')
    .select('*, orders(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500">{customers?.length || 0} total</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Customer</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Address</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Orders</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(customers as any[] || []).map((customer: Customer & { orders: { count: number }[] }) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    {customer.email && <p className="text-xs text-gray-400">{customer.email}</p>}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{customer.phone}</td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell max-w-xs truncate">{customer.address || '—'}</td>
                  <td className="px-5 py-4">
                    <span className="badge bg-brand-100 text-brand-700">
                      {customer.orders?.[0]?.count || 0} orders
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden sm:table-cell text-xs">{formatDate(customer.created_at)}</td>
                </tr>
              ))}
              {(!customers || customers.length === 0) && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No customers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
