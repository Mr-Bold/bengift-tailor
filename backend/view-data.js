import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from './models/Job.js'
import Customer from './models/Customer.js'
import Worker from './models/Worker.js'
import Fabric from './models/Fabric.js'
import Shop from './models/Shop.js'

dotenv.config()

async function viewData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')
    
    console.log('📊 DATABASE SUMMARY')
    console.log('=' .repeat(50))
    
    const jobsCount = await Job.countDocuments()
    const customersCount = await Customer.countDocuments()
    const workersCount = await Worker.countDocuments()
    const fabricsCount = await Fabric.countDocuments()
    const shopsCount = await Shop.countDocuments()
    
    console.log(`Jobs: ${jobsCount}`)
    console.log(`Customers: ${customersCount}`)
    console.log(`Workers: ${workersCount}`)
    console.log(`Fabrics: ${fabricsCount}`)
    console.log(`Shops: ${shopsCount}`)
    
    console.log('\n📋 RECENT JOBS')
    console.log('=' .repeat(50))
    const jobs = await Job.find().sort({ orderDate: -1 }).limit(5)
    jobs.forEach(job => {
      console.log(`Job #${job.jobNo} - ${job.customerName} - ${job.status} - ₵${job.totalAmount}`)
    })
    
    console.log('\n👥 CUSTOMERS')
    console.log('=' .repeat(50))
    const customers = await Customer.find().limit(10)
    customers.forEach(customer => {
      console.log(`${customer.name} - ${customer.phone}`)
    })
    
    console.log('\n👔 WORKERS')
    console.log('=' .repeat(50))
    const workers = await Worker.find()
    workers.forEach(worker => {
      console.log(`${worker.name} - ${worker.phone} - ${worker.status}`)
    })
    
    console.log('\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

viewData()
