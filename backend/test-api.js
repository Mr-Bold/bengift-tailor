import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

async function testAPI() {
  console.log('🧪 Testing BenGift Clothing Backend API\n')
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...')
    const health = await axios.get(`${API_URL}/health`)
    console.log('✅ Health:', health.data)
    
    // Test 2: Create a customer
    console.log('\n2️⃣ Creating test customer...')
    const customer = await axios.post(`${API_URL}/customers`, {
      name: 'Test Customer',
      phone: '+233209609002',
      email: 'test@example.com',
      address: 'Test Address'
    })
    console.log('✅ Customer created:', customer.data.name)
    const customerId = customer.data._id
    
    // Test 3: Get all customers
    console.log('\n3️⃣ Fetching all customers...')
    const customers = await axios.get(`${API_URL}/customers`)
    console.log(`✅ Found ${customers.data.length} customer(s)`)
    
    // Test 4: Create a worker
    console.log('\n4️⃣ Creating test worker...')
    const worker = await axios.post(`${API_URL}/workers`, {
      name: 'Test Worker',
      phone: '+233200000000',
      salary: 1000,
      status: 'Active'
    })
    console.log('✅ Worker created:', worker.data.name)
    const workerId = worker.data._id
    
    // Test 5: Create a job
    console.log('\n5️⃣ Creating test job...')
    const job = await axios.post(`${API_URL}/jobs`, {
      jobNo: '1',
      customerName: 'Test Customer',
      customerId: customerId,
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      workerId: workerId,
      items: [{
        item: 'Shirt',
        remark: 'Blue cotton',
        qty: 2,
        fees: 50,
        discount: 0,
        finalFees: 50,
        amount: 100
      }],
      totalAmount: 100,
      advancePaid: 50,
      balance: 50,
      status: 'Pending'
    })
    console.log('✅ Job created:', job.data.jobNo)
    
    // Test 6: Get all jobs
    console.log('\n6️⃣ Fetching all jobs...')
    const jobs = await axios.get(`${API_URL}/jobs`)
    console.log(`✅ Found ${jobs.data.length} job(s)`)
    
    // Test 7: Get dashboard stats
    console.log('\n7️⃣ Getting dashboard stats...')
    const stats = await axios.get(`${API_URL}/jobs/meta/stats`)
    console.log('✅ Stats:', stats.data)
    
    // Test 8: Update job status
    console.log('\n8️⃣ Updating job status...')
    await axios.patch(`${API_URL}/jobs/${job.data._id}/status`, { status: 'In Progress' })
    console.log('✅ Job status updated')
    
    // Test 9: Get shop info
    console.log('\n9️⃣ Getting shop info...')
    const shop = await axios.get(`${API_URL}/shop`)
    console.log('✅ Shop:', shop.data.name)
    
    console.log('\n🎉 All tests passed! Backend is working perfectly!')
    console.log('\n📊 Summary:')
    console.log(`   - Customers: ${customers.data.length}`)
    console.log(`   - Workers: 1`)
    console.log(`   - Jobs: ${jobs.data.length}`)
    console.log(`   - Total Jobs: ${stats.data.totalJobs}`)
    console.log(`   - Pending Jobs: ${stats.data.pendingJobs}`)
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
  }
}

testAPI()
