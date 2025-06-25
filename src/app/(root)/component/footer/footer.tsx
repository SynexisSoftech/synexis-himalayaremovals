import { Facebook, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="text-gray-800" style={{ backgroundColor: "#d0f2ed" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white-500 to-white-600 rounded-lg flex items-center justify-center">
                              <Image
                                                  src="/logo.png"
                                                  width={90}
                                                  height={120}
                                                  alt="Moving truck and team"
                                                  className=" object-cover"
                                                />
                
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">HIMALAYA</h3>
                <p className="text-sm text-teal-600 font-semibold">REMOVALS</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Your trusted moving partner in Australia. We provide professional, reliable, and affordable moving
              solutions for all your relocation needs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1BGWCFJSdc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Facebook color="white" />
              </a>
               <a
                href="https://www.instagram.com/himalayaremovals?igsh=MWZ4cHJsN2xteW90bg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Instagram color="white"/>
              </a>


            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-teal-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ourservice" className="text-gray-600 hover:text-teal-600 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-600 hover:text-teal-600 transition-colors">
                  Booking
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Our Services</h4>
            <ul className="space-y-2">
              <li>
                Local Move
               
              </li>
              <li>
                Interstate Move
              </li>
              <li>
               Rubbish Removal
              </li>      
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-gray-700">Australia</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-teal-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="text-gray-700">0452272533</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-teal-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-700">himalayaremovals7@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
