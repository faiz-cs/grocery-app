import Header from '@/components/store/Header'
import BottomNav from '@/components/store/BottomNav'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>{children}</main>
      <BottomNav />
    </div>
  )
}
