'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'

export default function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter()
  const isEdit = !!category
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    image_url: category?.image_url || '',
    display_order: category?.display_order?.toString() || '0',
    is_active: category?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
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
    const payload = {
      name: form.name,
      slug: form.slug,
      image_url: form.image_url || null,
      display_order: parseInt(form.display_order),
      is_active: form.is_active,
    }
    const { error: dbError } = isEdit
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload)
    if (dbError) { setError(dbError.message); setLoading(false); return }
    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="e.g. Fruits & Vegetables" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required className="input" placeholder="fruits-vegetables" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input" placeholder="https://…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
          <input name="display_order" type="number" value={form.display_order} onChange={handleChange} className="input" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="rounded border-gray-300 text-brand-600" />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
          {loading ? 'Saving…' : isEdit ? 'Update Category' : 'Create Category'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-3">Cancel</button>
      </div>
    </form>
  )
}
