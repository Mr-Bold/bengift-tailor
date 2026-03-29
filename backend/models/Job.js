import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  jobNo: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  trialDate: {
    type: Date
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  items: [{
    item: String,
    remark: String,
    qty: Number,
    fees: Number,
    discount: Number,
    finalFees: Number,
    amount: Number,
    measurements: {
      type: Map,
      of: String
    },
    clientNote: String,
    clothColor: String,
    images: {
      image1: String,
      image2: String
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  advancePaid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    required: true
  },
  receiptAccount: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Bank Transfer'],
    default: 'Cash'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Trial', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  cancelReason: String,
  notes: String
}, {
  timestamps: true
})

// Index for faster queries
jobSchema.index({ jobNo: 1 })
jobSchema.index({ customerName: 1 })
jobSchema.index({ status: 1 })
jobSchema.index({ orderDate: -1 })
jobSchema.index({ deliveryDate: 1 })

export default mongoose.model('Job', jobSchema)
