"use client"

import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { useState } from "react"

interface FormData {
  fromLocation: string
  toLocation: string
  name: string
  phone: string
  email: string
  movingDate: string
}

interface FormErrors {
  service?: string
  fromLocation?: string
  toLocation?: string
  name?: string
  phone?: string
  email?: string
  movingDate?: string
}

interface FAQItem {
  question: string
  answer: string
}

export default function Hero() {
  const [selectedService, setSelectedService] = useState("household")
  const [formData, setFormData] = useState<FormData>({
    fromLocation: "",
    toLocation: "",
    name: "",
    phone: "",
    email: "",
    movingDate: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const services = [
    { id: "household", label: "Household Moving" },
    { id: "office", label: "Office Moving" },
    { id: "storage", label: "Storage" },
  ]

  const faqData: FAQItem[] = [
    {
      question: "How far in advance should I book my removal service?",
      answer:
        "We recommend booking your removal service at least 2-3 weeks in advance, especially during peak moving seasons (summer months and weekends). However, we also accommodate last-minute bookings based on availability.",
    },
    {
      question: "What items cannot be moved by your removal service?",
      answer:
        "We cannot transport hazardous materials including flammable liquids, explosives, corrosive substances, perishable food items, plants, pets, and valuable documents. We'll provide you with a complete list during your consultation.",
    },
    {
      question: "Do you provide packing materials and services?",
      answer:
        "Yes! We offer comprehensive packing services including high-quality boxes, bubble wrap, packing paper, and protective materials. Our professional team can pack your entire home or office, or you can choose to pack some items yourself.",
    },
    {
      question: "Are my belongings insured during the move?",
      answer:
        "Absolutely. All items are covered under our comprehensive insurance policy during transit. We also offer additional coverage options for high-value items. Our team will discuss insurance details during your consultation.",
    },
    {
      question: "How do you calculate the cost of removal services?",
      answer:
        "Our pricing is based on several factors including distance, volume of items, packing services required, and any special handling needs. We provide free, no-obligation quotes after assessing your specific requirements.",
    },
    {
      question: "Do you offer international removal services?",
      answer:
        "No, we only provide state removal services with proper documentation, customs clearance, and secure shipping. Our team handles all logistics to ensure your belongings reach their destination safely.",
    },
    {
      question: "What happens if my items are damaged during the move?",
      answer:
        "In the rare event of damage, we have a straightforward claims process. Document any damage immediately, contact our customer service team, and we'll work quickly to resolve the issue through our insurance coverage.",
    },
    {
      question: "Can you store my belongings if needed?",
      answer:
        "Yes, we offer secure storage solutions in our climate-controlled facilities. Whether you need short-term storage during your move or long-term storage solutions, we have flexible options to meet your needs.",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!selectedService) {
      newErrors.service = "Please select a service"
    }
    if (!formData.fromLocation.trim()) {
      newErrors.fromLocation = "From location is required"
    }
    if (!formData.toLocation.trim()) {
      newErrors.toLocation = "To location is required"
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.movingDate) {
      newErrors.movingDate = "Moving date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAndSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form on success
      setFormData({
        fromLocation: "",
        toLocation: "",
        name: "",
        phone: "",
        email: "",
        movingDate: "",
      })
      setSelectedService("household")
      setSubmitStatus("success")

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div>
      <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#f5fcfb" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-1">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  {"Don't Stress On Your Move Anymore"}{" "}
                </h1>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
                  Himalaya Removals Got It Covered!!!
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Professional moving services with dedication to excellence. We handle your belongings with care and
                  ensure a stress-free relocation experience.
                </p>
              </div>

              {/* Learn More Button - Navigate to About page */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Center Content - Hero Image */}
            <div className="relative lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/himalayatruck.png?height=400&width=400"
                  width={400}
                  height={400}
                  alt="Professional moving services"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 hidden sm:block">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-6 hidden sm:block">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="text-gray-800" style={{ backgroundColor: "#f5fcfb" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  MOVING ANYTHING TO EVERYWHERE <span className="text-amber-300">Globally</span>
                </h3>
                <p className="text-lg opacity-90">
                  Your trusted partner in all things moving.Local Move,Interstate move ,Rubbish Removal.Sydney Based.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-gray-800 shadow-2xl">
                <h4 className="text-xl font-bold mb-4 text-center">BOOK YOUR MOVE NOW</h4>

                {submitStatus === "success" && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <span className="font-semibold">Booking Confirmed!</span>
                    <p className="text-sm mt-1">{"We'll contact you shortly to confirm the details."}</p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <span className="font-semibold">Booking Failed.</span>
                    <p className="text-sm mt-1">Please try again or contact us directly.</p>
                  </div>
                )}

                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={selectedService === service.id}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm">{service.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="fromLocation"
                      placeholder="From Location *"
                      value={formData.fromLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.fromLocation ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.fromLocation && <p className="text-red-500 text-xs mt-1">{errors.fromLocation}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="toLocation"
                      placeholder="To Location *"
                      value={formData.toLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.toLocation ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.toLocation && <p className="text-red-500 text-xs mt-1">{errors.toLocation}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="date"
                      name="movingDate"
                      placeholder="Moving Date *"
                      value={formData.movingDate}
                      onChange={handleInputChange}
                      min={getTomorrowDate()}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.movingDate ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.movingDate && <p className="text-red-500 text-xs mt-1">{errors.movingDate}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={validateAndSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600"}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Book Now"
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  * Required fields. By booking, you agree to our terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f5fcfb" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Moving Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make your move simple and stress-free with our proven 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Contact */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/contact.png" width={90} height={90} alt="Contact us" className=" object-contain" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get in touch with us via phone, email, or our online form. We&apos;re available 24/7 to assist you.
              </p>
            </div>

            {/* Step 2: Get Estimate */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/estimate.png?" width={100} height={100} alt="Get estimate" className=" object-contain" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Estimate</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive a detailed, transparent quote based on your specific moving needs and requirements.
              </p>
            </div>

            {/* Step 3: Packing */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src="/packing.png?"
                    width={500}
                    height={500}
                    alt="Professional packing"
                    className=" object-contain"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Packing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our expert team carefully packs your belongings using high-quality materials and proven techniques.
              </p>
            </div>

            {/* Step 4: Delivery Safely */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image src="/herotruck.png" width={90} height={90} alt="Safe delivery" className=" object-contain" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Delivery Safely</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your items are transported securely and delivered to your new location with complete care and precision.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Experience our seamless moving process. Contact us today for a free consultation and personalized quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Start Your Move
                </button>
                <button className="border-2 border-teal-500 text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-300">
                  Call (555) 123-4567
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f5fcfb" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our removal services. Can&apos;t find what you&apos;re looking for?
              Contact us directly.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  <span
                    className={`text-teal-600 text-xl font-bold transition-transform duration-200 ${
                      openFAQ === index ? "transform rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
