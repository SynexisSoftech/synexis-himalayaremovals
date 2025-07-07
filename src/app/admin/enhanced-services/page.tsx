import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { EnhancedServiceManagement } from '../../../../components/enhanced-service-management'

export default async function EnhancedServicesPage() {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect('/forbidden')
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Enhanced Service Management</h1>
        <p className='text-gray-600 mt-2'>
          Comprehensive management of services and sub-services with advanced features
        </p>
      </div>

      <EnhancedServiceManagement />
    </div>
  )
} 