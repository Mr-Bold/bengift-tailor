import mongoose from 'mongoose'

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  gstNo: String,
  logo: String,
  currency: {
    type: String,
    default: '₵'
  },
  garmentTypes: {
    type: [String],
    default: ['Shirt', 'Pant', 'Suit', 'Blazer', 'Kurta', 'Sherwani', 'Dress', 'Blouse', 'Skirt']
  }
}, {
  timestamps: true
})

export default mongoose.model('Shop', shopSchema)
