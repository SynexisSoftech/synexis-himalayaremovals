import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '../../../components/admin-dashboard'

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect('/forbidden')
  }

  return <AdminDashboard />
}
