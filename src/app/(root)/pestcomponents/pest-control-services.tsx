"use client"
import Image from "next/image"
import { useState } from "react"

interface Service {
  title: string
  description: string
  hoverDescription: string
  iconAlt: string
  src: string
}

const services: Service[] = [
  {
    title: "Termite Control & Protection",
    description:
      "Comprehensive solutions to eliminate termites and prevent future infestations, safeguarding your property from structural damage.",
    hoverDescription: "Protect your home from costly termite damage with our advanced inspection and treatment plans.",
    iconAlt: "Termite icon",
    src: "/termite.png?height=64&width=64&text=Termite", // Updated size
  },
  {
    title: "Bed Bug Heat Treatment",
    description:
      "An effective, non-toxic heat treatment that eradicates bed bugs at all life stages, ensuring a complete and lasting solution.",
    hoverDescription:
      "Experience a peaceful night's sleep again with our chemical-free, highly effective bed bug heat treatments.",
    iconAlt: "Bed bug icon",
    src: "/bedbug.png?height=64&width=64&text=BedBug", // Updated size
  },
  {
    title: "Cockroach Gel Baiting System",
    description:
      "Advanced gel baiting system targeting cockroach colonies, providing discreet and highly effective elimination for a pest-free home.",
    hoverDescription: "Our discreet gel baiting system targets cockroaches at their source for long-term eradication.",
    iconAlt: "Cockroach icon",
    src: "/cockroach.png?height=64&width=64&text=Roach", // Updated size
  },
  {
    title: "Mosquito Fogging & Larvae Treatment",
    description:
      "Targeted fogging to reduce adult mosquito populations and larvae treatment to prevent breeding, creating a comfortable outdoor environment.",
    hoverDescription:
      "Reclaim your outdoor spaces! Our treatments drastically reduce mosquito populations for enjoyable evenings.",
    iconAlt: "Mosquito icon",
    src: "/mosquito.png?height=64&width=64&text=Mosquito", // Updated size
  },
  {
    title: "Anti-Bird Netting & Spike Installation",
    description:
      "Professional installation of netting and spikes to deter birds from roosting and nesting on your property, maintaining cleanliness and preventing damage.",
    hoverDescription:
      "Prevent property damage and maintain hygiene with our humane and effective bird control solutions.",
    iconAlt: "Bird icon",
    src: "/anti-bird.png?height=64&width=64&text=Bird", // Updated size
  },
]

export default function PestControlServices() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#f5fcfb]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Premium Pest Control Services</h2>
          <div className="w-20 h-1 bg-red-500 mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 md:p-8 flex flex-col items-start"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="mb-6">
                  <Image
                    src={service.src || "/placeholder.svg"}
                    alt={service.iconAlt}
                    width={64} // Increased width
                    height={64} // Increased height
                    className="transition-transform duration-300 ease-in-out hover:scale-110" // Added hover animation
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-left">
                  {hoveredIndex === index ? service.hoverDescription : service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
