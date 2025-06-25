import Image from "next/image"
import Header from "../component/header/header"
import Footer from "../component/footer/footer"

export default function About() {
  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "1000+", label: "Successful Moves" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Customer Support" },
  ]

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Licensed & Insured",
      description: "Fully licensed and insured for your peace of mind",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "On-Time Service",
      description: "Punctual and reliable service every time",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Expert Team",
      description: "Trained professionals with years of experience",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Competitive Pricing",
      description: "Fair and transparent pricing with no hidden costs",
    },
  ]

  const teamMembers = [
    {
      name: "Sandesh tandukar",
      role: "Customer Relations Manager",
      bio: "We are Himalaya Removals. We offer local and interstate home removal services with: ✅ Professional Removalists ✅ Insurance ✅ Goods Handled with Care Message",
      image: "/sandesh.png?height=300&width=300",
    },
  ]

  const values = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
          />
        </svg>
      ),
      title: "Professionalism",
      description: "We maintain the highest standards of professionalism in every interaction and service delivery.",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Reliability",
      description: "Count on us to be there when we say we will, with consistent quality service every time.",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "Customer-First Approach",
      description: "Your satisfaction is our priority. We go above and beyond to exceed your expectations.",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Safety & Care",
      description:
        "Your belongings are treated with the utmost care and protection throughout the entire moving process.",
    },
  ]

  const serviceAreas = [
    "Sydney & Greater Sydney",
    "Melbourne & Surrounds",
    "Brisbane & Gold Coast",
    "Perth & Fremantle",
    "Adelaide & Hills",
    "Canberra & Queanbeyan",
    "Newcastle & Hunter Valley",
    "Wollongong & Illawarra",
  ]

  const whyChooseUs = [
    {
      icon: "🛡️",
      title: "Fully Insured",
      description: "Complete insurance coverage for your peace of mind",
    },
    {
      icon: "🚛",
      title: "GPS-Equipped Trucks",
      description: "Clean, modern vehicles with real-time tracking",
    },
    {
      icon: "👨‍💼",
      title: "Experienced Movers",
      description: "Trained professionals with years of expertise",
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      description: "No hidden fees, clear upfront quotes",
    },
    {
      icon: "⭐",
      title: "5-Star Rated Service",
      description: "Consistently excellent customer reviews",
    },
    {
      icon: "📞",
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
    },
  ]

  return (
    <div>
      <Header />

      {/* Dropdown Content Section - At the Top */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-white to-white text-black p-8
           rounded-t-2xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold ">About Himalaya Removals</h1>
              <p className="text-xl text-[#007870]">Your Trusted Moving Partner</p>
            </div>
          </div>

          {/* Content Body */}
          <div className="bg-gray-50 rounded-b-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-8 p-8">
              {/* Left Side - Content Section */}
              <div className="lg:col-span-2 space-y-8">
                {/* Key Features */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Himalaya Removals?</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-600 text-xl">🛡️</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">Fully Insured & Licensed</h4>
                        <p className="text-gray-600">
                          Complete protection for your belongings with comprehensive insurance coverage.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 text-xl">👥</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">Expert Team</h4>
                        <p className="text-gray-600">
                          Trained professionals with years of experience in handling all types of moves.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xl">🌍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">Local & Interstate</h4>
                        <p className="text-gray-600">Comprehensive moving services within Australia.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xl">💰</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">Transparent Pricing</h4>
                        <p className="text-gray-600">
                          No hidden fees or surprise charges. Clear, upfront pricing for all services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border-2 border-teal-100 rounded-lg p-4 text-center hover:border-teal-300 transition-colors duration-200 hover:shadow-md">
                      <div className="text-3xl mb-2">🏠</div>
                      <h4 className="font-semibold text-gray-800 text-sm">Residential Moving</h4>
                    </div>
                    <div className="bg-white border-2 border-orange-100 rounded-lg p-4 text-center hover:border-orange-300 transition-colors duration-200 hover:shadow-md">
                      <div className="text-3xl mb-2">🏢</div>
                      <h4 className="font-semibold text-gray-800 text-sm">Office Relocation</h4>
                    </div>
                    <div className="bg-white border-2 border-blue-100 rounded-lg p-4 text-center hover:border-blue-300 transition-colors duration-200 hover:shadow-md">
                      <div className="text-3xl mb-2">📦</div>
                      <h4 className="font-semibold text-gray-800 text-sm">Packing Services</h4>
                    </div>
                    <div className="bg-white border-2 border-green-100 rounded-lg p-4 text-center hover:border-green-300 transition-colors duration-200 hover:shadow-md">
                      <div className="text-3xl mb-2">🏪</div>
                      <h4 className="font-semibold text-gray-800 text-sm">Storage Solutions</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Images Section */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Our Services in Action</h3>

                {/* Main Service Image */}
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/owner.png?height=200&width=300"
                    width={300}
                    height={200}
                    alt="Professional moving team"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold text-lg">Professional Team</h4>
                    <p className="text-sm opacity-90">Expert handling of your belongings</p>
                  </div>
                </div>

                {/* Additional Image Section */}
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/truckfriend.png?height=150&width=300"
                    width={300}
                    height={150}
                    alt="Moving truck and team"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-semibold">Ready to Move?</h4>
                    <p className="text-xs opacity-90">Contact us today!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Why Choose{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500">
                    Himalaya Removals?
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  With years of experience in the moving industry, Himalaya Removals has established itself as
                  Australia&apos;s trusted moving partner. We understand that moving can be stressful, which is why
                  we&apos;re committed to making your relocation as smooth and hassle-free as possible.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our team of professional movers is trained to handle all types of moves, from residential relocations
                  to complex commercial moves. We use the latest equipment and techniques to ensure your belongings are
                  transported safely and securely.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-teal-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-teal-600 flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              👨‍👩‍👧‍👦 Meet the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500">Team</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of professionals is committed to making your move seamless and stress-free. Get to know
              the people who will take care of your belongings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              💼 Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and ensure we deliver exceptional service to every customer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-teal-600 mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Operate Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              📍 Where We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500">
                Operate
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We proudly serve major cities and regions across Australia, bringing our professional moving services to
              your doorstep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {serviceAreas.map((area, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl mb-2">🏙️</div>
                <h3 className="font-semibold text-gray-800">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🏆 Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500">Us?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Here&apos;s what sets Himalaya Removals apart from other moving companies and makes us the preferred
              choice for thousands of customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div
              className="rounded-2xl p-12 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #eaf4f8, #f5f9fb)",
              }}
            >
              <h3 className="text-3xl font-bold mb-4 text-[#1f2937]">Ready to Make Your Move Stress-Free?</h3>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-[#374151]">
                Contact us today for a free consultation and personalized moving quote. Our team is ready to help you
                plan your perfect move with our award-winning service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#89f0e0] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#59e3cc] transition-all duration-300 text-lg">
                  Get Free Quote
                </button>
                <button className="border-2 border-[#89f0e0] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#89f0e0] hover:text-white transition-all duration-300 text-lg">
                  Call Now: 0452 272 533
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
