'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ORDER_STATUSES } from '@/lib/utils'

interface Props {
  orderId: string
  currentStatus: string
}

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supabase = createClient()
    await supabase.from('orders').update({ status: e.target.value }).eq('id', orderId)
    router.refresh()
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 cursor-pointer"
    >
      {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
}
