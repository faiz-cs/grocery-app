import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteBannerButton from './DeleteBannerButton'
import type { Banner } from '@/types'

export const revalidate = 0

export default async function AdminBannersPage() {
  const supabase = createClient()
  const { data: banners } = await supabase.from('banners').select('*').order('display_order')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500">Promotional banners shown on the homepage</p>
        </div>
        <Link href="/admin/banners/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Banner
        </Link>
      </div>

      <div className="space-y-3">
        {(banners as Banner[] || []).map(banner => (
          <div key={banner.id} className="card p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`badge ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-400">Order: {banner.display_order}</span>
              </div>
              <p className="font-semibold text-gray-900">{banner.title}</p>
              {banner.subtitle && <p className="text-sm text-gray-500 mt-0.5">{banner.subtitle}</p>}
              {banner.link_url && <p className="text-xs text-brand-600 mt-0.5">{banner.link_url}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/admin/banners/${banner.id}/edit`}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                <Pencil className="w-3.5 h-3.5" />
              </Link>
              <DeleteBannerButton id={banner.id} title={banner.title} />
            </div>
          </div>
        ))}
        {(!banners || banners.length === 0) && (
          <div className="card p-12 text-center text-gray-400">
            No banners yet. <Link href="/admin/banners/new" className="text-brand-600 hover:underline">Add your first banner</Link>
          </div>
        )}
      </div>
    </div>
  )
}
