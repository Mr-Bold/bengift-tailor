import { useState, useEffect } from 'react'
import './NewJobCard.css'
import logo from '../assets/logo.png'

function NewJobCard({ ctx, setPage }) {
  const { jobs, setJobs, customers, setCustomers, garmentTypes, fabrics, workers, uid, today } = ctx

  const [jobId, setJobId] = useState('')
  const [date, setDate] = useState(today())
  const [clientName, setClientName] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [trialDate, setTrialDate] = useState('')
  const [assignedWorker, setAssignedWorker] = useState('')
  const [items, setItems] = useState([])
  const [receiptAccount, setReceiptAccount] = useState('Cash')
  const [amountReceived, setAmountReceived] = useState(0)
  const [delivered, setDelivered] = useState(false)
  const [cancelJobCard, setCancelJobCard] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  
  const [customerSuggestions, setCustomerSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showMeasurementModal, setShowMeasurementModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedItemDetails, setSelectedItemDetails] = useState(null)
  const [itemSearchTerm, setItemSearchTerm] = useState('')
  const [showItemSearchResults, setShowItemSearchResults] = useState(false)
  const [measurements, setMeasurements] = useState({
    chest: '', waist: '', hip: '', shoulder: '', armLength: '', 
    neckSize: '', sleeveLength: '', inseam: '', length: '', 
    backLength: '', frontLength: '', armhole: ''
  })
  const [itemDetails, setItemDetails] = useState({
    quantity: 1,
    fees: 0,
    discount: 0,
    clothRemark: '',
    clientNote: '',
    clothColor: ''
  })
  const [images, setImages] = useState({
    image1: null,
    image2: null
  })
  const [showColorPicker, setShowColorPicker] = useState(false)


  useEffect(() => {
    // Generate new job ID
    if (jobs.length === 0) {
      setJobId('1')
    } else {
      const lastJob = jobs[jobs.length - 1]
      const lastNoStr = lastJob.jobNo || lastJob.jobId || '0'
      const lastNo = parseInt(lastNoStr.replace(/\D/g, '')) || 0
      setJobId(String(lastNo + 1))
    }
    
    setDate(today())
  }, [jobs, today])

  const handleClientNameChange = (value) => {
    setClientName(value)
    
    if (value.length > 0) {
      const matches = customers.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase())
      )
      setCustomerSuggestions(matches)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectCustomer = (customer) => {
    setClientName(customer.name)
    setShowSuggestions(false)
  }

  const addItem = () => {
    if (!clientName.trim()) {
      alert('Please enter Client Name first')
      return
    }
    
    setShowMeasurementModal(true)
  }

  const handleSaveMeasurements = () => {
    const newItem = {
      item: selectedItem || 'New Item',
      remark: itemDetails.clothRemark,
      qty: itemDetails.quantity,
      fees: itemDetails.fees,
      discount: itemDetails.discount,
      finalFees: itemDetails.fees - (itemDetails.fees * itemDetails.discount / 100),
      amount: itemDetails.quantity * (itemDetails.fees - (itemDetails.fees * itemDetails.discount / 100))
    }
    
    setItems([...items, newItem])
    setShowMeasurementModal(false)
    handleCleanForm()
  }

  const handleCancelMeasurements = () => {
    setShowMeasurementModal(false)
  }

  const handleCleanForm = () => {
    setSelectedItem('')
    setMeasurements({
      chest: '', waist: '', hip: '', shoulder: '', armLength: '', neckSize: ''
    })
    setItemDetails({
      quantity: 1,
      fees: 0,
      discount: 0,
      clothRemark: '',
      clientNote: '',
      clothColor: ''
    })
  }

  // Camera functionality
  const startCamera = async (imageNum) => {
    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      // Create video element
      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true
      video.playsInline = true
      video.style.width = '100%'
      video.style.maxWidth = '400px'
      video.style.borderRadius = '8px'
      video.style.display = 'block'
      video.style.margin = '0 auto'
      
      // Create capture button
      const captureBtn = document.createElement('button')
      captureBtn.textContent = '📷 Capture Photo'
      captureBtn.className = 'btn-capture-photo'
      captureBtn.onclick = () => capturePhoto(video, stream, imageNum)
      
      // Create cancel button
      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = '❌ Cancel'
      cancelBtn.className = 'btn-cancel-camera'
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop())
        modal.remove()
      }
      
      // Create modal
      const modal = document.createElement('div')
      modal.className = 'camera-modal'
      modal.innerHTML = '<div class="camera-modal-content"></div>'
      const content = modal.querySelector('.camera-modal-content')
      content.appendChild(video)
      
      const btnContainer = document.createElement('div')
      btnContainer.className = 'camera-buttons'
      btnContainer.appendChild(captureBtn)
      btnContainer.appendChild(cancelBtn)
      content.appendChild(btnContainer)
      
      document.body.appendChild(modal)
      
      // Focus video element for better UX
      video.focus()
    } catch (error) {
      console.error('Camera error:', error)
      let errorMessage = 'Could not access camera.'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Camera access requires HTTPS or localhost.'
      }
      
      alert(errorMessage)
    }
  }

  const capturePhoto = (video, stream, imageNum) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      if (canvas.width === 0 || canvas.height === 0) {
        alert('Video stream not ready. Please try again.')
        return
      }
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8)
      setImages({...images, [`image${imageNum}`]: base64})
      
      // Stop camera and close modal
      stream.getTracks().forEach(track => track.stop())
      document.querySelector('.camera-modal')?.remove()
      
      alert('Photo captured successfully!')
    } catch (error) {
      console.error('Photo capture error:', error)
      alert('Failed to capture photo. Please try again.')
    }
  }

  const handleImageUpload = async (imageNum, file) => {
    if (file) {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImages({...images, [`image${imageNum}`]: e.target.result})
        }
        reader.readAsDataURL(file)
      } catch (error) {
        alert('Failed to upload image')
        console.error('Image upload error:', error)
      }
    }
  }

  const handleClearImage = (imageNum) => {
    setImages({...images, [`image${imageNum}`]: null})
  }



  const removeItem = () => {
    if (items.length > 0) {
      setItems(items.slice(0, -1))
    }
  }

  const clearItems = () => {
    setItems([])
  }

  const copyItem = () => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1]
      setItems([...items, { ...lastItem }])
    }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    
    if (field === 'qty' || field === 'fees' || field === 'discount') {
      const fees = newItems[index].fees || 0
      const discount = newItems[index].discount || 0
      const qty = newItems[index].qty || 0
      const discountAmount = (fees * discount) / 100
      newItems[index].finalFees = fees - discountAmount
      newItems[index].amount = qty * newItems[index].finalFees
    }
    
    setItems(newItems)
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)
  const amountDue = totalAmount - amountReceived

  const handleSave = async () => {
    if (!clientName || !deliveryDate || items.length === 0) {
      alert('Please fill in Client Name, Delivery Date, and add at least one item')
      return
    }

    try {
      const newJob = {
        jobNo: jobId,
        customerName: clientName,
        orderDate: date,
        deliveryDate,
        trialDate: trialDate || null,
        workerId: assignedWorker && assignedWorker.trim() !== '' ? assignedWorker : null,
        items,
        totalAmount,
        advancePaid: amountReceived,
        balance: amountDue,
        receiptAccount,
        status: delivered ? 'Delivered' : 'Pending',
        cancelled: cancelJobCard,
        cancelReason: cancelJobCard ? cancelReason : '',
        notes: ''
      }

      setJobs([...jobs, newJob])

      const existingCustomer = customers.find(c => c.name === clientName)
      if (!existingCustomer) {
        const newCustomer = {
          name: clientName,
          phone: '',
          email: '',
          address: ''
        }
        setCustomers([...customers, newCustomer])
      }

      alert('Job card saved successfully!')
      handleNew()
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Error saving job: ' + error.message)
    }
  }

  const handleNew = () => {
    const lastJob = jobs[jobs.length - 1]
    const lastNo = lastJob ? parseInt(lastJob.jobNo) : 0
    setJobId(String(lastNo + 1))
    setDate(today())
    setClientName('')
    setDeliveryDate('')
    setTrialDate('')
    setAssignedWorker('')
    setItems([])
    setReceiptAccount('Cash')
    setAmountReceived(0)
    setDelivered(false)
    setCancelJobCard(false)
    setCancelReason('')
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job card?')) {
      handleNew()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="new-job-card">
      {/* Add Item Modal - Based on Screenshot */}
      {showMeasurementModal && (
        <div className="add-item-modal-overlay">
          <div className="add-item-modal">
            <div className="modal-header">
              <h2>Add Item</h2>
              <button className="close-btn" onClick={handleCancelMeasurements}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="left-section">
                {/* Logo - Mobile First */}
                <div className="logo-section mobile-logo">
                  <img src={logo} alt="BG Logo" className="modal-logo" />
                </div>

                {/* Select Item Search */}
                <div className="select-item-section">
                  <label>Search Item :</label>
                  <div className="item-search-wrapper">
                    <input 
                      type="text"
                      value={itemSearchTerm}
                      onChange={(e) => {
                        setItemSearchTerm(e.target.value)
                        setShowItemSearchResults(e.target.value.length > 0)
                      }}
                      onFocus={() => setShowItemSearchResults(itemSearchTerm.length > 0)}
                      onBlur={() => setTimeout(() => setShowItemSearchResults(false), 200)}
                      placeholder="Type to search items..."
                      className="item-search-input"
                    />
                    {showItemSearchResults && (
                      <div className="item-search-results">
                        {garmentTypes
                          .filter(type => type.toLowerCase().includes(itemSearchTerm.toLowerCase()))
                          .map(type => (
                            <div 
                              key={type} 
                              className="item-search-result"
                              onClick={() => {
                                setSelectedItem(type)
                                setItemSearchTerm(type)
                                setShowItemSearchResults(false)
                              }}
                            >
                              {type}
                            </div>
                          ))
                        }
                        {garmentTypes.filter(type => type.toLowerCase().includes(itemSearchTerm.toLowerCase())).length === 0 && (
                          <div className="item-search-result no-results">No items found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image 1 Section */}
                <div className="image-section">
                  <div className="image-label">Image 1</div>
                  <div className="image-buttons">
                    <button 
                      className="img-btn" 
                      onClick={() => document.getElementById('image1-input').click()}
                    >
                      Hand Note
                    </button>
                    <button 
                      className="img-btn" 
                      onClick={() => startCamera(1)}
                    >
                      Web Cam
                    </button>
                    <button 
                      className="img-btn" 
                      onClick={() => handleClearImage(1)}
                    >
                      Clear
                    </button>
                    <input 
                      id="image1-input"
                      type="file" 
                      accept="image/*"
                      style={{display: 'none'}}
                      onChange={(e) => handleImageUpload(1, e.target.files[0])}
                    />
                  </div>
                  <div className="image-placeholder">
                    {images.image1 ? (
                      <img src={images.image1} alt="Image 1" className="captured-image" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </div>

                {/* Image 2 Section */}
                <div className="image-section">
                  <div className="image-label">Image 2</div>
                  <div className="image-buttons">
                    <button 
                      className="img-btn" 
                      onClick={() => document.getElementById('image2-input').click()}
                    >
                      Insert Image
                    </button>
                    <button 
                      className="img-btn" 
                      onClick={() => startCamera(2)}
                    >
                      Web Cam
                    </button>
                    <button 
                      className="img-btn" 
                      onClick={() => handleClearImage(2)}
                    >
                      Clear
                    </button>
                    <input 
                      id="image2-input"
                      type="file" 
                      accept="image/*"
                      style={{display: 'none'}}
                      onChange={(e) => handleImageUpload(2, e.target.files[0])}
                    />
                  </div>
                  <div className="image-placeholder">
                    {images.image2 ? (
                      <img src={images.image2} alt="Image 2" className="captured-image" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="right-section">
                {/* Logo - Desktop Only */}
                <div className="logo-section desktop-logo">
                  <img src={logo} alt="BG Logo" className="modal-logo" />
                </div>

                {/* Measurements Grid */}
                <div className="measurements-section">
                  <div className="measurement-row">
                    <div className="measurement-field">
                      <label>Chest</label>
                      <input 
                        type="text" 
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                      />
                    </div>
                    <div className="measurement-field">
                      <label>Waist</label>
                      <input 
                        type="text" 
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="measurement-row">
                    <div className="measurement-field">
                      <label>Hip</label>
                      <input 
                        type="text" 
                        value={measurements.hip}
                        onChange={(e) => setMeasurements({...measurements, hip: e.target.value})}
                      />
                    </div>
                    <div className="measurement-field">
                      <label>Shoulder</label>
                      <input 
                        type="text" 
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({...measurements, shoulder: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="measurement-row">
                    <div className="measurement-field">
                      <label>Arm Length</label>
                      <input 
                        type="text" 
                        value={measurements.armLength}
                        onChange={(e) => setMeasurements({...measurements, armLength: e.target.value})}
                      />
                    </div>
                    <div className="measurement-field">
                      <label>Neck Size</label>
                      <input 
                        type="text" 
                        value={measurements.neckSize}
                        onChange={(e) => setMeasurements({...measurements, neckSize: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="item-details">
                  <div className="detail-row">
                    <div className="detail-field">
                      <label>Quantity</label>
                      <input 
                        type="number" 
                        value={itemDetails.quantity}
                        onChange={(e) => setItemDetails({...itemDetails, quantity: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div className="detail-field">
                      <label>Fees</label>
                      <input 
                        type="number" 
                        value={itemDetails.fees}
                        onChange={(e) => setItemDetails({...itemDetails, fees: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-field">
                      <label>Discount (%)</label>
                      <input 
                        type="number" 
                        value={itemDetails.discount}
                        onChange={(e) => setItemDetails({...itemDetails, discount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="detail-field">
                      <label>Final Fees</label>
                      <input 
                        type="number" 
                        value={itemDetails.fees - (itemDetails.fees * itemDetails.discount / 100)}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Buttons at bottom of item details */}
                  <div className="modal-buttons-inline">
                    <button className="footer-btn cancel-btn" onClick={handleCancelMeasurements}>Cancel</button>
                    <button className="footer-btn ok-btn" onClick={handleSaveMeasurements}>OK</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="job-card-title">Create New Job Card</div>
      
      <div className="job-card-header">
        <div className="header-left">
          <div className="form-group-inline">
            <label>JOB ID</label>
            <input type="text" value={jobId} className="input-small" readOnly />
          </div>
          <div className="form-group-inline">
            <label>Client Name :</label>
            <div className="autocomplete-wrapper">
              <input 
                type="text" 
                value={clientName}
                onChange={(e) => handleClientNameChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="input-medium"
              />
              {showSuggestions && customerSuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {customerSuggestions.map(c => (
                    <div key={c.id} onClick={() => selectCustomer(c)} className="suggestion-item">
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-group-inline">
            <label>Delivery Date :</label>
            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </div>
          <div className="form-group-inline">
            <label>Trial Date :</label>
            <input type="date" value={trialDate} onChange={(e) => setTrialDate(e.target.value)} />
          </div>
          <div className="form-group-inline">
            <label>Assign Worker :</label>
            <select 
              value={assignedWorker} 
              onChange={(e) => setAssignedWorker(e.target.value)}
              className="input-medium"
            >
              <option value="">-- Select Worker --</option>
              {workers && workers.map(worker => (
                <option key={worker.id || worker._id} value={worker.id || worker._id}>{worker.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="header-right">
          <div className="form-group-inline">
            <label>Date :</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="items-section">
        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Remark</th>
              <th>QTY</th>
              <th>FEES</th>
              <th>Discount %</th>
              <th>Final Fees</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <select 
                    value={item.item} 
                    onChange={(e) => updateItem(index, 'item', e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {garmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input 
                    type="text" 
                    value={item.remark}
                    onChange={(e) => updateItem(index, 'remark', e.target.value)}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)}
                    className="input-small"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.fees}
                    onChange={(e) => updateItem(index, 'fees', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.discount || 0}
                    onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                    className="input-small"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.finalFees || item.fees}
                    disabled
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.amount}
                    disabled
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions-section">
        <div className="left-actions">
          <button onClick={addItem} className="btn-action">Add</button>
          <button onClick={removeItem} className="btn-action">Remove</button>
          <button onClick={clearItems} className="btn-action">Clear</button>
          <button onClick={copyItem} className="btn-action">Copy</button>
        </div>
        
        <div className="payment-section">
          <div className="payment-left">
            <div className="form-group-inline">
              <label>Receipt Account :</label>
              <select value={receiptAccount} onChange={(e) => setReceiptAccount(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="delivery-options">
              <label>
                <input 
                  type="checkbox" 
                  checked={delivered}
                  onChange={(e) => setDelivered(e.target.checked)}
                />
                Delivered [All Items has been Delivered to client]
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={cancelJobCard}
                  onChange={(e) => setCancelJobCard(e.target.checked)}
                />
                Cancel Job Card
              </label>
              {cancelJobCard && (
                <input 
                  type="text" 
                  placeholder="Cancel Reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="cancel-reason"
                />
              )}
            </div>
          </div>
          
          <div className="payment-right">
            <div className="amount-row">
              <label>Total Amount :</label>
              <input type="number" value={totalAmount} disabled className="amount-total" />
            </div>
            <div className="amount-row">
              <label>Amount Received :</label>
              <input 
                type="number" 
                value={amountReceived}
                onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                className="amount-received"
              />
            </div>
            <div className="amount-row">
              <label>Amount Due :</label>
              <input type="number" value={amountDue} disabled className="amount-due" />
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-actions">
        <button onClick={handleNew} className="btn-bottom">New</button>
        <button onClick={handleDelete} className="btn-bottom">Delete</button>
        <button onClick={handlePrint} className="btn-bottom">Print</button>
        <button onClick={handleSave} className="btn-bottom btn-save">Save</button>
      </div>
    </div>
  )
}

export default NewJobCard