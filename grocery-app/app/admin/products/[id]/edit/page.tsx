import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <Link href="/admin/products" className="hover:text-brand-600">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900">Edit Product</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Edit: {product.name}</h1>
      </div>
      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
