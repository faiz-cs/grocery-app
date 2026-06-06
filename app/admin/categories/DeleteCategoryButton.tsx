'use client'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const handle = async () => {
    if (!confirm(`Delete category "${name}"? All products in this category will be deleted.`)) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    router.refresh()
  }
  return (
    <button onClick={handle} className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
