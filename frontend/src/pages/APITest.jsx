import { useState } from 'react'
import { jobsAPI, customersAPI, workersAPI, shopAPI } from '../services/api'

function APITest() {
  const [results, setResults] = useState([])
  const [testing, setTesting] = useState(false)

  const addResult = (test, status, message) => {
    setResults(prev => [...prev, { test, status, message }])
  }

  const runTests = async () => {
    setResults([])
    setTesting(true)

    try {
      // Test 1: Health check
      addResult('Health Check', 'testing', 'Checking API...')
      const health = await jobsAPI.getStats()
      addResult('Health Check', 'success', 'API is running')

      // Test 2: Get customers
      addResult('Get Customers', 'testing', 'Fetching customers...')
      const customers = await customersAPI.getAll()
      addResult('Get Customers', 'success', `Found ${customers.data.length} customers`)

      // Test 3: Get workers
      addResult('Get Workers', 'testing', 'Fetching workers...')
      const workers = await workersAPI.getAll()
      addResult('Get Workers', 'success', `Found ${workers.data.length} workers`)

      // Test 4: Get jobs
      addResult('Get Jobs', 'testing', 'Fetching jobs...')
      const jobs = await jobsAPI.getAll()
      addResult('Get Jobs', 'success', `Found ${jobs.data.length} jobs`)

      // Test 5: Get shop
      addResult('Get Shop Info', 'testing', 'Fetching shop...')
      const shop = await shopAPI.get()
      addResult('Get Shop Info', 'success', `Shop: ${shop.data.name}`)

      addResult('All Tests', 'success', '🎉 All API tests passed!')
    } catch (error) {
      addResult('Error', 'error', error.message)
    }

    setTesting(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Backend API Test</h1>
      <p>Test the connection between frontend and backend.</p>
      
      <button 
        onClick={runTests}
        disabled={testing}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {testing ? 'Testing...' : 'Run API Tests'}
      </button>

      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        {results.length === 0 ? (
          <p style={{ color: '#666' }}>Click "Run API Tests" to start</p>
        ) : (
          results.map((result, idx) => (
            <div 
              key={idx}
              style={{
                padding: '10px',
                marginBottom: '8px',
                background: 'white',
                borderRadius: '4px',
                borderLeft: `4px solid ${
                  result.status === 'success' ? '#4caf50' :
                  result.status === 'error' ? '#f44336' :
                  '#ff9800'
                }`
              }}
            >
              <strong>{result.test}:</strong> {result.message}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3>Backend Status</h3>
        <p>Backend URL: <code>http://localhost:5000/api</code></p>
        <p>Database: MongoDB (Local)</p>
        <p>
          <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer">
            Open Health Check
          </a>
        </p>
      </div>
    </div>
  )
}

export default APITest
