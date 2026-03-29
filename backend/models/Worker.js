import mongoose from 'mongoose'

const workerSchema = new mongoose.Schema({
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
  address: String,
  salary: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  specialization: [String],
  notes: String
}, {
  timestamps: true
})

workerSchema.index({ name: 1 })
workerSchema.index({ status: 1 })

export default mongoose.model('Worker', workerSchema)
