'use client'
import React, { useState } from 'react'
interface FAQItem {
  question: string
  answer: string
}
const FAQ= () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null)
      const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }
   const faqData: FAQItem[] = [
      {
        question: "How far in advance should I book my removal service?",
        answer:
          "We recommend booking your removal service at least 2-3 weeks in advance, especially during peak moving seasons (summer months and weekends). However, we also accommodate last-minute bookings based on availability.",
      },
      {
        question: "What items cannot be moved by your removal service?",
        answer:
          "We cannot transport hazardous materials including flammable liquids, explosives, corrosive substances, perishable food items, plants, pets, and valuable documents. We'll provide you with a complete list during your consultation.",
      },
      {
        question: "Do you provide packing materials and services?",
        answer:
          "Yes! We offer comprehensive packing services including high-quality boxes, bubble wrap, packing paper, and protective materials. Our professional team can pack your entire home or office, or you can choose to pack some items yourself.",
      },
      {
        question: "Are my belongings insured during the move?",
        answer:
          "Absolutely. All items are covered under our comprehensive insurance policy during transit. We also offer additional coverage options for high-value items. Our team will discuss insurance details during your consultation.",
      },
      {
        question: "How do you calculate the cost of removal services?",
        answer:
          "Our pricing is based on several factors including distance, volume of items, packing services required, and any special handling needs. We provide free, no-obligation quotes after assessing your specific requirements.",
      },
      {
        question: "Do you offer international removal services?",
        answer:
          "No, we only provide state removal services with proper documentation, customs clearance, and secure shipping. Our team handles all logistics to ensure your belongings reach their destination safely.",
      },
      {
        question: "What happens if my items are damaged during the move?",
        answer:
          "In the rare event of damage, we have a straightforward claims process. Document any damage immediately, contact our customer service team, and we'll work quickly to resolve the issue through our insurance coverage.",
      },
      {
        question: "Can you store my belongings if needed?",
        answer:
          "Yes, we offer secure storage solutions in our climate-controlled facilities. Whether you need short-term storage during your move or long-term storage solutions, we have flexible options to meet your needs.",
      },
    ]
  
  return (
    <div>
   {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f5fcfb" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our removal services. Can&apos;t find what you&apos;re looking for?
              Contact us directly.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  <span
                    className={`text-teal-600 text-xl font-bold transition-transform duration-200 ${
                      openFAQ === index ? "transform rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  )
}

export default FAQ