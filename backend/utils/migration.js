import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from '../models/Job.js'
import Customer from '../models/Customer.js'
import Worker from '../models/Worker.js'
import Fabric from '../models/Fabric.js'
import Shop from '../models/Shop.js'

dotenv.config()

// This script helps migrate data from localStorage to MongoDB
// Run: node utils/migration.js

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Example: Paste your localStorage data here
    const localStorageData = {
      jobs: [],
      customers: [],
      workers: [],
      fabrics: [],
      shop: {}
    }
    
    console.log('📦 Starting migration...')
    
    // Migrate customers
    if (localStorageData.customers?.length > 0) {
      await Customer.insertMany(localStorageData.customers)
      console.log(`✅ Migrated ${localStorageData.customers.length} customers`)
    }
    
    // Migrate workers
    if (localStorageData.workers?.length > 0) {
      await Worker.insertMany(localStorageData.workers)
      console.log(`✅ Migrated ${localStorageData.workers.length} workers`)
    }
    
    // Migrate fabrics
    if (localStorageData.fabrics?.length > 0) {
      await Fabric.insertMany(localStorageData.fabrics)
      console.log(`✅ Migrated ${localStorageData.fabrics.length} fabrics`)
    }
    
    // Migrate jobs
    if (localStorageData.jobs?.length > 0) {
      await Job.insertMany(localStorageData.jobs)
      console.log(`✅ Migrated ${localStorageData.jobs.length} jobs`)
    }
    
    // Migrate shop info
    if (localStorageData.shop) {
      await Shop.create(localStorageData.shop)
      console.log('✅ Migrated shop info')
    }
    
    console.log('🎉 Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrateData()
