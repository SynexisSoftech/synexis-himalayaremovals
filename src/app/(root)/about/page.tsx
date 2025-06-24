
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
      name: "Samir don",
      role: "Customer Relations Manager",
      bio: "Sarah's friendly approach and problem-solving skills ensure every customer feels valued and supported throughout their move.",
      image: "/placeholder.svg?height=300&width=300",
    },
     {
      name: "Om don",
      role: "Customer Relations Manager",
      bio: "Sarah's friendly approach and problem-solving skills ensure every customer feels valued and supported throughout their move.",
      image: "/placeholder.svg?height=300&width=300",
    }, {
      name: "Sujan don",
      role: "Customer Relations Manager",
      bio: "Sarah's friendly approach and problem-solving skills ensure every customer feels valued and supported throughout their move.",
      image: "/placeholder.svg?height=300&width=300",
    }, {
      name: "Biplove Maha don",
      role: "Customer Relations Manager",
      bio: "Sarah's friendly approach and problem-solving skills ensure every customer feels valued and supported throughout their move.",
      image: "/placeholder.svg?height=300&width=300",
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
                  Australia's trusted moving partner. We understand that moving can be stressful, which is why we're
                  committed to making your relocation as smooth and hassle-free as possible.
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

          {/* <div className="text-center">
            <div className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Don't see your area listed?</h3>
              <p className="text-lg mb-6">
                We're expanding our services! Contact us to check if we can serve your location.
              </p>
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                Check Service Area
              </button>
            </div>
          </div> */}
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
              Here's what sets Himalaya Removals apart from other moving companies and makes us the preferred choice for
              thousands of customers.
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
            <div className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">Ready to Make Your Move Stress-Free?</h3>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Contact us today for a free consultation and personalized moving quote. Our team is ready to help you
                plan your perfect move with our award-winning service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-lg">
                  Get Free Quote
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300 text-lg">
                  Call Now: +977-9851331114
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}
