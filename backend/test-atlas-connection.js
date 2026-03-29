import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const ATLAS_URI = process.env.MONGODB_URI

console.log('🔍 Testing MongoDB Atlas connection...\n')
console.log('Cluster: ClusterBenGift')
console.log('Region: Mumbai (ap-south-1)')
console.log('Database: bengift_tailor')
console.log('Connection type:', ATLAS_URI.startsWith('mongodb+srv') ? 'SRV' : 'Direct')
console.log('')

mongoose.connect(ATLAS_URI, {
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  family: 4 // Force IPv4
})
.then(() => {
  console.log('✅ SUCCESS! Connected to MongoDB Atlas!')
  console.log(`📍 Host: ${mongoose.connection.host}`)
  console.log(`📊 Database: ${mongoose.connection.name}`)
  console.log('\n🎉 Your Atlas cluster is working!')
  console.log('💡 You can now deploy your app online!')
  process.exit(0)
})
.catch((error) => {
  console.log('❌ Connection failed:', error.message)
  console.log('\n💡 Possible reasons:')
  console.log('   1. DNS not propagated yet (wait 15-30 minutes)')
  console.log('   2. Network/firewall blocking MongoDB')
  console.log('   3. Cluster still initializing')
  console.log('\n🔄 Try again in a few minutes...')
  process.exit(1)
})
