"use client"

import type React from 'react'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = { id, title, description, variant }

      setToasts((prev) => [...prev, newToast])

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    []
  )

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      toast({
        title: type === 'success' ? 'Success' : 'Error',
        description: message,
        variant: type === 'success' ? 'success' : 'destructive',
      })
    },
    [toast]
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toast, showToast, toasts, removeToast }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <div className='fixed bottom-4 right-4 z-50 space-y-2'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm p-4 rounded-lg shadow-lg border ${
              toast.variant === 'destructive'
                ? 'bg-red-50 border-red-200 text-red-800'
                : toast.variant === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className='flex items-start justify-between'>
              <div>
                <h4 className='font-medium'>{toast.title}</h4>
                {toast.description && (
                  <p className='text-sm mt-1 opacity-90'>{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className='ml-4 text-gray-400 hover:text-gray-600'
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
