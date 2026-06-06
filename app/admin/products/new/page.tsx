import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order')

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <Link href="/admin/products" className="hover:text-brand-600">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900">New Product</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  )
}
