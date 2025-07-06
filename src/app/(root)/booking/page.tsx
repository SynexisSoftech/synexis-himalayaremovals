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
  estimatedDuration?: string
  features: string[]
  isActive: boolean
}

interface SubServiceWithService extends SubService {
  serviceName: string
  serviceCategory: string
}

export default function BookingSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    serviceId: '',
    subServiceId: '',
    selectedType: 'service' as 'service' | 'subservice', // Track what user selected
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // Add these new state variables after the existing ones:
  const [services, setServices] = useState<Service[]>([])
  const [allSubServices, setAllSubServices] = useState<SubServiceWithService[]>(
    []
  )
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch all services and sub-services
  const fetchAllServicesAndSubServices = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true)
        } else {
          setIsLoadingServices(true)
        }
        setServiceError(null)

        // Fetch services
        const servicesResponse = await fetch('/api/admin/services', {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (!servicesResponse.ok) {
          throw new Error('Failed to load services')
        }

        const servicesData = await servicesResponse.json()
        const activeServices = servicesData.services.filter(
          (service: Service) => service.isActive
        )
        setServices(activeServices)

        // Fetch all sub-services for all services
        const allSubServicesPromises = activeServices.map(
          async (service: Service) => {
            try {
              const subServicesResponse = await fetch(
                `/api/admin/services/${service._id}/sub-services`,
                {
                  headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                  },
                }
              )

              if (subServicesResponse.ok) {
                const subServicesData = await subServicesResponse.json()
                return subServicesData.subServices
                  .filter((subService: SubService) => subService.isActive)
                  .map((subService: SubService) => ({
                    ...subService,
                    serviceName: service.name,
                    serviceCategory: service.category,
                  }))
              }
              return []
            } catch (error) {
              console.error(
                `Error fetching sub-services for ${service.name}:`,
                error
              )
              return []
            }
          }
        )

        const allSubServicesArrays = await Promise.all(allSubServicesPromises)
        const flattenedSubServices = allSubServicesArrays.flat()
        setAllSubServices(flattenedSubServices)

        setLastUpdated(new Date())

        // Reset selections if they're no longer available
        if (
          formData.serviceId &&
          !activeServices.find((s: Service) => s._id === formData.serviceId)
        ) {
          setFormData((prev) => ({
            ...prev,
            serviceId: '',
            subServiceId: '',
            selectedType: 'service',
          }))
        }
        if (
          formData.subServiceId &&
          !flattenedSubServices.find(
            (ss: SubServiceWithService) => ss._id === formData.subServiceId
          )
        ) {
          setFormData((prev) => ({
            ...prev,
            subServiceId: '',
            selectedType: 'service',
          }))
        }
      } catch (error) {
        setServiceError('Unable to load services. Please try again later.')
        console.error('Error fetching services:', error)
      } finally {
        setIsLoadingServices(false)
        setIsRefreshing(false)
      }
    },
    [formData.serviceId, formData.subServiceId]
  )

  // Manual refresh function
  const handleRefreshServices = () => {
    fetchAllServicesAndSubServices(true)
  }

  useEffect(() => {
    fetchAllServicesAndSubServices()
  }, [])

  // Auto-refresh services every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllServicesAndSubServices(true)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchAllServicesAndSubServices])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleServiceSelect = (serviceId: string) => {
    setFormData({
      ...formData,
      serviceId,
      subServiceId: '', // Reset sub-service when service changes
      selectedType: 'service',
    })
  }

  const handleSubServiceSelect = (subServiceId: string) => {
    const selectedSubService = allSubServices.find(
      (ss) => ss._id === subServiceId
    )
    setFormData({
      ...formData,
      serviceId: selectedSubService?.serviceId || '',
      subServiceId,
      selectedType: 'subservice',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      // Update the required fields validation:
      const requiredFields = ['fullName', 'emailAddress', 'phoneNumber']
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData].trim()
      )

      // Check if either service or sub-service is selected
      // Check if main service is selected (required)
      if (!formData.serviceId) {
        missingFields.push('main service selection')
      }

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

      // Get service and sub-service information
      let selectedService: Service | undefined
      let selectedSubService: SubServiceWithService | undefined

      if (formData.selectedType === 'subservice' && formData.subServiceId) {
        selectedSubService = allSubServices.find(
          (s) => s._id === formData.subServiceId
        )
        selectedService = services.find(
          (s) => s._id === selectedSubService?.serviceId
        )
      } else if (formData.serviceId) {
        selectedService = services.find((s) => s._id === formData.serviceId)
      }

      const bookingData = {
        bookingId,
        fullName: formData.fullName.trim(),
        emailAddress: formData.emailAddress.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        serviceId: selectedService?._id || '',
        serviceName: selectedService?.name || 'Contact Inquiry',
        subServiceId: selectedSubService?._id || '',
        subServiceName: selectedSubService?.name || '',
        subServicePrice: selectedSubService?.price || 0,
        notes: `Contact form submission - Customer requesting ${
          selectedSubService
            ? `${selectedSubService.name} (${selectedSubService.serviceName})`
            : selectedService?.name || 'information'
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
          selectedType: 'service',
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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-8 sm:mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-4'>
              Get In Touch
            </h2>
            <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto'>
              Ready to get started? Choose from our services or specific
              offerings below, then we'll get back to you with a personalized
              quote.
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
              <div className='space-y-8'>
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
                </div>

                {/* Service Selection */}
                <div>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h3 className='text-xl sm:text-2xl font-bold text-gray-800'>
                        Choose Your Service
                      </h3>
                      <p className='text-gray-600 text-sm sm:text-base mt-1'>
                        {!formData.serviceId
                          ? 'First select a main service category'
                          : 'Now choose a specific service option'}
                      </p>
                    </div>
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

                  {isLoadingServices ? (
                    <div className='text-center py-12'>
                      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
                      <p className='mt-4 text-gray-600'>Loading services...</p>
                    </div>
                  ) : serviceError ? (
                    <div className='text-center py-12'>
                      <p className='text-red-600 mb-4'>{serviceError}</p>
                      <button
                        type='button'
                        onClick={handleRefreshServices}
                        className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Step 1: Main Services Selection */}
                      {services.length > 0 && (
                        <div className='mb-8'>
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center'>
                              <div className='flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full text-sm font-bold mr-3'>
                                1
                              </div>
                              <h4 className='text-lg sm:text-xl font-bold text-gray-800'>
                                Select Main Service Category
                              </h4>
                            </div>
                            {formData.serviceId && (
                              <button
                                type='button'
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    serviceId: '',
                                    subServiceId: '',
                                    selectedType: 'service',
                                  }))
                                }
                                className='text-sm text-gray-500 hover:text-gray-700 underline'
                              >
                                Change Selection
                              </button>
                            )}
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {services.map((service) => (
                              <div
                                key={service._id}
                                onClick={() => handleServiceSelect(service._id)}
                                className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                                  formData.serviceId === service._id
                                    ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg scale-105'
                                    : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50'
                                }`}
                              >
                                <div className='flex items-start justify-between mb-3'>
                                  <h5 className='font-bold text-gray-900 text-sm sm:text-base leading-tight'>
                                    {service.name}
                                  </h5>
                                  <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full ml-2'>
                                    {service.category}
                                  </span>
                                </div>
                                <p className='text-gray-600 text-xs sm:text-sm mb-4'>
                                  {service.description}
                                </p>
                                <div className='flex items-center justify-between'>
                                  <span className='text-xs text-gray-500'>
                                    Click to select
                                  </span>
                                  {formData.serviceId === service._id && (
                                    <div className='flex items-center text-teal-600'>
                                      <svg
                                        className='w-4 h-4'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                      <span className='ml-1 text-xs font-medium'>
                                        Selected
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Sub-Services Selection (only show when main service is selected) */}
                      {formData.serviceId && (
                        <div className='mb-8'>
                          <div className='flex items-center mb-4'>
                            <div className='flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold mr-3'>
                              2
                            </div>
                            <div>
                              <h4 className='text-lg sm:text-xl font-bold text-gray-800'>
                                Choose Specific Service
                              </h4>
                              <p className='text-sm text-gray-600'>
                                Select from available options for "
                                {
                                  services.find(
                                    (s) => s._id === formData.serviceId
                                  )?.name
                                }
                                " or skip to discuss directly
                              </p>
                            </div>
                          </div>

                          {/* Loading sub-services */}
                          {isLoadingServices ? (
                            <div className='text-center py-8'>
                              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto'></div>
                              <p className='mt-2 text-gray-600'>
                                Loading specific services...
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Sub-Service Cards */}
                              {allSubServices.filter(
                                (ss) => ss.serviceId === formData.serviceId
                              ).length > 0 ? (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                                  {allSubServices
                                    .filter(
                                      (ss) =>
                                        ss.serviceId === formData.serviceId
                                    )
                                    .map((subService) => (
                                      <div
                                        key={subService._id}
                                        onClick={() =>
                                          handleSubServiceSelect(subService._id)
                                        }
                                        className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                                          formData.subServiceId ===
                                          subService._id
                                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105'
                                            : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                                        }`}
                                      >
                                        {/* Header with name and price */}
                                        <div className='flex items-start justify-between mb-3'>
                                          <div className='flex-1'>
                                            <h5 className='font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1'>
                                              {subService.name}
                                            </h5>
                                            <span className='inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                                              {subService.serviceCategory}
                                            </span>
                                          </div>
                                          <div className='text-right ml-3'>
                                            <div className='flex flex-col items-end'>
                                              <span className='px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full'>
                                                ${subService.price}
                                              </span>
                                              <span className='text-xs text-gray-500 mt-1 capitalize'>
                                                {subService.priceType}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Description */}
                                        <p className='text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3'>
                                          {subService.description}
                                        </p>

                                        {/* Duration */}
                                        {subService.estimatedDuration && (
                                          <div className='flex items-center mb-3'>
                                            <svg
                                              className='w-4 h-4 text-orange-500 mr-2 flex-shrink-0'
                                              fill='none'
                                              stroke='currentColor'
                                              viewBox='0 0 24 24'
                                            >
                                              <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                              />
                                            </svg>
                                            <span className='text-xs sm:text-sm text-gray-600 font-medium'>
                                              {subService.estimatedDuration}
                                            </span>
                                          </div>
                                        )}

                                        {/* Features */}
                                        {subService.features.length > 0 && (
                                          <div className='mb-4'>
                                            <p className='text-xs font-semibold text-gray-700 mb-2'>
                                              Includes:
                                            </p>
                                            <div className='flex flex-wrap gap-1'>
                                              {subService.features
                                                .slice(0, 3)
                                                .map((feature, index) => (
                                                  <span
                                                    key={index}
                                                    className='px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200'
                                                  >
                                                    ✓ {feature}
                                                  </span>
                                                ))}
                                              {subService.features.length >
                                                3 && (
                                                <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200'>
                                                  +
                                                  {subService.features.length -
                                                    3}{' '}
                                                  more
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {/* Selection indicator */}
                                        <div className='flex items-center justify-between pt-3 border-t border-gray-200'>
                                          {formData.subServiceId ===
                                          subService._id ? (
                                            <div className='flex items-center text-orange-600'>
                                              <svg
                                                className='w-5 h-5 mr-2'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                              >
                                                <path
                                                  fillRule='evenodd'
                                                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                                  clipRule='evenodd'
                                                />
                                              </svg>
                                              <span className='text-sm font-bold'>
                                                Selected
                                              </span>
                                            </div>
                                          ) : (
                                            <span className='text-xs text-gray-500'>
                                              Click to select
                                            </span>
                                          )}

                                          <div className='flex items-center'>
                                            <span className='text-xs text-gray-400'>
                                              {subService.priceType === 'fixed'
                                                ? 'One-time'
                                                : subService.priceType ===
                                                  'hourly'
                                                ? 'Per hour'
                                                : subService.priceType ===
                                                  'per_item'
                                                ? 'Per item'
                                                : 'Custom'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className='text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
                                  <svg
                                    className='w-12 h-12 text-gray-400 mx-auto mb-4'
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
                                  <p className='text-gray-500 text-lg font-medium'>
                                    No specific services available
                                  </p>
                                  <p className='text-gray-400 text-sm mt-1'>
                                    No sub-services have been configured for
                                    this service yet.
                                  </p>
                                </div>
                              )}

                              {/* Skip Option - Always show when main service is selected */}
                              <div className='flex justify-center'>
                                <div
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      subServiceId: '',
                                      selectedType: 'service',
                                    }))
                                  }
                                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md max-w-md w-full ${
                                    formData.subServiceId === ''
                                      ? 'border-gray-500 bg-gray-100 shadow-md'
                                      : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className='text-center'>
                                    <div className='flex items-center justify-center mb-2'>
                                      <svg
                                        className='w-5 h-5 text-gray-600 mr-2'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                      >
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                                        />
                                      </svg>
                                      <h5 className='font-semibold text-gray-800'>
                                        Discuss My Needs
                                      </h5>
                                    </div>
                                    <p className='text-sm text-gray-600 mb-2'>
                                      Skip specific selection - I'll discuss my
                                      requirements directly
                                    </p>
                                    {formData.subServiceId === '' && (
                                      <div className='flex items-center justify-center text-gray-600'>
                                        <svg
                                          className='w-4 h-4 mr-1'
                                          fill='currentColor'
                                          viewBox='0 0 20 20'
                                        >
                                          <path
                                            fillRule='evenodd'
                                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                            clipRule='evenodd'
                                          />
                                        </svg>
                                        <span className='text-sm font-medium'>
                                          Selected
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* No services message */}
                      {services.length === 0 && (
                        <div className='text-center py-12'>
                          <p className='text-gray-500 text-lg'>
                            No services available at the moment.
                          </p>
                          <p className='text-gray-400 text-sm mt-2'>
                            Please contact us directly for assistance.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Selected Service Summary */}
                  {formData.serviceId && (
                    <div className='mt-8 bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-teal-200'>
                      <h4 className='text-base sm:text-lg font-semibold text-gray-800 mb-3'>
                        Your Selection Summary
                      </h4>
                      <div className='space-y-2 text-sm sm:text-base'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-gray-700'>
                            Main Service:
                          </span>
                          <span className='text-gray-900'>
                            {
                              services.find((s) => s._id === formData.serviceId)
                                ?.name
                            }
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-gray-700'>
                            Category:
                          </span>
                          <span className='text-gray-900'>
                            {
                              services.find((s) => s._id === formData.serviceId)
                                ?.category
                            }
                          </span>
                        </div>
                        {formData.subServiceId ? (
                          <>
                            <div className='border-t border-teal-200 pt-2 mt-3'>
                              <div className='flex items-center justify-between'>
                                <span className='font-medium text-gray-700'>
                                  Specific Service:
                                </span>
                                <span className='text-gray-900'>
                                  {
                                    allSubServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.name
                                  }
                                </span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <span className='font-medium text-gray-700'>
                                  Price:
                                </span>
                                <span className='text-green-600 font-semibold'>
                                  $
                                  {
                                    allSubServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.price
                                  }{' '}
                                  (
                                  {
                                    allSubServices.find(
                                      (s) => s._id === formData.subServiceId
                                    )?.priceType
                                  }
                                  )
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className='border-t border-teal-200 pt-2 mt-3'>
                            <div className='text-sm text-gray-600'>
                              <span className='font-medium'>Selection:</span>{' '}
                              General service inquiry - We'll discuss specific
                              details and pricing with you directly.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <button
                  type='submit'
                  disabled={
                    isSubmitting ||
                    isLoadingServices ||
                    !!serviceError ||
                    !formData.serviceId // Only require main service selection
                  }
                  className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                    isSubmitting ||
                    isLoadingServices ||
                    !!serviceError ||
                    !formData.serviceId // Only require main service selection
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
                    'Submit Request'
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
      {/* Add enhanced styling */}
      <style jsx global>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
