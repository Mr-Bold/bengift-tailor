import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from './models/Job.js'
import Customer from './models/Customer.js'
import Worker from './models/Worker.js'
import Fabric from './models/Fabric.js'
import Shop from './models/Shop.js'

dotenv.config()

const LOCAL_URI = 'mongodb://localhost:27017/bengift_tailor'
const ATLAS_URI = process.env.MONGODB_URI

async function migrateToAtlas() {
  try {
    console.log('🚀 Starting migration from Local MongoDB to Atlas...\n')

    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...')
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise()
    console.log('✅ Connected to local MongoDB\n')

    // Get all data from local
    console.log('📦 Fetching data from local database...')
    const LocalJob = localConn.model('Job', Job.schema)
    const LocalCustomer = localConn.model('Customer', Customer.schema)
    const LocalWorker = localConn.model('Worker', Worker.schema)
    const LocalFabric = localConn.model('Fabric', Fabric.schema)
    const LocalShop = localConn.model('Shop', Shop.schema)

    const jobs = await LocalJob.find({})
    const customers = await LocalCustomer.find({})
    const workers = await LocalWorker.find({})
    const fabrics = await LocalFabric.find({})
    const shops = await LocalShop.find({})

    console.log(`   Jobs: ${jobs.length}`)
    console.log(`   Customers: ${customers.length}`)
    console.log(`   Workers: ${workers.length}`)
    console.log(`   Fabrics: ${fabrics.length}`)
    console.log(`   Shops: ${shops.length}\n`)

    await localConn.close()
    console.log('✅ Local connection closed\n')

    // Connect to Atlas
    console.log('📡 Connecting to MongoDB Atlas...')
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise()
    console.log('✅ Connected to MongoDB Atlas\n')

    // Migrate data to Atlas
    console.log('📤 Migrating data to Atlas...\n')

    if (customers.length > 0) {
      const AtlasCustomer = atlasConn.model('Customer', Customer.schema)
      await AtlasCustomer.insertMany(customers.map(c => c.toObject()))
      console.log(`   ✅ Migrated ${customers.length} customers`)
    }

    if (workers.length > 0) {
      const AtlasWorker = atlasConn.model('Worker', Worker.schema)
      await AtlasWorker.insertMany(workers.map(w => w.toObject()))
      console.log(`   ✅ Migrated ${workers.length} workers`)
    }

    if (fabrics.length > 0) {
      const AtlasFabric = atlasConn.model('Fabric', Fabric.schema)
      await AtlasFabric.insertMany(fabrics.map(f => f.toObject()))
      console.log(`   ✅ Migrated ${fabrics.length} fabrics`)
    }

    if (jobs.length > 0) {
      const AtlasJob = atlasConn.model('Job', Job.schema)
      await AtlasJob.insertMany(jobs.map(j => j.toObject()))
      console.log(`   ✅ Migrated ${jobs.length} jobs`)
    }

    if (shops.length > 0) {
      const AtlasShop = atlasConn.model('Shop', Shop.schema)
      await AtlasShop.insertMany(shops.map(s => s.toObject()))
      console.log(`   ✅ Migrated ${shops.length} shops`)
    }

    await atlasConn.close()
    console.log('\n✅ Atlas connection closed')

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Restart your backend server')
    console.log('   2. Your app will now use MongoDB Atlas')
    console.log('   3. Data is accessible from anywhere with internet')

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('\n💡 Troubleshooting:')
    console.error('   1. Make sure local MongoDB is running')
    console.error('   2. Check MongoDB Atlas connection string in .env')
    console.error('   3. Verify network access in Atlas (allow 0.0.0.0/0)')
    console.error('   4. Check if Atlas cluster is active')
    process.exit(1)
  }
}

migrateToAtlas()
