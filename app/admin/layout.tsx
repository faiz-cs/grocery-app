import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-login')
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminUser) {
    redirect('/admin-login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminName={adminUser.name} adminRole={adminUser.role} />
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  )
}
