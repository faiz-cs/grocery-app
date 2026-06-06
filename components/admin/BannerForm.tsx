'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Banner } from '@/types'

export default function BannerForm({ banner }: { banner?: Banner }) {
  const router = useRouter()
  const isEdit = !!banner
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image_url: banner?.image_url || '',
    link_url: banner?.link_url || '',
    display_order: banner?.display_order?.toString() || '0',
    is_active: banner?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
      display_order: parseInt(form.display_order),
      is_active: form.is_active,
    }
    if (isEdit) await supabase.from('banners').update(payload).eq('id', banner.id)
    else await supabase.from('banners').insert(payload)
    router.push('/admin/banners')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required className="input" placeholder="e.g. Weekend Sale!" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
          <input name="subtitle" value={form.subtitle} onChange={handleChange} className="input" placeholder="Short description" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input" placeholder="https://…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL</label>
          <input name="link_url" value={form.link_url} onChange={handleChange} className="input" placeholder="/category/snacks" />
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
          {loading ? 'Saving…' : isEdit ? 'Update Banner' : 'Create Banner'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-3">Cancel</button>
      </div>
    </form>
  )
}
