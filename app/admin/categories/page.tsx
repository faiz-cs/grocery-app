import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteCategoryButton from './DeleteCategoryButton'
import type { Category } from '@/types'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('display_order')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">{categories?.length || 0} total</p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Category</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Slug</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Order</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(categories as any[] || []).map((cat: Category & { products: { count: number }[] }) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-5 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-5 py-4 text-gray-600">{cat.display_order}</td>
                <td className="px-5 py-4">
                  <span className={`badge ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${cat.id}/edit`}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
