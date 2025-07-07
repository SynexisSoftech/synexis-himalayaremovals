import type React from 'react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='w-64 bg-white border-r border-gray-200'>
        <div className='h-full px-3 py-4 overflow-y-auto bg-white'>
          <ul className='space-y-2 font-medium'>
            <li>
              <Link
                href='/admin'
                className='inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m1-10V9a1 1 0 00-1-1h-3m-6 0a1 1 0 011-1h2a1 1 0 011 1v3m4 0a1 1 0 001-1h3a1 1 0 001 1v3m-3 0a1 1 0 01-1-1h-2a1 1 0 01-1 1v3m0 0a1 1 0 011-1h2a1 1 0 011 1v3'
                  />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href='/admin/services'
                className='inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                  />
                </svg>
                Services
              </Link>
            </li>
            <li>
              <Link
                href='/admin/bookings'
                className='inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                  />
                </svg>
                Bookings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4'>{children}</div>
    </div>
  )
}
