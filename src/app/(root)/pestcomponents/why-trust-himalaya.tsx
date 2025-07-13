import Image from "next/image"

export default function WhyTrustHimalaya() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gray-50 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Trust Himalaya Pest Control?</h2>
          <div className="w-20 h-1 bg-[#03a396] mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Reason 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-6">
              <Image
                src="/certified.png?height=64&width=64"
                alt="Certified technician icon"
                width={64}
                height={64}
                className="w-20 h-20 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-45"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Certified & Experienced Technicians</h3>
            <p className="text-gray-600 leading-relaxed">
              Our team comprises highly trained and certified professionals with years of experience in effective pest
              management.
            </p>
          </div>
          {/* Reason 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-6">
              <Image
                src="/ecofriendly.png?height=64&width=64"
                alt="Eco-friendly leaf icon"
                width={64}
                height={64}
                className="w-20 h-20 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-45"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Eco-Friendly & Safe Treatments</h3>
            <p className="text-gray-600 leading-relaxed">
              We prioritize the safety of your family and pets by using environmentally responsible and non-toxic pest
              control methods.
            </p>
          </div>
          {/* Reason 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-6">
              <Image
                src="/advancetechnology.png?height=64&width=64"
                alt="Advanced technology icon"
                width={64}
                height={64}
                className="w-20 h-20 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-45"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Advanced Technology & Tools</h3>
            <p className="text-gray-600 leading-relaxed">
              Utilizing the latest innovations and state-of-the-art equipment for precise detection and efficient
              eradication of pests.
            </p>
          </div>
          {/* Reason 4 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-6">
              <Image
                src="/quick.png?height=64&width=64"
                alt="Quick response icon"
                width={64}
                height={64}
                className="w-20 h-20 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-45"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Quick Response & Reliable Support</h3>
            <p className="text-gray-600 leading-relaxed">
              We offer prompt service and dependable support, ensuring your pest problems are addressed swiftly and
              effectively.
            </p>
          </div>
        </div>
      </div>
      {/* Floating Call Now Button */}
    </section>
  )
}
