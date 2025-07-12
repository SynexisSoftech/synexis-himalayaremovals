import mongoose from "mongoose"

const MONGO_URL = process.env.MONGO_URL as string

if (!MONGO_URL) {
  console.error("MONGO_URL is not defined in environment variables")
  throw new Error("Please define the MONGO_URL environment variable inside .env")
}

// Connection state tracking
let isConnecting = false
let connectionPromise: Promise<typeof mongoose> | null = null

// Configure mongoose for better reliability
mongoose.set("strictQuery", false)

// Connection options for better reliability
const connectionOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  serverSelectionTimeoutMS: 10000, // Timeout for server selection
  socketTimeoutMS: 45000, // Timeout for socket operations
  bufferCommands: true, // Enable mongoose buffering for better reliability
  retryWrites: true, // Enable retry writes
  retryReads: true, // Enable retry reads
  // Heartbeat frequency
  heartbeatFrequencyMS: 10000,
  // Connection timeout
  connectTimeoutMS: 10000,
}

export async function connectToDatabase() {
  // If already connected, return the connection immediately
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection")
    return mongoose
  }

  // If already connecting, wait for that connection
  if (isConnecting && connectionPromise) {
    console.log("⏳ Waiting for existing connection...")
    return connectionPromise
  }

  // Start new connection
  isConnecting = true
  console.log("🔄 Starting new MongoDB connection...")

  connectionPromise = mongoose
    .connect(MONGO_URL, connectionOptions)
    .then(() => {
      console.log("✅ MongoDB connection established successfully")
      isConnecting = false

      // Set up connection event handlers only once
      if (!mongoose.connection.listeners("error").length) {
        mongoose.connection.on("error", (error) => {
          console.error("❌ MongoDB connection error:", error)
          isConnecting = false
          connectionPromise = null
        })

        mongoose.connection.on("disconnected", () => {
          console.log("⚠️ MongoDB connection disconnected")
          isConnecting = false
          connectionPromise = null
        })

        mongoose.connection.on("reconnected", () => {
          console.log("🔄 MongoDB connection reconnected")
        })
      }

      return mongoose
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error)
      isConnecting = false
      connectionPromise = null

      // Try fallback connection with shorter timeouts
      console.log("🔄 Trying fallback connection...")
      return mongoose
        .connect(MONGO_URL, {
          maxPoolSize: 5,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 30000,
          connectTimeoutMS: 5000,
        })
        .then(() => {
          console.log("✅ MongoDB fallback connection established successfully")
          return mongoose
        })
    })

  return connectionPromise
}

// Function to close the connection (useful for testing or graceful shutdown)
export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log("🔌 MongoDB connection closed")
  }
}

// Function to check connection health
export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}

// Function to get connection status
export function getConnectionStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }
  return states[mongoose.connection.readyState as keyof typeof states] || "unknown"
}
