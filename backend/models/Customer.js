import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  city: String,
  state: String,
  pincode: String,
  birthday: Date,
  notes: String,
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for search
customerSchema.index({ name: 'text', phone: 'text' })
customerSchema.index({ phone: 1 })

export default mongoose.model('Customer', customerSchema)
