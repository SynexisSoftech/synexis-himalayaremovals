import React from 'react';
import SafeImage from "../../components/safeimage";
import Link from "next/link";
import Header from '../component/header/header';
import Footer from '../component/footer/footer';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  date: string;
  publishedDate: string;
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  heroImage: string;
  heroTitle: string;
  cardImage: string;
  excerpt: string;
  featured: boolean;
}

interface ApiResponse {
  success: boolean;
  blogs: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
  message?: string;
}

async function getBlogs(): Promise<BlogPost[]> {
  try {
    // Construct the absolute URL for the API call
    // This is required for server-side fetch operations
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/blog?status=published&limit=20`;
    
    console.log(`Fetching blogs from: ${apiUrl}`); // Added for better debugging

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      return [];
    }

    const data: ApiResponse = await response.json();

    if (!data.success) {
      console.error("API returned error:", data.error || data.message);
      return [];
    }

    console.log(`Successfully fetched ${data.blogs?.length || 0} blogs from the API.`);

    return data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs from API:", error);
    return [];
  }
}

export const metadata = {
  title: "Blog - Latest Articles and Insights",
  description: "Discover our latest articles, tutorials, and insights on various topics.",
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const featuredBlogs = blogs.filter((blog) => blog.featured).slice(0, 3);
  const regularBlogs = blogs.filter((blog) => !blog.featured);

  return (
    <div className="min-h-screen bg-white">
     {/* Navigation */}
      <Header/>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#00968a]">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover insights, tutorials, and stories from our team. Stay updated with the latest trends and best
            practices.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* API Status Indicator (for development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📡 <strong>API Status:</strong>{" "}
              {blogs.length > 0 ? `Successfully loaded ${blogs.length} posts from API` : "No posts found or API error"}
            </p>
          </div>
        )}

        {/* Featured Posts */}
        {featuredBlogs.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 ml-8 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog, index) => (
                <article key={blog._id} className={`group ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      {(blog.cardImage || blog.heroImage) && (
                        <div className="aspect-video relative overflow-hidden">
                          <SafeImage
                            src={blog.cardImage || blog.heroImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            fallbackSrc="/placeholder.svg?height=400&width=600"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                              ⭐ Featured
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-8">
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
                          {blog.author.image && (
                            <SafeImage
                              src={blog.author.image}
                              alt={blog.author.name}
                              width={32}
                              height={32}
                              className="rounded-full ring-2 ring-gray-100"
                              fallbackSrc="/placeholder.svg?height=32&width=32"
                            />
                          )}
                          <span className="font-medium">{blog.author.name}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <time className="text-gray-500">{formatDate(blog.publishedDate)}</time>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 line-clamp-3 leading-relaxed">{blog.excerpt}</p>

                        <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                          <span>Read More</span>
                          <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-pink-600 ml-8 rounded-full"></div>
          </div>

          {regularBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog) => (
                <article key={blog._id} className="group">
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {(blog.cardImage || blog.heroImage) && (
                        <div className="aspect-video relative overflow-hidden">
                          <SafeImage
                            src={blog.cardImage || blog.heroImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            fallbackSrc="/placeholder.svg?height=400&width=600"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                          {blog.author.image && (
                            <SafeImage
                              src={blog.author.image}
                              alt={blog.author.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                              fallbackSrc="/placeholder.svg?height=24&width=24"
                            />
                          )}
                          <span className="font-medium">{blog.author.name}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <time>{formatDate(blog.publishedDate)}</time>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{blog.excerpt}</p>

                        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                          <span>Read Article</span>
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-600 mb-4">Check back soon for our latest content!</p>
                <Link
                  href="/admin/blog"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Post
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss our latest articles and insights.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
     <Footer/>
    </div>
  );
}