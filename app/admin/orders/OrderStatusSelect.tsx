'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { ORDER_STATUSES } from '@/lib/utils'

interface Props {
  orderId: string
  currentStatus: string
}

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setSaving(true)
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch {
      // Revert on error
      setStatus(currentStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 cursor-pointer disabled:opacity-60"
    >
      {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
}
