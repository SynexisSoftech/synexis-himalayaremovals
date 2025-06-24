"use client"; // Keep this at the top as you're using useState

import type React from "react"; // Type import is good
import { useState } from "react";
import Footer from "../component/footer/footer";
import Header from "../component/header/header";

// Define an interface for your form data for better type safety
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({ // Use the interface here
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status
  const [submitMessage, setSubmitMessage] = useState<string | null>(null); // State for submission feedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button during submission
    setSubmitMessage(null); // Clear previous messages

    try {
      // Simulate API call or form submission delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", formData);

      // In a real application, you would send this to your backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      setSubmitMessage("Message sent successfully! We'll get back to you soon.");
      setFormData({ // Clear the form after successful submission
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Header />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your move? Contact us today for a free quote and
              consultation. We&apos;re here to make your relocation smooth and
              stress-free.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Address Icon</title> {/* Added for accessibility */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Address
                      </h4>
                      <p className="text-gray-600">Australia</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Phone Icon</title> {/* Added for accessibility */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Phone
                      </h4>
                      <a href="tel:0452272533" className="text-gray-600 hover:text-teal-600 transition-colors">
                        0452272533
                      </a>{" "}
                      {/* Made clickable */}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Email Icon</title> {/* Added for accessibility */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Email
                      </h4>
                      <a
                        href="mailto:info@himalayaremovals.com.np"
                        className="text-gray-600 hover:text-teal-600 transition-colors"
                      >
                        himalayaremovals7@gmail.com
                      </a>{" "}
                      {/* Made clickable */}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Business Hours Icon</title>{" "}
                        {/* Added for accessibility */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Business Hours
                      </h4>
                      <p className="text-gray-600">Mon - Sat: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sunday: 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <h4 className="text-lg font-semibold text-orange-800 mb-2">
                  24/7 Emergency Service
                </h4>
                <p className="text-orange-700 mb-3">
                  Need urgent moving assistance? We&apos;re available round the clock
                  for emergency relocations.
                </p>
                <a
                  href="tel:+9779851331114" // Link to phone number for click-to-call
                  className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-colors cursor-pointer"
                >
                  Call Emergency Line
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                      aria-required="true" // Added for accessibility
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Your phone number"
                      aria-required="true" // Added for accessibility
                      pattern="[0-9]{10}" // Basic pattern for 10 digits
                      title="Please enter a 10-digit phone number" // Tooltip for pattern
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    aria-required="true" // Added for accessibility
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Service Required
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a service</option>
                    <option value="household">Household Moving</option>
                    <option value="office">Office/Commercial Moving</option>
                    <option value="international">International Moving</option>
                    <option value="storage">Storage Services</option>
                    <option value="packing">Packing Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your moving requirements..."
                  />
                </div>

                {submitMessage && (
                  <p
                    className={`text-center text-sm ${
                      submitMessage.includes("successfully")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                    role="alert" // Added for accessibility
                  >
                    {submitMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting} // Disable button while submitting
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}