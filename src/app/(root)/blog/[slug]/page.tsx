import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import Blog from "@/app/models/blog"
import { connectToDatabase } from "@/app/lib/mongodb"


interface BlogPost {
  _id: string
  title: string
  slug: string
  date: string
  publishedDate: string
  status: string
  author: {
    _id: string
    name: string
    email: string
    image?: string
  }
  heroImage: string
  heroTitle: string
  heroSubtitle: string
  introduction: {
    paragraph1: string
    paragraph2: string
  }
  mainContent: {
    highlight: string
    paragraph1: string
    quote: string
    paragraph2: string
  }
  conclusion: {
    paragraph1: string
    paragraph2: string
    paragraph3: string
  }
  mainImage: string
  cardImage: string
  metaDescription: string
  metaKeywords: string
  excerpt: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    await connectToDatabase()

    const blog = await Blog.findOne({
      slug,
      status: "published",
    })
      .populate("author", "name email image")
      .lean()

    if (!blog) return null

    return JSON.parse(JSON.stringify(blog))
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  try {
    await connectToDatabase()

    const relatedPosts = await Blog.find({
      slug: { $ne: currentSlug },
      status: "published",
    })
      .populate("author", "name email image")
      .sort({ publishedDate: -1 })
      .limit(limit)
      .lean()

    return JSON.parse(JSON.stringify(relatedPosts))
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug)

  if (!blog) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${blog.title} | Our Blog`,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords,
    openGraph: {
      title: blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.heroImage ? [blog.heroImage] : [],
      type: "article",
      publishedTime: blog.publishedDate,
      authors: [blog.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.heroImage ? [blog.heroImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug)

  if (!blog) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(params.slug)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  const fullContent = `${blog.introduction.paragraph1} ${blog.introduction.paragraph2} ${blog.mainContent.paragraph1} ${blog.mainContent.paragraph2} ${blog.conclusion.paragraph1} ${blog.conclusion.paragraph2} ${blog.conclusion.paragraph3}`

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        {blog.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={blog.heroImage || "/placeholder.svg?height=600&width=1200"}
              alt={blog.heroTitle}
              fill
              className="object-cover"
              
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center text-white">
            {blog.featured && (
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-full text-sm font-semibold mb-6">
                ⭐ Featured Article
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{blog.heroTitle}</h1>

            {blog.heroSubtitle && (
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                {blog.heroSubtitle}
              </p>
            )}

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
              <div className="flex items-center space-x-3">
                {blog.author.image && (
                  <Image
                    src={blog.author.image || "/placeholder.svg?height=40&width=40"}
                    alt={blog.author.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-white/20"
                  
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold">{blog.author.name}</p>
                  <p className="text-gray-300 text-xs">Author</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time>{formatDate(blog.publishedDate)}</time>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formatReadingTime(fullContent)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        {(blog.introduction.paragraph1 || blog.introduction.paragraph2) && (
          <div className="prose prose-xl max-w-none mb-16">
            {blog.introduction.paragraph1 && (
              <p className="text-xl leading-relaxed text-gray-700 mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                {blog.introduction.paragraph1}
              </p>
            )}
            {blog.introduction.paragraph2 && (
              <p className="text-xl leading-relaxed text-gray-700">{blog.introduction.paragraph2}</p>
            )}
          </div>
        )}

        {/* Main Image */}
        {blog.mainImage && (
          <div className="mb-16">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={blog.mainImage || "/placeholder.svg?height=400&width=800"}
                alt="Article illustration"
                fill
                className="object-cover"
               
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-16">
          {blog.mainContent.highlight && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-8 mb-12 rounded-r-lg">
              <p className="text-xl font-medium text-blue-900 italic leading-relaxed">
                💡 {blog.mainContent.highlight}
              </p>
            </div>
          )}

          {blog.mainContent.paragraph1 && (
            <p className="text-lg leading-relaxed text-gray-700 mb-8">{blog.mainContent.paragraph1}</p>
          )}

          {blog.mainContent.quote && (
            <blockquote className="border-l-4 border-gray-300 pl-8 py-6 my-12 bg-gray-50 rounded-r-lg">
              <p className="text-2xl italic text-gray-800 font-medium leading-relaxed">"{blog.mainContent.quote}"</p>
            </blockquote>
          )}

          {blog.mainContent.paragraph2 && (
            <p className="text-lg leading-relaxed text-gray-700 mb-8">{blog.mainContent.paragraph2}</p>
          )}
        </div>

        {/* Conclusion */}
        {(blog.conclusion.paragraph1 || blog.conclusion.paragraph2 || blog.conclusion.paragraph3) && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-4"></span>
              Conclusion
            </h2>
            <div className="prose prose-lg max-w-none">
              {blog.conclusion.paragraph1 && (
                <p className="text-lg leading-relaxed text-gray-700 mb-6">{blog.conclusion.paragraph1}</p>
              )}
              {blog.conclusion.paragraph2 && (
                <p className="text-lg leading-relaxed text-gray-700 mb-6">{blog.conclusion.paragraph2}</p>
              )}
              {blog.conclusion.paragraph3 && (
                <p className="text-lg leading-relaxed text-gray-700">{blog.conclusion.paragraph3}</p>
              )}
            </div>
          </div>
        )}

        {/* Article Footer */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                {blog.author.image && (
                  <Image
                    src={blog.author.image || "/placeholder.svg?height=64&width=64"}
                    alt={blog.author.name}
                    width={64}
                    height={64}
                    className="rounded-full ring-4 ring-white shadow-lg"
                  
                  />
                )}
                <div>
                  <p className="text-xl font-bold text-gray-900">{blog.author.name}</p>
                  <p className="text-gray-600">Author</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  More Articles
                </Link>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-gray-600">Continue reading with these related posts</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {(post.cardImage || post.heroImage) && (
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={post.cardImage || post.heroImage || "/placeholder.svg?height=300&width=400"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                          {post.author.image && (
                            <Image
                              src={post.author.image || "/placeholder.svg?height=20&width=20"}
                              alt={post.author.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                              
                            />
                          )}
                          <span>{post.author.name}</span>
                          <span>•</span>
                          <time>{formatDate(post.publishedDate)}</time>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
