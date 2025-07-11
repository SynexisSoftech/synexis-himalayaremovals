// Run this script to see what services already exist in your database

import { connectToDatabase } from "../lib/mongodb.js"
import { Service } from "../models/service.js"


async function checkExistingServices() {
  try {
    console.log("🔍 Connecting to database...")
    await connectToDatabase()

    console.log("📋 Fetching all existing services...")
    const services = await Service.find({}).select("title subServices createdAt")

    console.log(`\n📊 Found ${services.length} existing services:`)
    console.log("=".repeat(50))

    services.forEach((service, index) => {
      console.log(`${index + 1}. Title: "${service.title}"`)
      console.log(`   Sub-services: [${service.subServices.join(", ")}]`)
      console.log(`   Created: ${service.createdAt}`)
      console.log("-".repeat(30))
    })

    // Check for any duplicate titles
    const titles = services.map((s) => s.title)
    const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index)

    if (duplicates.length > 0) {
      console.log("\n⚠️  Found duplicate titles in database:")
      duplicates.forEach((title) => console.log(`   - "${title}"`))
    } else {
      console.log("\n✅ No duplicate titles found in database")
    }
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    process.exit(0)
  }
}

checkExistingServices()
