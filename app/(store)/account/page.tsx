'use client'

import { useState, useEffect } from 'react'
import { User, Phone, MapPin, Save } from 'lucide-react'

export default function AccountPage() {
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      name: localStorage.getItem('customer_name') || '',
      phone: localStorage.getItem('customer_phone') || '',
      address: localStorage.getItem('customer_address') || '',
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('customer_name', form.name)
    localStorage.setItem('customer_phone', form.phone)
    localStorage.setItem('customer_address', form.address)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-forest-900 mb-6">My Account</h1>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ Profile saved successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</span>
          </label>
          <input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="input" placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
          </label>
          <input
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="input" placeholder="+91 98765 43210" type="tel"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Default Address</span>
          </label>
          <textarea
            value={form.address}
            onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            className="input resize-none h-24" placeholder="Your delivery address…"
          />
        </div>
        <button type="submit" className="btn-primary w-full py-3">
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </form>

      <p className="text-xs text-forest-400 text-center mt-4">
        Your details are saved locally and auto-filled at checkout.
      </p>
    </div>
  )
}
