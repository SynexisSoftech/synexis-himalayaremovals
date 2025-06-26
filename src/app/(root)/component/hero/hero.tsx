"use client"

import Image from "next/image"
import Link from "next/link"
import BookingForm from "../booking/book"


// interface FAQItem {
//   question: string
//   answer: string
// }

export default function Hero() {
  
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
        <BookingForm />
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
                  Call 0452272533
                </button>
              </div>
            </div>
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
