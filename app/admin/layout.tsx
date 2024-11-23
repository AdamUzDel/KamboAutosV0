import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/auth/signin')
  }

  if (session.user.role !== 'ADMIN') {
    return redirect('/')
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 px-8 pb-8 pt-4 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}