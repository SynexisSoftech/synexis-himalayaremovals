"use client"

import { useState, useEffect } from "react"

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed right-4 bottom-6 z-[9999]
        w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12
        bg-gradient-to-r from-green-500 to-teal-500
        hover:from-green-600 hover:to-teal-600
        text-white rounded-full
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50
        group relative overflow-hidden
        animate-bounce-in
        hover:animate-pulse
      `}
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1.5rem",
        zIndex: 9999,
      }}
      aria-label="Go to top"
      title="Go to top"
    >
      {/* Background shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-full" />

      {/* Pulsing ring effect */}
      <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping opacity-75 group-hover:animate-pulse" />

      {/* Arrow Icon */}
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-300 relative z-10 group-hover:animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>

      {/* Click ripple effect */}
      <span className="absolute inset-0 rounded-full bg-white/30 scale-0 group-active:scale-100 transition-transform duration-200" />
    </button>
  )
}
