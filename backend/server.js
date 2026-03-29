import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupCustomDNS } from './custom-dns-resolver.js'
import connectDB from './config/database.js'
import jobRoutes from './routes/jobs.js'
import customerRoutes from './routes/customers.js'
import workerRoutes from './routes/workers.js'
import fabricRoutes from './routes/fabrics.js'
import shopRoutes from './routes/shop.js'
import smsRoutes from './routes/sms.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

// Setup custom DNS resolver to bypass mobile carrier DNS issues
setupCustomDNS()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logger
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/jobs', jobRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/fabrics', fabricRoutes)
app.use('/api/shop', shopRoutes)
app.use('/api/sms', smsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BenGift Clothing API is running' })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV}`)
  console.log(`📍 API: http://localhost:${PORT}/api`)
})
