"use client"

import type React from "react"
import { useState } from "react"

export default function AdminLogin() {
  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Basic validation
      if (emailOrUsername === "admin@removal.com" && password === "admin123") {
        console.log("Login successful")
        // Handle successful login here
      } else {
        setError("Invalid email/username or password")
      }
    } catch {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00998c]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00b3a6]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-40 w-60 h-60 bg-[#00ccbf]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl relative z-10">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00998c] via-[#00b3a6] to-[#00ccbf] rounded-3xl opacity-75"></div>
          <div className="absolute inset-[2px] bg-white rounded-3xl"></div>

          <div className="relative z-10">
            {/* Header Section */}
            <div className="px-6 py-8 sm:px-8 sm:py-10 text-center bg-gradient-to-b from-white to-[#00998c]/5">
              {/* Logo/Icon */}
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00998c] to-[#007a6e] rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00b3a6] to-[#006b5f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10 drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#00998c] to-[#007a6e] bg-clip-text text-transparent mb-3">
                Admin Portal
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                Secure access to your removal service dashboard
              </p>
            </div>

            {/* Form Section */}
            <div className="px-6 py-8 sm:px-8 sm:py-10 bg-gradient-to-b from-primary-50/30 to-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Email/Username Field */}
                <div className="space-y-2">
                  <label htmlFor="emailOrUsername" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or Username
                  </label>
                  <div className="relative group">
                    <input
                      id="emailOrUsername"
                      type="text"
                      placeholder="admin@removal.com or admin"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base
                               focus:ring-4 focus:ring-[#00998c]/20 focus:border-[#00998c] transition-all duration-300
                               placeholder-gray-400 bg-white/80 hover:border-[#00998c]/50 hover:bg-white
                               group-hover:shadow-md"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00998c]/10 to-[#00b3a6]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl text-sm sm:text-base
                               focus:ring-4 focus:ring-[#00998c]/20 focus:border-[#00998c] transition-all duration-300
                               placeholder-gray-400 bg-white/80 hover:border-[#00998c]/50 hover:bg-white
                               group-hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00998c] 
                               transition-colors duration-200 p-2 rounded-lg hover:bg-[#00998c]/10"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00998c]/10 to-[#00b3a6]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-[#00998c] border-2 border-gray-300 rounded-md focus:ring-[#00998c]/30 focus:ring-2 transition-all duration-200"
                      />
                    </div>
                    <label htmlFor="remember" className="text-sm text-gray-700 select-none font-medium">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-[#00998c] hover:text-[#007a6e] font-semibold transition-colors duration-200 text-left sm:text-right hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#00998c] to-[#007a6e] hover:from-[#007a6e] hover:to-[#006b5f] 
                           disabled:from-[#00998c]/70 disabled:to-[#007a6e]/70 text-white font-bold 
                           py-4 px-6 rounded-xl text-sm sm:text-base transition-all duration-300 
                           transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none
                           shadow-lg hover:shadow-xl hover:shadow-[#00998c]/25 disabled:shadow-md relative overflow-hidden group
                           border border-[#00998c]/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00998c]/10 via-transparent to-[#00998c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="relative z-10 drop-shadow-sm">Sign In to Dashboard</span>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-[#00998c]/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#00998c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <p className="text-center font-medium">
                    Authorized personnel only. All access is monitored and logged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info for Mobile */}
        <div className="mt-6 text-center sm:hidden">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2">
            For the best experience, use landscape mode on mobile devices
          </p>
        </div>
      </div>
    </div>
  )
}
