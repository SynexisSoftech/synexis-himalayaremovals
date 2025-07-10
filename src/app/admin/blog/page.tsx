"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface BlogFormData {
  title: string
  slug: string
  date: string
  status: "draft" | "published"
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
}

const initialFormData: BlogFormData = {
  title: "",
  slug: "",
  date: new Date().toISOString().split("T")[0],
  status: "draft",
  heroImage: "",
  heroTitle: "",
  heroSubtitle: "",
  introduction: {
    paragraph1: "",
    paragraph2: "",
  },
  mainContent: {
    highlight: "",
    paragraph1: "",
    quote: "",
    paragraph2: "",
  },
  conclusion: {
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
  },
  mainImage: "",
  cardImage: "",
  metaDescription: "",
  metaKeywords: "",
  excerpt: "",
  featured: false,
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState<BlogFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [blogs, setBlogs] = useState<any[]>([])
  const [editingBlog, setEditingBlog] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog?status=all")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BlogFormData],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Auto-generate slug from title
      if (field === "title" && !editingBlog) {
        setFormData((prev) => ({
          ...prev,
          slug: generateSlug(value),
          heroTitle: value, // Auto-fill hero title with main title
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const url = editingBlog ? `/api/blog/${editingBlog}` : "/api/blog"
      const method = editingBlog ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingBlog ? "Blog updated successfully!" : "Blog created successfully!",
        })
        setFormData(initialFormData)
        setEditingBlog(null)
        fetchBlogs()
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.error || "Failed to save blog" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving the blog" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (blog: any) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      date: blog.date,
      status: blog.status,
      heroImage: blog.heroImage || "",
      heroTitle: blog.heroTitle,
      heroSubtitle: blog.heroSubtitle || "",
      introduction: blog.introduction || { paragraph1: "", paragraph2: "" },
      mainContent: blog.mainContent || { highlight: "", paragraph1: "", quote: "", paragraph2: "" },
      conclusion: blog.conclusion || { paragraph1: "", paragraph2: "", paragraph3: "" },
      mainImage: blog.mainImage || "",
      cardImage: blog.cardImage || "",
      metaDescription: blog.metaDescription || "",
      metaKeywords: blog.metaKeywords || "",
      excerpt: blog.excerpt,
      featured: blog.featured || false,
    })
    setEditingBlog(blog.slug)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Blog deleted successfully!" })
        fetchBlogs()
      } else {
        setMessage({ type: "error", text: "Failed to delete blog" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting the blog" })
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingBlog(null)
    setMessage(null)
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Blog Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              {editingBlog && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange("featured", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Hero Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                    <input
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => handleInputChange("heroImage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.heroTitle}
                      onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                    <input
                      type="text"
                      value={formData.heroSubtitle}
                      onChange={(e) => handleInputChange("heroSubtitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>

                {/* Introduction */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Introduction</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Introduction Paragraph 1"
                      value={formData.introduction.paragraph1}
                      onChange={(e) => handleInputChange("introduction.paragraph1", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Introduction Paragraph 2"
                      value={formData.introduction.paragraph2}
                      onChange={(e) => handleInputChange("introduction.paragraph2", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Main Content</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Highlight/Callout Text"
                      value={formData.mainContent.highlight}
                      onChange={(e) => handleInputChange("mainContent.highlight", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Main Content Paragraph 1"
                      value={formData.mainContent.paragraph1}
                      onChange={(e) => handleInputChange("mainContent.paragraph1", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Quote"
                      value={formData.mainContent.quote}
                      onChange={(e) => handleInputChange("mainContent.quote", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Main Content Paragraph 2"
                      value={formData.mainContent.paragraph2}
                      onChange={(e) => handleInputChange("mainContent.paragraph2", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Conclusion */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Conclusion</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Conclusion Paragraph 1"
                      value={formData.conclusion.paragraph1}
                      onChange={(e) => handleInputChange("conclusion.paragraph1", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Conclusion Paragraph 2"
                      value={formData.conclusion.paragraph2}
                      onChange={(e) => handleInputChange("conclusion.paragraph2", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Conclusion Paragraph 3"
                      value={formData.conclusion.paragraph3}
                      onChange={(e) => handleInputChange("conclusion.paragraph3", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Images and SEO */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images & SEO</h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
                    <input
                      type="url"
                      value={formData.mainImage}
                      onChange={(e) => handleInputChange("mainImage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Image URL</label>
                    <input
                      type="url"
                      value={formData.cardImage}
                      onChange={(e) => handleInputChange("cardImage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                    <textarea
                      required
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      value={formData.metaKeywords}
                      onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Saving..." : editingBlog ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>

          {/* Blog List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Blog Posts</h2>

            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{blog.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">/{blog.slug}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.status}
                        </span>
                        {blog.featured && (
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">Featured</span>
                        )}
                        <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </Link>
                      <button onClick={() => handleEdit(blog)} className="text-green-600 hover:text-green-800 text-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.slug)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                </div>
              ))}

              {blogs.length === 0 && (
                <p className="text-gray-500 text-center py-8">No blog posts found. Create your first post!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
