import { Suspense } from 'react'
import OrdersList from './OrdersList'

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {[1,2,3].map(i => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100" />)}
      </div>
    }>
      <OrdersList />
    </Suspense>
  )
}
