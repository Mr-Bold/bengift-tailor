import { useState } from 'react'
import './ShopInfo.css'
import { shopAPI } from '../services/api'

function ShopInfo({ ctx }) {
  const { shopInfo, setShopInfo } = ctx
  const [form, setForm] = useState(shopInfo)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await shopAPI.update(form)
      setShopInfo(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving shop info:', error)
      alert('Error saving to database. Saved to localStorage as backup.')
      setShopInfo(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="shop-info">
      <div className="page-header">
        <h1>Shop Info</h1>
        <p>Manage your shop details</p>
      </div>

      <form className="shop-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Shop Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>GST No</label>
          <input
            type="text"
            name="gstNo"
            value={form.gstNo}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={`btn-submit ${saved ? 'saved' : ''}`}>
          {saved ? '✓ Saved!' : 'Save Shop Info'}
        </button>
      </form>
    </div>
  )
}

export default ShopInfo
