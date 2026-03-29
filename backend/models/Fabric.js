import mongoose from 'mongoose'

const fabricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fees: {
    type: Number,
    required: true,
    default: 0
  },
  workerFees: {
    type: Number,
    default: 0
  },
  productionCapacity: {
    type: Number,
    default: 0
  },
  measurementFields: String,
  description: String,
  category: String
}, {
  timestamps: true
})

fabricSchema.index({ name: 1 })

export default mongoose.model('Fabric', fabricSchema)
