import CategoryForm from '@/components/admin/CategoryForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <Link href="/admin/categories" className="hover:text-brand-600">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900">New Category</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
      </div>
      <CategoryForm />
    </div>
  )
}
