import mongoose from "mongoose"

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Title cannot be empty"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },
    date: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Hero Section
    heroImage: {
      type: String,
      required: false,
      default: "",
    },
    heroTitle: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Hero title cannot be empty"],
    },
    heroSubtitle: {
      type: String,
      required: false,
      default: "",
    },
    // Content Structure
    introduction: {
      paragraph1: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
      paragraph2: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
    },
    mainContent: {
      highlight: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
      paragraph1: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
      quote: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
      paragraph2: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
    },
    conclusion: {
      paragraph1: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
      paragraph2: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
      paragraph3: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
    },
    // Images
    mainImage: {
      type: String,
      required: false,
      default: "",
    },
    cardImage: {
      type: String,
      required: false,
      default: "",
    },
    // SEO
    metaDescription: {
      type: String,
      required: false,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    // Blog listing data
    excerpt: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Excerpt cannot be empty"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create slug from title if not provided
blogSchema.pre("save", function (next) {
  if (this.isModified("title") && (!this.slug || this.slug.trim() === "")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }
  next()
})

// Indexes for better performance - FIXED: Remove duplicate index
blogSchema.index({ status: 1, publishedDate: -1 })
blogSchema.index({ featured: 1, publishedDate: -1 })
// Remove the duplicate slug index since it's already defined in the schema with unique: true

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema)
export default Blog
