import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'
import type { Product } from '@/types'

export const revalidate = 0

export default async function AdminProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products?.length || 0} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Product</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products as Product[] || []).map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.unit}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 hidden md:table-cell">
                    {(product as any).category?.name || '—'}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`badge ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                    {product.is_featured && (
                      <span className="badge bg-yellow-100 text-yellow-700 ml-1">Featured</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    No products yet. <Link href="/admin/products/new" className="text-brand-600 hover:underline">Add your first product</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
