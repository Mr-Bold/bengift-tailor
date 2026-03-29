import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.log('💡 Troubleshooting tips:')
    console.log('   1. Check your internet connection')
    console.log('   2. Verify MongoDB Atlas network access (allow 0.0.0.0/0)')
    console.log('   3. Confirm username and password are correct')
    console.log('   4. Check if cluster is active in MongoDB Atlas')
    process.exit(1)
  }
}

export default connectDB
