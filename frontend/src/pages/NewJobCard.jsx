import { useState, useEffect } from 'react'
import './NewJobCard.css'
import logo from '../assets/logo.png'
import { jobsAPI, customersAPI } from '../services/api'
import { showToast } from '../utils/toast'
import { compressAndConvert } from '../utils/imageCompression'
import { generateJobCardPDF } from '../utils/pdfGenerator'

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
  const [previewImage, setPreviewImage] = useState(null)
  const [showQuickFind, setShowQuickFind] = useState(false)
  const [showPendingOrders, setShowPendingOrders] = useState(false)
  const [quickFindFilters, setQuickFindFilters] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    mobile: ''
  })
  const [selectedQuickFindCustomer, setSelectedQuickFindCustomer] = useState(null)
  const [pendingOrdersCustomer, setPendingOrdersCustomer] = useState(null)

  useEffect(() => {
    // Generate new job ID
    if (jobs.length === 0) {
      setJobId('1')
    } else {
      const lastJob = jobs[jobs.length - 1]
      // Extract number from jobNo (handles formats like "JOB-001", "001", or just "1")
      const lastNoStr = lastJob.jobNo || lastJob.jobId || '0'
      const lastNo = parseInt(lastNoStr.replace(/\D/g, '')) || 0
      setJobId(String(lastNo + 1))
    }
    
    // Set date to today automatically
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
      showToast.error('Please enter Client Name first')
      return
    }
    
    setSelectedItem('')
    setMeasurements({
      chest: '', waist: '', hip: '', shoulder: '', armLength: '', 
      neckSize: '', sleeveLength: '', inseam: '', length: '', 
      backLength: '', frontLength: '', armhole: ''
    })
    setItemDetails({
      quantity: 1,
      fees: 0,
      discount: 0,
      clothRemark: '',
      clientNote: '',
      clothColor: ''
    })
    setImages({
      image1: null,
      image2: null
    })
    setShowMeasurementModal(true)
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

  const handleSaveMeasurements = () => {
    if (!selectedItem) {
      showToast.error('Please select an item')
      return
    }
    
    if (itemDetails.quantity <= 0) {
      showToast.error('Quantity must be greater than 0')
      return
    }
    
    if (itemDetails.fees < 0) {
      showToast.error('Fees cannot be negative')
      return
    }
    
    const discountAmount = (itemDetails.fees * itemDetails.discount) / 100
    const finalFees = itemDetails.fees - discountAmount
    const amount = itemDetails.quantity * finalFees
    
    setItems([...items, { 
      item: selectedItem, 
      remark: itemDetails.clothRemark, 
      qty: itemDetails.quantity, 
      fees: itemDetails.fees,
      discount: itemDetails.discount,
      finalFees: finalFees,
      amount: amount,
      measurements: measurements,
      clientNote: itemDetails.clientNote,
      clothColor: itemDetails.clothColor,
      images: images
    }])
    setShowMeasurementModal(false)
    handleCleanForm()
  }

  const handleItemSelection = (itemName) => {
    setSelectedItem(itemName)
    
    // First, try to find the item in fabrics (which have fees)
    let foundItem = fabrics.find(f => f.name === itemName)
    
    if (foundItem) {
      setSelectedItemDetails(foundItem)
      
      // Load measurement fields from the item
      if (foundItem.measurementFields) {
        const fields = foundItem.measurementFields.split('\n').filter(f => f.trim())
        const measurementObj = {}
        fields.forEach((field, index) => {
          const [fieldName, defaultValue] = field.split('=')
          const key = `measurement${index + 1}`
          measurementObj[key] = defaultValue ? defaultValue.trim() : ''
        })
        setMeasurements(prev => ({...prev, ...measurementObj}))
      }
      
      // Load fees from the item - this is the key part
      setItemDetails(prev => ({
        ...prev, 
        fees: foundItem.fees || 0, 
        discount: 0
      }))
    } else {
      // Item not found in fabrics
      setSelectedItemDetails(null)
      setItemDetails(prev => ({...prev, fees: 0, discount: 0}))
    }
  }

  const handleCancelMeasurements = () => {
    setShowMeasurementModal(false)
  }

  const handleImageUpload = async (imageNum, file) => {
    if (file) {
      try {
        showToast.loading('Compressing image...')
        const base64 = await compressAndConvert(file)
        setImages({...images, [`image${imageNum}`]: base64})
        showToast.success('Image uploaded successfully')
      } catch (error) {
        showToast.error('Failed to upload image')
        console.error('Image upload error:', error)
      }
    }
  }

  const handleClearImage = (imageNum) => {
    setImages({...images, [`image${imageNum}`]: null})
  }

  // Camera functionality
  const startCamera = async (imageNum) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      
      // Create video element
      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true
      video.playsInline = true
      video.style.width = '100%'
      video.style.maxWidth = '400px'
      video.style.borderRadius = '8px'
      
      // Create capture button
      const captureBtn = document.createElement('button')
      captureBtn.textContent = '?? Capture Photo'
      captureBtn.className = 'btn-capture-photo'
      captureBtn.onclick = () => capturePhoto(video, stream, imageNum)
      
      // Create cancel button
      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = '? Cancel'
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
    } catch (error) {
      console.error('Camera error:', error)
      showToast.error('Could not access camera. Please check permissions.')
    }
  }

  const capturePhoto = (video, stream, imageNum) => {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    const base64 = canvas.toDataURL('image/jpeg', 0.8)
    setImages({...images, [`image${imageNum}`]: base64})
    
    // Stop camera and close modal
    stream.getTracks().forEach(track => track.stop())
    document.querySelector('.camera-modal')?.remove()
    
    showToast.success('Photo captured successfully')
  }

  const handleCleanForm = () => {
    setSelectedItem('')
    setMeasurements({
      chest: '', waist: '', hip: '', shoulder: '', armLength: '', 
      neckSize: '', sleeveLength: '', inseam: '', length: '', 
      backLength: '', frontLength: '', armhole: ''
    })
    setItemDetails({
      quantity: 1,
      fees: 0,
      discount: 0,
      clothRemark: '',
      clientNote: '',
      clothColor: ''
    })
    setImages({
      image1: null,
      image2: null
    })
  }

  const commonColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
  ]

  const handleQuickFind = () => {
    setShowQuickFind(true)
  }

  const handlePendingOrdersStatus = () => {
    setShowPendingOrders(true)
  }

  const getFilteredCustomers = () => {
    return customers.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(quickFindFilters.name.toLowerCase())
      const addressMatch = (c.address || '').toLowerCase().includes(quickFindFilters.address.toLowerCase())
      const cityMatch = (c.city || '').toLowerCase().includes(quickFindFilters.city.toLowerCase())
      const stateMatch = (c.state || '').toLowerCase().includes(quickFindFilters.state.toLowerCase())
      const mobileMatch = (c.phone || '').includes(quickFindFilters.mobile)
      
      return nameMatch && addressMatch && cityMatch && stateMatch && mobileMatch
    })
  }

  const handleSelectCustomerFromQuickFind = (customer) => {
    setSelectedQuickFindCustomer(customer)
  }

  const handleConfirmQuickFindCustomer = () => {
    if (selectedQuickFindCustomer) {
      setClientName(selectedQuickFindCustomer.name)
      setShowQuickFind(false)
      setQuickFindFilters({ name: '', address: '', city: '', state: '', mobile: '' })
      setSelectedQuickFindCustomer(null)
    }
  }

  const handleCancelQuickFind = () => {
    setShowQuickFind(false)
    setQuickFindFilters({ name: '', address: '', city: '', state: '', mobile: '' })
    setSelectedQuickFindCustomer(null)
  }

  const getPendingOrdersForCustomer = (customerName) => {
    return jobs.filter(j => j.customerName === customerName && j.status !== 'Delivered')
  }

  const getCustomerPendingOrders = () => {
    if (!clientName.trim()) {
      return null
    }
    const customer = customers.find(c => c.name === clientName)
    if (!customer) {
      return null
    }
    const pendingOrders = getPendingOrdersForCustomer(clientName)
    return { customer, pendingOrders }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    
    // Recalculate finalFees and amount when fees or discount changes
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
      showToast.error('Please fill in Client Name, Delivery Date, and add at least one item')
      return
    }

    const loadingToast = showToast.loading('Saving job card...')

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

      console.log('?? Saving job to API:', newJob)
      
      // Save to API
      const savedJob = await jobsAPI.create(newJob)
      console.log('? Job saved successfully:', savedJob.data)
      
      // Update local state
      setJobs([...jobs, savedJob.data])

      // Add customer if new
      let customerPhone = ''
      const existingCustomer = customers.find(c => c.name === clientName)
      if (!existingCustomer) {
        const newCustomer = {
          name: clientName,
          phone: '',
          email: '',
          address: ''
        }
        const savedCustomer = await customersAPI.create(newCustomer)
        setCustomers([...customers, savedCustomer.data])
      } else {
        customerPhone = existingCustomer.phone
      }

      // Send SMS to customer
      if (customerPhone) {
        const smsMessage = SMS_CONFIG.templates.newOrder({
          customerName: clientName,
          jobNo: jobId,
          deliveryDate: deliveryDate,
          totalAmount: totalAmount.toFixed(2),
          advancePaid: amountReceived.toFixed(2),
          balance: amountDue.toFixed(2)
        })
        
        const smsResult = await sendSMS(customerPhone, smsMessage)
        
        if (smsResult.success) {
          showToast.success('Job card saved! SMS sent to customer.')
        } else {
          showToast.success('Job card saved! (SMS failed to send)')
        }
      } else {
        showToast.success('Job card saved successfully!')
      }

      handleNew()
    } catch (error) {
      console.error('? Error saving job:', error)
      console.error('Error details:', error.response?.data || error.message)
      showToast.error('Error saving job: ' + (error.response?.data?.message || error.message))
      
      // Fallback to localStorage
      const newJob = {
        id: uid(),
        jobNo: jobId,
        customerName: clientName,
        orderDate: date,
        deliveryDate,
        trialDate,
        workerId: assignedWorker || null,
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
      handleNew()
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
      {/* Measurement Modal - Same Page */}
      {showMeasurementModal && (
        <div className="measurement-modal-same-page">
          <div className="modal-header">
            <h2>Add Item</h2>
            <button className="modal-close" onClick={handleCancelMeasurements}>?</button>
          </div>

          <div className="modal-content">
            <div className="modal-left">
              {/* Item Selection */}
              <div className="item-selection">
                <label>Select Item :</label>
                <select 
                  value={selectedItem}
                  onChange={(e) => handleItemSelection(e.target.value)}
                  className="item-select"
                >
                  <option value="">-- Select Item --</option>
                  {garmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  {fabrics.map(fabric => (
                    <option key={fabric.id} value={fabric.name}>{fabric.name}</option>
                  ))}
                </select>
              </div>

              {/* Images Section */}
              <div className="images-section">
                <div className="image-box">
                  <div className="image-label">Image 1</div>
                  {!images.image1 ? (
                    <div className="image-buttons">
                      <button type="button" className="btn-image" onClick={() => document.getElementById('image1-input').click()}>?? Hand Note</button>
                      <button type="button" className="btn-image btn-camera" onClick={() => startCamera('image1')}>?? Web Cam</button>
                      <input 
                        id="image1-input"
                        type="file" 
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={(e) => handleImageUpload('image1', e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="image-preview-container">
                      <img src={images.image1} alt="Preview 1" className="image-preview" />
                      <button type="button" className="btn-clear-img" onClick={() => handleClearImage('image1')}>?</button>
                    </div>
                  )}
                </div>

                <div className="image-box">
                  <div className="image-label">Image 2</div>
                  {!images.image2 ? (
                    <div className="image-buttons">
                      <button type="button" className="btn-image" onClick={() => document.getElementById('image2-input').click()}>?? Insert Image</button>
                      <button type="button" className="btn-image btn-camera" onClick={() => startCamera('image2')}>?? Web Cam</button>
                      <input 
                        id="image2-input"
                        type="file" 
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={(e) => handleImageUpload('image2', e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="image-preview-container">
                      <img src={images.image2} alt="Preview 2" className="image-preview" />
                      <button type="button" className="btn-clear-img" onClick={() => handleClearImage('image2')}>?</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-right">
              {/* Body Figure */}
              <div className="body-figure">
                <img src={logo} alt="BenGift Clothing Logo" className="figure-logo" />
              </div>

              {/* Measurements Grid */}
              <div className="measurements-section">
                <div className="measurements-grid-2col">
                  <div className="measurement-input-small">
                    <label>Chest</label>
                    <input 
                      type="number" 
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                    />
                  </div>
                  <div className="measurement-input-small">
                    <label>Waist</label>
                    <input 
                      type="number" 
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                    />
                  </div>
                  <div className="measurement-input-small">
                    <label>Hip</label>
                    <input 
                      type="number" 
                      value={measurements.hip}
                      onChange={(e) => setMeasurements({...measurements, hip: e.target.value})}
                    />
                  </div>
                  <div className="measurement-input-small">
                    <label>Shoulder</label>
                    <input 
                      type="number" 
                      value={measurements.shoulder}
                      onChange={(e) => setMeasurements({...measurements, shoulder: e.target.value})}
                    />
                  </div>
                  <div className="measurement-input-small">
                    <label>Arm Length</label>
                    <input 
                      type="number" 
                      value={measurements.armLength}
                      onChange={(e) => setMeasurements({...measurements, armLength: e.target.value})}
                    />
                  </div>
                  <div className="measurement-input-small">
                    <label>Neck Size</label>
                    <input 
                      type="number" 
                      value={measurements.neckSize}
                      onChange={(e) => setMeasurements({...measurements, neckSize: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="item-details-section">
                <div className="detail-row">
                  <div className="detail-input">
                    <label>Quantity</label>
                    <input 
                      type="number" 
                      value={itemDetails.quantity}
                      onChange={(e) => setItemDetails({...itemDetails, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="detail-input">
                    <label>Fees</label>
                    <input 
                      type="number" 
                      value={itemDetails.fees}
                      onChange={(e) => setItemDetails({...itemDetails, fees: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-input">
                    <label>Discount (%)</label>
                    <input 
                      type="number" 
                      value={itemDetails.discount}
                      onChange={(e) => setItemDetails({...itemDetails, discount: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="100"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="detail-input">
                    <label>Final Fees</label>
                    <input 
                      type="number" 
                      value={(itemDetails.fees - (itemDetails.fees * itemDetails.discount) / 100).toFixed(2)}
                      disabled
                    />
                  </div>
                </div>

                <div className="detail-input-full">
                  <label>Cloth Remark</label>
                  <input 
                    type="text" 
                    value={itemDetails.clothRemark}
                    onChange={(e) => setItemDetails({...itemDetails, clothRemark: e.target.value})}
                  />
                </div>

                <div className="detail-input-full">
                  <label>Client Note</label>
                  <textarea 
                    value={itemDetails.clientNote}
                    onChange={(e) => setItemDetails({...itemDetails, clientNote: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="detail-input-full">
                  <label>Cloth Color :</label>
                  <div className="color-picker-wrapper">
                    <input 
                      type="text" 
                      placeholder="[Click Box to set color]"
                      value={itemDetails.clothColor}
                      onChange={(e) => setItemDetails({...itemDetails, clothColor: e.target.value})}
                      className="color-input"
                      readOnly
                    />
                    <button 
                      className="btn-color-picker"
                      style={{backgroundColor: itemDetails.clothColor || '#f0f0f0'}}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    {showColorPicker && (
                      <div className="color-palette">
                        {commonColors.map(color => (
                          <button
                            key={color}
                            className="color-option"
                            style={{backgroundColor: color}}
                            onClick={() => {
                              setItemDetails({...itemDetails, clothColor: color})
                              setShowColorPicker(false)
                            }}
                            title={color}
                          />
                        ))}
                        <input 
                          type="color" 
                          value={itemDetails.clothColor || '#ffffff'}
                          onChange={(e) => setItemDetails({...itemDetails, clothColor: e.target.value})}
                          className="custom-color-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={handleCleanForm} className="btn-modal-clean">Clean Form</button>
            <button onClick={handleSaveMeasurements} className="btn-modal-ok">OK</button>
          </div>
        </div>
      )}

      {/* Quick Find Modal */}
      {showQuickFind && (
        <div className="quick-find-overlay">
          <div className="quick-find-modal">
            <div className="quick-find-header">
              <h2>Find Client</h2>
              <button className="quick-find-close" onClick={handleCancelQuickFind}>?</button>
            </div>

            <div className="quick-find-content">
              <div className="quick-find-main">
                {/* Left Side - Search Filters */}
                <div className="quick-find-left">
                  <div className="search-filters">
                    <div className="filter-item">
                      <label>Client Name :</label>
                      <input 
                        type="text"
                        value={quickFindFilters.name}
                        onChange={(e) => setQuickFindFilters({...quickFindFilters, name: e.target.value})}
                        placeholder="Search by name"
                      />
                    </div>
                    <div className="filter-item">
                      <label>Address :</label>
                      <input 
                        type="text"
                        value={quickFindFilters.address}
                        onChange={(e) => setQuickFindFilters({...quickFindFilters, address: e.target.value})}
                        placeholder="Search by address"
                      />
                    </div>
                    <div className="filter-item">
                      <label>City/Town/Village :</label>
                      <input 
                        type="text"
                        value={quickFindFilters.city}
                        onChange={(e) => setQuickFindFilters({...quickFindFilters, city: e.target.value})}
                        placeholder="Search by city"
                      />
                    </div>
                    <div className="filter-item">
                      <label>State/Provision :</label>
                      <input 
                        type="text"
                        value={quickFindFilters.state}
                        onChange={(e) => setQuickFindFilters({...quickFindFilters, state: e.target.value})}
                        placeholder="Search by state"
                      />
                    </div>
                    <div className="filter-item">
                      <label>Mobile :</label>
                      <input 
                        type="text"
                        value={quickFindFilters.mobile}
                        onChange={(e) => setQuickFindFilters({...quickFindFilters, mobile: e.target.value})}
                        placeholder="Search by mobile"
                      />
                    </div>
                  </div>

                  <div className="search-results-section">
                    <h3>Search Results :</h3>
                    <table className="search-results-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>Mobile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredCustomers().length === 0 ? (
                          <tr>
                            <td colSpan="4" className="no-results">No customers found</td>
                          </tr>
                        ) : (
                          getFilteredCustomers().map(customer => (
                            <tr 
                              key={customer.id} 
                              onClick={() => handleSelectCustomerFromQuickFind(customer)}
                              className={`result-row ${selectedQuickFindCustomer?.id === customer.id ? 'selected' : ''}`}
                            >
                              <td>{customer.name}</td>
                              <td>{customer.address || '-'}</td>
                              <td>{customer.city || '-'}</td>
                              <td>{customer.phone || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side - Selected Customer Details */}
                <div className="quick-find-right">
                  {selectedItemDetails ? (
                    <div className="item-details-display">
                      <h3>Item Details</h3>
                      <div className="detail-box">
                        <div className="detail-item">
                          <label>Item Name :</label>
                          <span>{selectedItemDetails.name}</span>
                        </div>
                        <div className="detail-item">
                          <label>Fees :</label>
                          <span>?{selectedItemDetails.fees || 0}</span>
                        </div>
                        <div className="detail-item">
                          <label>Worker's Fees :</label>
                          <span>?{selectedItemDetails.workerFees || 0}</span>
                        </div>
                        <div className="detail-item">
                          <label>Production Capacity :</label>
                          <span>{selectedItemDetails.productionCapacity || 0} per day</span>
                        </div>
                        <div className="detail-item">
                          <label>Pending Orders :</label>
                          <span>{selectedItemDetails.pendingOrders || 0}</span>
                        </div>
                      </div>

                      {selectedItemDetails.measurementFields && (
                        <div className="measurement-fields-display">
                          <h4>Measurement Fields</h4>
                          <div className="fields-list">
                            {selectedItemDetails.measurementFields.split('\n').map((field, idx) => (
                              field.trim() && (
                                <div key={idx} className="field-item">
                                  {field}
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-selection">
                      <p>Select an item to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="quick-find-footer">
              <button onClick={handleCancelQuickFind} className="btn-quick-find-cancel">Cancel</button>
              <button 
                onClick={handleConfirmQuickFindCustomer} 
                className="btn-quick-find-ok"
                disabled={!selectedQuickFindCustomer}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Orders Modal */}
      {showPendingOrders && (
        <div className="pending-orders-overlay">
          <div className="pending-orders-modal">
            <div className="pending-orders-header">
              <h2>Pending Orders Status</h2>
              <button className="pending-orders-close" onClick={() => setShowPendingOrders(false)}>?</button>
            </div>

            <div className="pending-orders-content">
              {!clientName.trim() ? (
                <div className="no-customer-message">
                  <p>Please select a customer first to view pending orders</p>
                </div>
              ) : !getCustomerPendingOrders() ? (
                <div className="no-customer-message">
                  <p>Customer not found</p>
                </div>
              ) : getCustomerPendingOrders().pendingOrders.length === 0 ? (
                <div className="no-orders-message">
                  <p>No pending orders for {clientName}</p>
                </div>
              ) : (
                <div className="orders-list">
                  <h3>{clientName} - Pending Orders</h3>
                  <table className="pending-orders-table">
                    <thead>
                      <tr>
                        <th>Job ID</th>
                        <th>Order Date</th>
                        <th>Delivery Date</th>
                        <th>Trial Date</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total Amount</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCustomerPendingOrders().pendingOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.jobNo}</td>
                          <td>{order.orderDate}</td>
                          <td>{order.deliveryDate}</td>
                          <td className={order.trialDate ? 'trial-available' : 'no-trial'}>
                            {order.trialDate || 'N/A'}
                          </td>
                          <td>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.items.length}</td>
                          <td>?{order.totalAmount.toFixed(2)}</td>
                          <td className="balance-amount">?{order.balance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pending-orders-footer">
              <button onClick={() => setShowPendingOrders(false)} className="btn-pending-orders-close">Close</button>
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
          <button className="btn-quick-find" onClick={handleQuickFind}>Quick Find</button>
          <button className="btn-pending-status" onClick={handlePendingOrdersStatus}>Pending Orders Status</button>
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

