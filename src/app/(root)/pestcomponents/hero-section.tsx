import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center text-center text-white">
      {/* Background Image */}
      <Image
        src="/pestcontroller.png"
        alt="Pest control background with houses and street"
        fill
        priority // Preload the LCP image for better performance [^2]
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 py-8">
        {/* Top: Logo Placeholder */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#03a396] bg-white flex items-center justify-center">
            {/* Placeholder for the TUFAN Pest Control logo */}
            <Image
              src="/himalaya.png?"
              alt="Himalaya-pest control"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>

        {/* Middle: Main Heading and Guaranteed Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Got a Pest Problem? <br /> We&apos;ll Fix It Fast
          </h1>
          <p className="text-3xl font-extrabold tracking-widest text-[#03a396] md:text-4xl lg:text-5xl">GUARANTEED!</p>
        </div>

        {/* Bottom: Description and Button */}
        <div className="space-y-6">
          <p className="mx-auto max-w-3xl text-lg md:text-xl">
            With over 250 5-star reviews and a free inspection, Himalaya Pest Control is your go-to partner for safe and
            effective pest removal.
          </p>
          {/* Replaced Lucide PhoneIcon with an inline SVG */}
          <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#03a396] px-8 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#028a7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a396] focus-visible:ring-offset-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-5 w-5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </button>
        </div>
      </div>
    </section>
  )
}
