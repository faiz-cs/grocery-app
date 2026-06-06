'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import type { Category, Product } from '@/types'
import { Upload } from 'lucide-react'

interface Props {
  product?: Product
  categories: Category[]
}

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    unit: product?.unit || 'piece',
    category_id: product?.category_id || '',
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    stock_quantity: product?.stock_quantity?.toString() || '',
    image_url: product?.image_url || '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !isEdit ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    let imageUrl = form.image_url
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `products/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('images').upload(path, imageFile)
      if (uploadError) { setError(uploadError.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      unit: form.unit,
      category_id: form.category_id,
      is_available: form.is_available,
      is_featured: form.is_featured,
      stock_quantity: form.stock_quantity ? parseInt(form.stock_quantity) : null,
      image_url: imageUrl || null,
    }

    const { error: dbError } = isEdit
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    if (dbError) { setError(dbError.message); setLoading(false); return }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Basic Info</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="e.g. Organic Tomatoes" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className="input" placeholder="organic-tomatoes" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} required className="input">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input resize-none h-24" placeholder="Product details…" />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="input" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
            <input name="original_price" type="number" step="0.01" value={form.original_price} onChange={handleChange} className="input" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit *</label>
            <input name="unit" value={form.unit} onChange={handleChange} required className="input" placeholder="kg, piece, litre…" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
            <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} className="input" placeholder="Leave blank for unlimited" />
          </div>
        </div>
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm font-medium text-gray-700">Available for sale</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm font-medium text-gray-700">Featured product</span>
          </label>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Product Image</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input" placeholder="https://…" />
        </div>
        <div className="text-center text-xs text-gray-400">— or upload a file —</div>
        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-colors">
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-500">{imageFile ? imageFile.name : 'Click to upload image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
          {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-3">Cancel</button>
      </div>
    </form>
  )
}
