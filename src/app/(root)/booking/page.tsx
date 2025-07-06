"use client"

import type React from "react"
import { useState, useEffect, useCallback } from 'react'
import Header from '../component/header/header'
import Footer from '../component/footer/footer'

// Add these interfaces after the imports
interface Service {
  _id: string
  name: string
  description: string
  isActive: boolean
  category: string
}

interface SubService {
  _id: string
  serviceId: string
  name: string
  description: string
  price: number
  priceType: string
  isActive: boolean
}

export default function BookingSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    serviceId: '',
    subServiceId: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // Add these new state variables after the existing ones:
  const [services, setServices] = useState<Service[]>([])
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Add these fetch functions with useCallback for optimization:
  const fetchServices = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true)
        } else {
          setIsLoadingServices(true)
        }
        setServiceError(null)

        const response = await fetch('/api/admin/services', {
          // Add cache busting to ensure fresh data
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load services')
        }

        const data = await response.json()
        console.log(data)
        const activeServices = data.services.filter(
          (service: Service) => service.isActive
        )

        // Check if services have actually changed
        const servicesChanged =
          JSON.stringify(services) !== JSON.stringify(activeServices)

        setServices(activeServices)
        setLastUpdated(new Date())

        // If current selected service is no longer available, reset selection
        if (
          formData.serviceId &&
          !activeServices.find((s: Service) => s._id === formData.serviceId)
        ) {
          setFormData((prev) => ({ ...prev, serviceId: '', subServiceId: '' }))
          setSubServices([])
        }

        // Show update notification if services changed and this is a refresh
        if (servicesChanged && showRefreshIndicator && services.length > 0) {
          // You could add a toast notification here
          console.log('Services updated!')
        }
      } catch (error) {
        setServiceError('Unable to load services. Please try again later.')
        console.error('Error fetching services:', error)
      } finally {
        setIsLoadingServices(false)
        setIsRefreshing(false)
      }
    },
    [services, formData.serviceId]
  )

  const fetchSubServices = useCallback(
    async (serviceId: string) => {
      try {
        const response = await fetch(
          `/api/services/${serviceId}/sub-services`,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
            },
          }
        )
        if (response.ok) {
          const data = await response.json()
          const activeSubServices = data.subServices.filter(
            (subService: SubService) => subService.isActive
          )
          setSubServices(activeSubServices)

          // If current selected sub-service is no longer available, reset selection
          if (
            formData.subServiceId &&
            !activeSubServices.find(
              (ss: SubService) => ss._id === formData.subServiceId
            )
          ) {
            setFormData((prev) => ({ ...prev, subServiceId: '' }))
          }
        }
      } catch (error) {
        console.error('Error fetching sub-services:', error)
      }
    },
    [formData.subServiceId]
  )

  // Manual refresh function
  const handleRefreshServices = () => {
    fetchServices(true)
  }

  // Add these useEffect hooks after the state declarations:
  useEffect(() => {
    fetchServices()
  }, [])

  // Auto-refresh services every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchServices(true)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchServices])

  useEffect(() => {
    if (formData.serviceId) {
      fetchSubServices(formData.serviceId)
    } else {
      setSubServices([])
      setFormData((prev) => ({ ...prev, subServiceId: '' }))
    }
  }, [formData.serviceId, fetchSubServices])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      // Update the required fields validation:
      const requiredFields = [
        'fullName',
        'emailAddress',
        'phoneNumber',
        'serviceId',
      ]
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData].trim()
      )

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(', ')}`
        )
      }

      // Enhanced email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(formData.emailAddress.trim())) {
        throw new Error('Please enter a valid email address')
      }

      // Enhanced phone validation
      const phoneRegex = /^[+]?[0-9\-\s()]{10,}$/
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        throw new Error('Please enter a valid phone number (minimum 10 digits)')
      }

      // Name validation
      if (formData.fullName.trim().length < 2) {
        throw new Error('Please enter a valid full name (minimum 2 characters)')
      }

      const bookingId = `BK-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`

      // Add service information to booking data:
      const selectedService = services.find((s) => s._id === formData.serviceId)
      const selectedSubService = subServices.find(
        (s) => s._id === formData.subServiceId
      )

      const bookingData = {
        bookingId,
        fullName: formData.fullName.trim(),
        emailAddress: formData.emailAddress.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        serviceId: formData.serviceId,
        serviceName: selectedService?.name || 'Contact Inquiry',
        subServiceId: formData.subServiceId,
        subServiceName: selectedSubService?.name || '',
        subServicePrice: selectedSubService?.price || 0,
        notes: `Contact form submission - Customer requesting ${
          selectedService?.name || 'information'
        }${
          selectedSubService ? ` - ${selectedSubService.name}` : ''
        }. Contact details: Name: ${formData.fullName.trim()}, Email: ${formData.emailAddress.trim()}, Phone: ${formData.phoneNumber.trim()}`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      }

      console.log('Submitting booking data:', bookingData)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      // Success handling
      setSubmitStatus('success')
      setSubmitMessage(
        `Thank you ${
          formData.fullName.split(' ')[0]
        }! Your request has been submitted successfully. We'll contact you within 24 hours. Your reference ID is: ${
          result.bookingId || bookingId
        }`
      )

      // Reset form after 6 seconds
      setTimeout(() => {
        setFormData({
          fullName: '',
          emailAddress: '',
          phoneNumber: '',
          serviceId: '',
          subServiceId: '',
        })
        setSubmitStatus('idle')
        setSubmitMessage('')
      }, 6000)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')

      if (error instanceof Error) {
        setSubmitMessage(error.message)
      } else {
        setSubmitMessage(
          'An unexpected error occurred. Please try again or contact us directly.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Header />
      <section
        id='booking'
        className='py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-teal-50 via-slate-50 to-orange-50'
      >
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-8 sm:mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-4'>
              Get In Touch
            </h2>
            <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto'>
              Ready to get started? Fill out the form below and we'll get back
              to you with a personalized quote and consultation.
            </p>
          </div>

          {/* Booking Form */}
          <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
            <form onSubmit={handleSubmit}>
              {/* Status Messages */}
              {submitStatus !== 'idle' && (
                <div
                  className={`mb-6 p-4 rounded-lg border ${
                    submitStatus === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className='flex items-start'>
                    {submitStatus === 'success' ? (
                      <svg
                        className='w-5 h-5 mr-2 mt-0.5 flex-shrink-0'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-5 h-5 mr-2 mt-0.5 flex-shrink-0'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                    <div>
                      <span className='font-medium text-sm sm:text-base'>
                        {submitMessage}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                    Contact Information
                  </h3>
                  <p className='text-gray-600 text-sm sm:text-base'>
                    Please provide your details so we can get in touch with you
                  </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                  <div className='sm:col-span-2 lg:col-span-1'>
                    <label
                      htmlFor='fullName'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Full Name *
                    </label>
                    <input
                      type='text'
                      id='fullName'
                      name='fullName'
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base'
                      placeholder='Enter your full name'
                    />
                  </div>

                  <div className='sm:col-span-2 lg:col-span-1'>
                    <label
                      htmlFor='emailAddress'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='emailAddress'
                      name='emailAddress'
                      required
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base'
                      placeholder='your.email@example.com'
                    />
                  </div>

                  <div className='sm:col-span-2 lg:col-span-1'>
                    <label
                      htmlFor='phoneNumber'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      id='phoneNumber'
                      name='phoneNumber'
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base'
                      placeholder='+977-XXXXXXXXX'
                    />
                  </div>

                  {/* Service selection with refresh button */}
                  <div className='sm:col-span-2 lg:col-span-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <label
                        htmlFor='serviceId'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Service Type *
                      </label>
                      <div className='flex items-center space-x-2'>
                        {lastUpdated && (
                          <span className='text-xs text-gray-500'>
                            Updated: {lastUpdated.toLocaleTimeString()}
                          </span>
                        )}
                        <button
                          type='button'
                          onClick={handleRefreshServices}
                          disabled={isRefreshing || isLoadingServices}
                          className='inline-flex items-center px-2 py-1 text-xs font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                          <svg
                            className={`w-3 h-3 mr-1 ${
                              isRefreshing ? 'animate-spin' : ''
                            }`}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                            />
                          </svg>
                          {isRefreshing ? 'Updating...' : 'Refresh'}
                        </button>
                      </div>
                    </div>
                    <select
                      id='serviceId'
                      name='serviceId'
                      required
                      value={formData.serviceId}
                      onChange={handleInputChange}
                      disabled={isLoadingServices || !!serviceError}
                      className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed'
                    >
                      <option value=''>
                        {isLoadingServices
                          ? 'Loading services...'
                          : 'Select a service'}
                      </option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} - {service.category}
                        </option>
                      ))}
                    </select>
                    {serviceError && (
                      <div className='mt-2 flex items-center justify-between'>
                        <p className='text-sm text-red-600'>{serviceError}</p>
                        <button
                          type='button'
                          onClick={handleRefreshServices}
                          className='text-sm text-teal-600 hover:text-teal-700 underline'
                        >
                          Try again
                        </button>
                      </div>
                    )}
                    {services.length === 0 &&
                      !isLoadingServices &&
                      !serviceError && (
                        <p className='mt-1 text-sm text-gray-500'>
                          No services available. Please contact us directly or
                          try refreshing.
                        </p>
                      )}
                  </div>

                  {/* Sub-service selection */}
                  {formData.serviceId && subServices.length > 0 && (
                    <div className='sm:col-span-2 lg:col-span-3'>
                      <label
                        htmlFor='subServiceId'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Specific Service (Optional)
                      </label>
                      <select
                        id='subServiceId'
                        name='subServiceId'
                        value={formData.subServiceId}
                        onChange={handleInputChange}
                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base'
                      >
                        <option value=''>
                          Choose specific service (optional)
                        </option>
                        {subServices.map((subService) => (
                          <option key={subService._id} value={subService._id}>
                            {subService.name} - ${subService.price} (
                            {subService.priceType})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Service Information Display */}
                  {formData.serviceId && (
                    <div className='sm:col-span-2 lg:col-span-3'>
                      <div className='bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-teal-200'>
                        <h4 className='text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3'>
                          Selected Service
                        </h4>
                        <div className='space-y-2 text-sm sm:text-base'>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Service:
                            </span>{' '}
                            <span className='text-gray-900'>
                              {
                                services.find(
                                  (s) => s._id === formData.serviceId
                                )?.name
                              }
                            </span>
                          </div>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Category:
                            </span>{' '}
                            <span className='text-gray-900'>
                              {
                                services.find(
                                  (s) => s._id === formData.serviceId
                                )?.category
                              }
                            </span>
                          </div>
                          <div>
                            <span className='font-medium text-gray-700'>
                              Description:
                            </span>{' '}
                            <span className='text-gray-900'>
                              {
                                services.find(
                                  (s) => s._id === formData.serviceId
                                )?.description
                              }
                            </span>
                          </div>
                          {formData.subServiceId && (
                            <div className='mt-3 pt-3 border-t border-teal-200'>
                              <div>
                                <span className='font-medium text-gray-700'>
                                  Specific Service:
                                </span>{' '}
                                <span className='text-gray-900'>
                                  {
                                    subServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.name
                                  }
                                </span>
                              </div>
                              <div>
                                <span className='font-medium text-gray-700'>
                                  Description:
                                </span>{' '}
                                <span className='text-gray-900'>
                                  {
                                    subServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.description
                                  }
                                </span>
                              </div>
                              <div>
                                <span className='font-medium text-gray-700'>
                                  Price:
                                </span>{' '}
                                <span className='text-green-600 font-semibold'>
                                  $
                                  {
                                    subServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.price
                                  }{' '}
                                  (
                                  {
                                    subServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.priceType
                                  }
                                  )
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className='mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200'>
                <button
                  type='submit'
                  disabled={isSubmitting || isLoadingServices || !!serviceError}
                  className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                    isSubmitting || isLoadingServices || !!serviceError
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className='flex items-center justify-center'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className='text-center mt-8 sm:mt-12'>
            <p className='text-gray-600 mb-4 text-sm sm:text-base'>
              Prefer to contact us directly? We're here to help!
            </p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto'>
              <a
                href='tel:+977-9851331114'
                className='inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-teal-500 text-teal-600 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300 text-sm sm:text-base'
              >
                <svg
                  className='w-4 h-4 sm:w-5 sm:h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                Call: 0452272533
              </a>
              <a
                href='mailto:info@himalayaremovals.com.np'
                className='inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm sm:text-base'
              >
                <svg
                  className='w-4 h-4 sm:w-5 sm:h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
