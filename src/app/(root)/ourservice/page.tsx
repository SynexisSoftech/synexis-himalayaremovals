"use client"

import Link from "next/link"
import { useState } from "react"
import Footer from "../component/footer/footer"
import Header from "../component/header/header"


export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [comparedServices, setComparedServices] = useState<string[]>([])

  // Custom SVG Icons
  const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )

  const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    </svg>
  )

  const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )

  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const PhoneIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )

  const MailIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )

  const services = [
    
    {
      id: "loading-transportation",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Loading and Transportation Service Icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
      title: "Loading & Transportation",
      description:
        "Expert loading of furniture, boxes, and appliances. Local and interstate transportation with special equipment for heavy or fragile items.",
      features: ["Professional loading", "Local & interstate", "Special equipment", "Safe transportation"],
      duration: "3-6 hours",
      popularity: 98,
      testimonial: {
        name: "Mike Chen",
        rating: 5,
        comment: "The team was incredibly efficient and handled our piano with such care. Highly recommend!",
      },
    },
    {
      id: "Rubbish Removal",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Rubbish Removal Icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      title: "Rubbish Removal",
      description:
        "We clear your space, so you can enjoy a cleaner, clutter-free environment.",
      features: ["Short & long-term", "All Types of Waste Handled", "Climate controlled", "Eco-Friendly Disposal"],
      duration: "Flexible",
      popularity: 78,
      testimonial: {
        name: "David Park",
        rating: 5,
        comment: "Clean, secure facility. Perfect for our temporary storage needs during renovation.",
      },
    },
  
    {
      id: "office-commercial-moves",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Office and Commercial Moves Icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      title: "Office/Commercial Moves",
      description:
        "Specialized business relocation services including office equipment, files, and IT infrastructure. Minimal downtime for your business operations.",
      features: ["Business relocation", "Office equipment", "IT infrastructure", "Minimal downtime"],
      duration: "1-3 days",
      popularity: 85,
      testimonial: {
        name: "Robert Kim",
        rating: 5,
        comment: "Moved our entire office over the weekend. Zero downtime and everything was perfect!",
      },
    },
  ]

  const toggleServiceComparison = (serviceId: string) => {
    if (comparedServices.includes(serviceId)) {
      setComparedServices(comparedServices.filter((id) => id !== serviceId))
    } else if (comparedServices.length < 3) {
      setComparedServices([...comparedServices, serviceId])
    }
  }

  const ServiceRequestModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Request Service</h3>
          <button onClick={() => setShowRequestModal(false)} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Tell us more about your needs..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div>
      <Header />

      {/* Hero Section with Stats */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Professional Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive moving solutions tailored to meet all your relocation needs. From packing to unpacking, we
              handle every aspect of your move with care and professionalism.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">10,000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">99.8%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison Toggle */}
    

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-gradient-to-br from-slate-50 to-teal-50 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border group cursor-pointer ${
                  selectedService === service.id ? "border-teal-400 shadow-lg" : "border-gray-100 hover:border-teal-200"
                } ${comparedServices.includes(service.id) ? "ring-2 ring-orange-400" : ""}`}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                {/* Service Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-teal-600 group-hover:text-orange-500 transition-colors duration-300">
                    {service.icon}
                  </div>

                  {showComparison && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleServiceComparison(service.id)
                      }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        comparedServices.includes(service.id)
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-orange-200"
                      }`}
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Popularity Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">
                    {service.popularity}% Popular
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3" />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>

                <p className="text-gray-600 mb-4 leading-relaxed text-sm">{service.description}</p>

                {/* Service Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-700">
                    <ClockIcon className="w-4 h-4 mr-2 text-teal-500" />
                    {service.duration}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-teal-600 font-semibold">{service.price}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={`${service.id}-${featureIndex}`} className="flex items-center text-sm text-gray-700">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Expanded Content */}
                {selectedService === service.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <UsersIcon className="w-4 h-4 mr-2 text-teal-500" />
                        Customer Review
                      </h4>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-500 mr-2">
                          {[...Array(service.testimonial.rating)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4" />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{service.testimonial.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 italic">They packed everything so carefully! Not a single item was damaged during the move.</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors duration-300">
                        Book Now
                      </button>
                      <button className="flex-1 border border-teal-600 text-teal-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Comparison Table */}
      {showComparison && comparedServices.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Service Comparison</h3>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-teal-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Feature</th>
                      {comparedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return (
                          <th key={serviceId} className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                            {service?.title}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">Price</td>
                      {comparedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return (
                          <td key={serviceId} className="px-6 py-4 text-sm text-center text-teal-600 font-semibold">
                            {service?.price}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">Duration</td>
                      {comparedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return (
                          <td key={serviceId} className="px-6 py-4 text-sm text-center text-gray-600">
                            {service?.duration}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">Popularity</td>
                      {comparedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return (
                          <td key={serviceId} className="px-6 py-4 text-sm text-center">
                            <div className="flex items-center justify-center">
                              <div className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                                {service?.popularity}%
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and personalized quote for your moving needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quote"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Free Quote
            </Link>

            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span className="font-medium">0452272533</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-5 h-5" />
                <span className="font-medium">himalayaremovals7@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showRequestModal && <ServiceRequestModal />}
      <Footer />
    </div>
  )
}