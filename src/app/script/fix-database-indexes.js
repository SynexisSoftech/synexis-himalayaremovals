// // Script to fix MongoDB indexes and clean up the database
// import mongoose from "mongoose"

// const MONGO_URL = process.env.MONGO_URL

// if (!MONGO_URL) {
//   console.error("MONGO_URL is not defined")
//   process.exit(1)
// }

// async function fixDatabaseIndexes() {
//   try {
//     console.log("🔄 Connecting to MongoDB...")
//     await mongoose.connect(MONGO_URL)
//     console.log("✅ Connected to MongoDB")

//     const db = mongoose.connection.db
//     const servicesCollection = db.collection("services")

//     // 1. Check current indexes
//     console.log("\n📋 Current indexes:")
//     const indexes = await servicesCollection.indexes()
//     indexes.forEach((index) => {
//       console.log(`  - ${JSON.stringify(index.key)} (${index.name})`)
//     })

//     // 2. Drop the problematic name_1 index if it exists
//     try {
//       console.log("\n🗑️ Attempting to drop old name_1 index...")
//       await servicesCollection.dropIndex("name_1")
//       console.log("✅ Successfully dropped name_1 index")
//     } catch (error) {
//       if (error.code === 27) {
//         console.log("ℹ️ name_1 index does not exist (this is good)")
//       } else {
//         console.log("⚠️ Error dropping name_1 index:", error.message)
//       }
//     }

//     // 3. Check for documents with old structure
//     console.log("\n🔍 Checking for documents with old structure...")
//     const docsWithName = await servicesCollection.find({ name: { $exists: true } }).toArray()
//     console.log(`Found ${docsWithName.length} documents with 'name' field`)

//     if (docsWithName.length > 0) {
//       console.log("🔄 Migrating documents from name to title...")
//       for (const doc of docsWithName) {
//         if (doc.name && !doc.title) {
//           await servicesCollection.updateOne(
//             { _id: doc._id },
//             {
//               $set: { title: doc.name },
//               $unset: { name: "" },
//             },
//           )
//           console.log(`  ✅ Migrated: ${doc.name} -> title`)
//         }
//       }
//     }

//     // 4. Ensure correct title index exists
//     console.log("\n📝 Ensuring correct title index...")
//     try {
//       await servicesCollection.createIndex({ title: 1 }, { unique: true })
//       console.log("✅ Title index created/verified")
//     } catch (error) {
//       console.log("ℹ️ Title index already exists or error:", error.message)
//     }

//     // 5. Check for duplicate titles
//     console.log("\n🔍 Checking for duplicate titles...")
//     const duplicates = await servicesCollection
//       .aggregate([
//         { $group: { _id: "$title", count: { $sum: 1 }, docs: { $push: "$_id" } } },
//         { $match: { count: { $gt: 1 } } },
//       ])
//       .toArray()

//     if (duplicates.length > 0) {
//       console.log("⚠️ Found duplicate titles:")
//       duplicates.forEach((dup) => {
//         console.log(`  - "${dup._id}" appears ${dup.count} times`)
//       })

//       // Remove duplicates (keep the first one)
//       for (const dup of duplicates) {
//         const docsToRemove = dup.docs.slice(1) // Keep first, remove rest
//         for (const docId of docsToRemove) {
//           await servicesCollection.deleteOne({ _id: docId })
//           console.log(`  🗑️ Removed duplicate: ${docId}`)
//         }
//       }
//     } else {
//       console.log("✅ No duplicate titles found")
//     }

//     // 6. Final index check
//     console.log("\n📋 Final indexes:")
//     const finalIndexes = await servicesCollection.indexes()
//     finalIndexes.forEach((index) => {
//       console.log(`  - ${JSON.stringify(index.key)} (${index.name})`)
//     })

//     // 7. Show current documents
//     console.log("\n📄 Current services:")
//     const allServices = await servicesCollection.find({}).toArray()
//     allServices.forEach((service) => {
//       console.log(`  - ${service.title} (${service.subServices?.length || 0} subservices)`)
//     })

//     console.log("\n✅ Database cleanup completed successfully!")
//   } catch (error) {
//     console.error("❌ Error fixing database:", error)
//   } finally {
//     await mongoose.disconnect()
//     console.log("🔌 Disconnected from MongoDB")
//   }
// }

// // Run the fix
// fixDatabaseIndexes()
