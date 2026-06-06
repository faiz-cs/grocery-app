import BannerForm from '@/components/admin/BannerForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <Link href="/admin/banners" className="hover:text-brand-600">Banners</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900">New Banner</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Add Banner</h1>
      </div>
      <BannerForm />
    </div>
  )
}
