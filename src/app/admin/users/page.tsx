import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UserManagement } from '../../../../components/users-managements'

export default async function UsersPage() {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect('/forbidden')
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>User Management</h1>
        <p className='text-muted-foreground'>
          Manage user accounts and permissions
        </p>
      </div>

      <UserManagement currentUserId={session.user?.id} />
    </div>
  )
}
