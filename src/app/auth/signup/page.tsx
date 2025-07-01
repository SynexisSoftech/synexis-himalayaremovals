
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-xs sm:text-sm text-gray-600 ml-265">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00998c] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            {/* Sign up form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#068f83] mb-2">Create Your Account</h1>
                <p className="text-sm sm:text-base text-gray-600">Start your moving journey with us today</p>
              </div>

              <form className="space-y-4 sm:space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Postcode */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                    Postcode/ZIP
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter postcode"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Create password"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-orange-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <input
                      id="marketing"
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="marketing" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Send me moving tips and special offers via email
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#00998c] hover:bg-[#068f83] text-white font-semibold py-3 sm:py-4 px-4 rounded-md text-sm sm:text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Create Account
                </button>
              </form>

              {/* Footer text */}
              <div className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
                By signing up, you&apos;ll get instant access to free moving quotes and our customer portal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
