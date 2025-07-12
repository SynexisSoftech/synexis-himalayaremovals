"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "services", label: "Services", href: "/ourservice" },
    { id: "booking", label: "Booking", href: "/booking" },
     { id: "blog", label: "Blog", href: "/blog" },
    { id: "contact", label: "Contact", href: "/contact" },
    { id: "pest Control", label: "Pest Control", href: "/pestcontrol" },
   
  ]

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation handler
  const handleNavigation = (href: string) => {
    router.push(href)
    setIsMenuOpen(false)
  }

  // Check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href
  }

  return (
    <>
      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes underline-expand {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 5px rgba(20, 184, 166, 0.5); }
          50% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.8); }
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #14b8a6, #14b8a6);
          transition: width 0.3s ease;
          border-radius: 1px;
        }
        
        .nav-item:hover::after {
          width: 100%;
        }
        
        .nav-item.active::after {
          width: 100%;
          background: linear-gradient(90deg, #0d9488, #14b8a6);
          height: 3px;
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .mobile-nav-item {
          position: relative;
        }
        
        .mobile-nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 100%;
          background: linear-gradient(90deg, rgba(20, 184, 166, 0.1), rgba(249, 115, 22, 0.1));
          transition: width 0.3s ease;
          border-radius: 8px;
          z-index: -1;
        }
        
        .mobile-nav-item:hover::before {
          width: 100%;
        }
      `}</style>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-md bg-white/95 shadow-xl" : "bg-white shadow-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavigation("/")}>
              <Image src="/logo.png" width={90} height={120} alt="Moving truck and team" className="object-cover" />
              <div className="group-hover:scale-105 transition-transform duration-300">
                <h1 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                  HIMALAYA
                </h1>
                <p className="text-sm text-teal-600 font-semibold">PEST CONTROL</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`nav-item text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 py-2 focus:outline-none ${
                    isActive(item.href) ? "active text-teal-700 font-semibold" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm rounded-b-lg shadow-lg">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`mobile-nav-item text-left text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 px-4 py-2 rounded-lg focus:outline-none ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-teal-50 to-green-50 text-teal-700 font-semibold border-l-4 border-teal-500"
                        : ""
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
