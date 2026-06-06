'use client'

import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
