import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ServiceManagement } from '../../../../components/servicemanagement'

export default async function ServicesPage() {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect('/forbidden')
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Service Management</h1>
        <p className='text-gray-600 mt-2'>
          Manage your services and sub-services
        </p>
      </div>

      <ServiceManagement />
    </div>
  )
}
