import { useState } from 'react'
import './Masters.css'
import { customersAPI, workersAPI, fabricsAPI } from '../services/api'
import { showToast } from '../utils/toast'

function Masters({ ctx }) {
  const { garmentTypes, setGarmentTypes, fabrics, setFabrics, workers, setWorkers, customers, setCustomers, uid } = ctx
  const [showMenu, setShowMenu] = useState(true)
  const [selectedMaster, setSelectedMaster] = useState(null)

  const handleMenuClick = (masterType) => {
    setSelectedMaster(masterType)
    setShowMenu(false)
  }

  const handleBack = () => {
    setShowMenu(true)
    setSelectedMaster(null)
  }

  // Clients Master
  const ClientsMaster = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedClient, setSelectedClient] = useState(null)
    const [showClientDetails, setShowClientDetails] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editedClient, setEditedClient] = useState(null)
    const [newClient, setNewClient] = useState({ 
      name: '', 
      address: '', 
      city: '', 
      state: '', 
      dob: '', 
      phone: '', 
      email: '' 
    })
    const [clientMeasurements, setClientMeasurements] = useState({
      chest: '',
      waist: '',
      hip: '',
      shoulder: '',
      armLength: '',
      neckSize: '',
      sleeveLength: '',
      inseam: '',
      length: '',
      backLength: '',
      frontLength: '',
      armhole: ''
    })
    const [clientImages, setClientImages] = useState({
      image1: null,
      image2: null
    })

    const filteredCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm)
    )

    const handleAddClient = async () => {
      if (newClient.name.trim()) {
        try {
          const client = {
            name: newClient.name,
            address: newClient.address || '',
            city: newClient.city || '',
            state: newClient.state || '',
            birthday: newClient.dob || null,
            phone: newClient.phone || '',
            email: newClient.email || ''
          }
          const response = await customersAPI.create(client)
          const savedClient = response.data || response
          setCustomers([...customers, savedClient])
          setNewClient({ name: '', address: '', city: '', state: '', dob: '', phone: '', email: '' })
          setShowAddForm(false)
          showToast.success('Client added successfully!')
        } catch (error) {
          console.error('Error adding client:', error)
          showToast.error('Error adding client. Saved to localStorage as backup.')
          // Fallback to localStorage
          const client = {
            id: uid(),
            name: newClient.name,
            address: newClient.address || '',
            city: newClient.city || '',
            state: newClient.state || '',
            dob: newClient.dob || '',
            phone: newClient.phone || '',
            email: newClient.email || ''
          }
          setCustomers([...customers, client])
          setNewClient({ name: '', address: '', city: '', state: '', dob: '', phone: '', email: '' })
          setShowAddForm(false)
        }
      }
    }

    const handleDeleteClient = async (id) => {
      if (window.confirm('Delete this client?')) {
        try {
          const client = customers.find(c => c.id === id || c._id === id)
          if (client && client._id) {
            await customersAPI.delete(client._id)
          }
          setCustomers(customers.filter(c => c.id !== id && c._id !== id))
        } catch (error) {
          console.error('Error deleting client:', error)
          // Still delete locally
          setCustomers(customers.filter(c => c.id !== id && c._id !== id))
        }
      }
    }

    const handleViewClientDetails = (client) => {
      setSelectedClient(client)
      setEditedClient({...client})
      setShowClientDetails(true)
      setEditMode(false)
      // Load client measurements and images from localStorage
      const storedMeasurements = localStorage.getItem(`client_measurements_${client.id || client._id}`)
      const storedImages = localStorage.getItem(`client_images_${client.id || client._id}`)
      if (storedMeasurements) setClientMeasurements(JSON.parse(storedMeasurements))
      if (storedImages) setClientImages(JSON.parse(storedImages))
    }

    const handleSaveClientDetails = async () => {
      try {
        const clientId = selectedClient.id || selectedClient._id
        if (editedClient._id) {
          await customersAPI.update(editedClient._id, editedClient)
        }
        const updatedCustomers = customers.map(c => 
          (c.id === clientId || c._id === clientId) ? editedClient : c
        )
        setCustomers(updatedCustomers)
        localStorage.setItem(`client_measurements_${clientId}`, JSON.stringify(clientMeasurements))
        localStorage.setItem(`client_images_${clientId}`, JSON.stringify(clientImages))
        showToast.success('Client details updated successfully!')
        setShowClientDetails(false)
        setEditMode(false)
      } catch (error) {
        console.error('Error updating client:', error)
        showToast.error('Error updating client')
      }
    }

    const handleImageUpload = (imageNum, file) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setClientImages({...clientImages, [`image${imageNum}`]: e.target.result})
        }
        reader.readAsDataURL(file)
      }
    }

    const handleClearImage = (imageNum) => {
      setClientImages({...clientImages, [`image${imageNum}`]: null})
    }

    return (
      <div className="masters-content">
        <div className="clients-title-bar">Clients</div>

        <div className="clients-search-section">
          <label>Search</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
          />
        </div>

        <div className="clients-list-container">
          {filteredCustomers.length === 0 ? (
            <div className="no-clients">
              {searchTerm ? 'No clients found matching your search' : 'No clients added yet'}
            </div>
          ) : (
            <div className="clients-list">
              {filteredCustomers.map(client => (
                <div key={client.id || client._id} className="client-card">
                  <div className="client-info">
                    <h4>{client.name}</h4>
                    <p>{client.phone}</p>
                    {client.email && <p>{client.email}</p>}
                    {client.address && <p>{client.address}</p>}
                    {client.city && <p>{client.city}</p>}
                    {client.dob && <p>DOB: {client.dob}</p>}
                  </div>
                  <div className="client-card-buttons">
                    <button 
                      onClick={() => handleViewClientDetails(client)}
                      className="btn-view-details"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDeleteClient(client.id || client._id)}
                      className="btn-delete-client"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="clients-bottom-actions">
          <button onClick={handleBack} className="btn-back">Back</button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-add-new">Add New</button>
        </div>

        {showAddForm && (
          <div className="add-client-form-overlay">
            <div className="add-client-form">
              <h3>Add New Client</h3>
              <div className="form-group">
                <label>Client Name :</label>
                <input 
                  type="text" 
                  placeholder="Enter client name *"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address :</label>
                <input 
                  type="text" 
                  placeholder="Enter address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>City/Town/Village :</label>
                <input 
                  type="text" 
                  placeholder="Enter city"
                  value={newClient.city}
                  onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>State/Provision :</label>
                <input 
                  type="text" 
                  placeholder="Enter state"
                  value={newClient.state}
                  onChange={(e) => setNewClient({...newClient, state: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Date of Birth :</label>
                <input 
                  type="date" 
                  value={newClient.dob}
                  onChange={(e) => setNewClient({...newClient, dob: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number :</label>
                <input 
                  type="tel" 
                  placeholder="eg 9829******, without 91 or +91"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email :</label>
                <input 
                  type="email" 
                  placeholder="Enter email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div className="form-buttons">
                <button onClick={() => setNewClient({ name: '', address: '', city: '', state: '', dob: '', phone: '', email: '' })} className="btn-delete">Delete</button>
                <button onClick={handleAddClient} className="btn-save">Save</button>
                <button onClick={() => setShowAddForm(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showClientDetails && selectedClient && (
          <div className="client-details-overlay">
            <div className="client-details-modal">
              <div className="client-details-header">
                <h2>{editMode ? 'Edit Client Details' : 'Client Details'}</h2>
                <button className="btn-close-modal" onClick={() => setShowClientDetails(false)}>×</button>
              </div>

              <div className="client-details-content">
                <div className="client-details-left">
                  <div className="client-basic-info">
                    <h3>Basic Information</h3>
                    {editMode ? (
                      <>
                        <div className="form-group">
                          <label>Name:</label>
                          <input 
                            type="text"
                            value={editedClient.name}
                            onChange={(e) => setEditedClient({...editedClient, name: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone:</label>
                          <input 
                            type="tel"
                            value={editedClient.phone}
                            onChange={(e) => setEditedClient({...editedClient, phone: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email:</label>
                          <input 
                            type="email"
                            value={editedClient.email}
                            onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Address:</label>
                          <input 
                            type="text"
                            value={editedClient.address}
                            onChange={(e) => setEditedClient({...editedClient, address: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>City:</label>
                          <input 
                            type="text"
                            value={editedClient.city}
                            onChange={(e) => setEditedClient({...editedClient, city: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>State:</label>
                          <input 
                            type="text"
                            value={editedClient.state}
                            onChange={(e) => setEditedClient({...editedClient, state: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>DOB:</label>
                          <input 
                            type="date"
                            value={editedClient.dob || editedClient.birthday || ''}
                            onChange={(e) => setEditedClient({...editedClient, dob: e.target.value, birthday: e.target.value})}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>Name:</strong> {selectedClient.name}</p>
                        <p><strong>Phone:</strong> {selectedClient.phone}</p>
                        <p><strong>Email:</strong> {selectedClient.email || '—'}</p>
                        <p><strong>Address:</strong> {selectedClient.address || '—'}</p>
                        <p><strong>City:</strong> {selectedClient.city || '—'}</p>
                        <p><strong>State:</strong> {selectedClient.state || '—'}</p>
                        <p><strong>DOB:</strong> {selectedClient.dob || selectedClient.birthday || '—'}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="client-details-right">
                  <div className="client-measurements">
                    <h3>Measurements</h3>
                    <div className="measurements-grid">
                      {Object.keys(clientMeasurements).map(key => (
                        <div key={key} className="measurement-item">
                          <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                          <input 
                            type="text"
                            value={clientMeasurements[key]}
                            onChange={(e) => setClientMeasurements({...clientMeasurements, [key]: e.target.value})}
                            disabled={!editMode}
                            className={editMode ? '' : 'disabled'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="client-images">
                    <h3>Images</h3>
                    <div className="images-container">
                      {[1, 2].map(num => (
                        <div key={num} className="image-box">
                          <label>Image {num}</label>
                          <div className="image-preview">
                            {clientImages[`image${num}`] ? (
                              <img src={clientImages[`image${num}`]} alt={`Image ${num}`} />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                          </div>
                          {editMode && (
                            <div className="image-buttons">
                              <button 
                                onClick={() => document.getElementById(`client-image-${num}`).click()}
                                className="btn-upload"
                              >
                                Upload
                              </button>
                              <button 
                                onClick={() => handleClearImage(num)}
                                className="btn-clear"
                              >
                                Clear
                              </button>
                              <input 
                                id={`client-image-${num}`}
                                type="file"
                                accept="image/*"
                                style={{display: 'none'}}
                                onChange={(e) => handleImageUpload(num, e.target.files[0])}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="client-details-footer">
                {editMode ? (
                  <>
                    <button onClick={() => setEditMode(false)} className="btn-cancel">Cancel</button>
                    <button onClick={handleSaveClientDetails} className="btn-save">Save Changes</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setShowClientDetails(false)} className="btn-cancel">Close</button>
                    <button onClick={() => setEditMode(true)} className="btn-edit">Edit</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Workers Master
  const WorkersMaster = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [newWorker, setNewWorker] = useState({ 
      name: '', 
      address: '', 
      city: '', 
      state: '', 
      phone: '', 
      skill: '', 
      salary: '' 
    })

    const filteredWorkers = workers.filter(w =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.phone || '').includes(searchTerm)
    )

    const handleAddWorker = async () => {
      if (newWorker.name.trim()) {
        try {
          const worker = {
            name: newWorker.name,
            address: newWorker.address || '',
            city: newWorker.city || '',
            state: newWorker.state || '',
            phone: newWorker.phone || '',
            specialization: newWorker.skill ? [newWorker.skill] : [],
            salary: parseFloat(newWorker.salary) || 0,
            status: 'Active'
          }
          const response = await workersAPI.create(worker)
          const savedWorker = response.data || response // Handle both formats
          setWorkers([...workers, savedWorker])
          setNewWorker({ name: '', address: '', city: '', state: '', phone: '', skill: '', salary: '' })
          setShowAddForm(false)
          showToast.success('Worker added successfully!')
        } catch (error) {
          console.error('Error adding worker:', error)
          showToast.error('Error adding worker. Saved to localStorage as backup.')
          // Fallback
          setWorkers([...workers, { ...newWorker, id: uid() }])
          setNewWorker({ name: '', address: '', city: '', state: '', phone: '', skill: '', salary: '' })
          setShowAddForm(false)
        }
      }
    }

    const handleDeleteWorker = async (id) => {
      if (window.confirm('Delete this worker?')) {
        try {
          const worker = workers.find(w => w.id === id || w._id === id)
          if (worker && worker._id) {
            await workersAPI.delete(worker._id)
          }
          setWorkers(workers.filter(w => w.id !== id && w._id !== id))
        } catch (error) {
          console.error('Error deleting worker:', error)
          setWorkers(workers.filter(w => w.id !== id && w._id !== id))
        }
      }
    }

    return (
      <div className="masters-content">
        <div className="workers-title-bar">Workers</div>

        <div className="workers-search-section">
          <label>Search</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
          />
        </div>

        <div className="workers-list-container">
          {filteredWorkers.length === 0 ? (
            <div className="no-workers">
              {searchTerm ? 'No workers found matching your search' : 'No workers added yet'}
            </div>
          ) : (
            <div className="workers-list">
              {filteredWorkers.map(worker => (
                <div key={worker.id || worker._id} className="worker-card">
                  <div className="worker-info">
                    <h4>{worker.name}</h4>
                    <p>{worker.phone}</p>
                    {worker.address && <p>Address: {worker.address}</p>}
                    {worker.city && <p>City: {worker.city}</p>}
                    {worker.state && <p>State: {worker.state}</p>}
                    {worker.skill && <p>Skill: {worker.skill}</p>}
                    {worker.salary && <p>Salary: ?{worker.salary}/month</p>}
                  </div>
                  <button 
                    onClick={() => handleDeleteWorker(worker.id || worker._id)}
                    className="btn-delete-worker"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="workers-bottom-actions">
          <button onClick={handleBack} className="btn-back">Back</button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-add-new">Add New</button>
        </div>

        {showAddForm && (
          <div className="add-worker-form-overlay">
            <div className="add-worker-form">
              <h3>Add New Worker</h3>
              <div className="form-group">
                <label>Name :</label>
                <input 
                  type="text" 
                  placeholder="Enter worker name *"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address :</label>
                <input 
                  type="text" 
                  placeholder="Enter address"
                  value={newWorker.address}
                  onChange={(e) => setNewWorker({...newWorker, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>City :</label>
                <input 
                  type="text" 
                  placeholder="Enter city"
                  value={newWorker.city}
                  onChange={(e) => setNewWorker({...newWorker, city: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>State :</label>
                <input 
                  type="text" 
                  placeholder="Enter state"
                  value={newWorker.state}
                  onChange={(e) => setNewWorker({...newWorker, state: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mobile :</label>
                <input 
                  type="tel" 
                  placeholder="Enter mobile number"
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Skill :</label>
                <input 
                  type="text" 
                  placeholder="Enter skill"
                  value={newWorker.skill}
                  onChange={(e) => setNewWorker({...newWorker, skill: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Salary (per month) :</label>
                <input 
                  type="number" 
                  placeholder="Enter salary"
                  value={newWorker.salary}
                  onChange={(e) => setNewWorker({...newWorker, salary: e.target.value})}
                />
              </div>
              <div className="form-buttons">
                <button onClick={() => setNewWorker({ name: '', address: '', city: '', state: '', phone: '', skill: '', salary: '' })} className="btn-delete">Delete</button>
                <button onClick={handleAddWorker} className="btn-save">Save</button>
                <button onClick={() => setShowAddForm(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Items Master
  const ItemsMaster = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [editingItem, setEditingItem] = useState(null)
    const [editedName, setEditedName] = useState('')

    // Combine all items into one list
    const allItems = [...garmentTypes, ...fabrics.map(f => f.name)]
    const filteredItems = allItems.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddItem = () => {
      if (newItemName.trim()) {
        // Add to garmentTypes (simple items list)
        setGarmentTypes([...garmentTypes, newItemName.trim()])
        setNewItemName('')
        setShowAddForm(false)
        showToast.success('Item added successfully!')
      }
    }

    const handleEditClick = (itemName) => {
      setEditingItem(itemName)
      setEditedName(itemName)
    }

    const handleUpdateItem = async () => {
      if (editedName.trim() && editedName !== editingItem) {
        const oldName = editingItem
        const newName = editedName.trim()

        // Check if it's in garmentTypes
        if (garmentTypes.includes(oldName)) {
          const updatedGarments = garmentTypes.map(g => g === oldName ? newName : g)
          setGarmentTypes(updatedGarments)
          showToast.success('Item updated successfully!')
        } else {
          // Check if it's in fabrics
          const fabric = fabrics.find(f => f.name === oldName)
          if (fabric) {
            try {
              const updatedFabric = { ...fabric, name: newName }
              if (fabric._id) {
                await fabricsAPI.update(fabric._id, updatedFabric)
              }
              const updatedFabrics = fabrics.map(f => 
                (f.id || f._id) === (fabric.id || fabric._id) ? updatedFabric : f
              )
              setFabrics(updatedFabrics)
              showToast.success('Item updated successfully!')
            } catch (error) {
              console.error('Error updating fabric:', error)
              // Still update locally
              const updatedFabrics = fabrics.map(f => 
                (f.id || f._id) === (fabric.id || fabric._id) ? { ...f, name: newName } : f
              )
              setFabrics(updatedFabrics)
              showToast.success('Item updated locally!')
            }
          }
        }
        setEditingItem(null)
        setEditedName('')
      } else if (editedName === editingItem) {
        // No change, just cancel edit
        setEditingItem(null)
        setEditedName('')
      }
    }

    const handleCancelEdit = () => {
      setEditingItem(null)
      setEditedName('')
    }

    const handleDeleteItem = (itemName) => {
      if (window.confirm('Delete this item?')) {
        // Check if it's in garmentTypes
        if (garmentTypes.includes(itemName)) {
          setGarmentTypes(garmentTypes.filter(g => g !== itemName))
        } else {
          // Check if it's in fabrics
          const fabric = fabrics.find(f => f.name === itemName)
          if (fabric) {
            const fabricId = fabric.id || fabric._id
            fabricsAPI.delete(fabric._id).catch(err => console.error('Error deleting fabric:', err))
            setFabrics(fabrics.filter(f => (f.id || f._id) !== fabricId))
          }
        }
      }
    }

    return (
      <div className="masters-content">
        <div className="items-title-bar">Items</div>

        <div className="items-search-section">
          <label>Search</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items..."
          />
        </div>

        <div className="items-list-container">
          {filteredItems.length === 0 ? (
            <div className="no-items">
              {searchTerm ? 'No items found matching your search' : 'No items added yet'}
            </div>
          ) : (
            <div className="items-list">
              {filteredItems.map((item, idx) => (
                <div key={idx} className="item-card">
                  {editingItem === item ? (
                    <div className="item-edit-mode">
                      <input 
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateItem()
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                        className="item-edit-input"
                      />
                      <div className="item-edit-buttons">
                        <button onClick={handleUpdateItem} className="btn-update-item">✓</button>
                        <button onClick={handleCancelEdit} className="btn-cancel-edit">✕</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span onClick={() => handleEditClick(item)} className="item-name-editable">{item}</span>
                      <button 
                        onClick={() => handleDeleteItem(item)}
                        className="btn-delete-item"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="items-bottom-actions">
          <button onClick={handleBack} className="btn-back">Back</button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-add-new">Add New</button>
        </div>

        {showAddForm && (
          <div className="add-item-form-overlay">
            <div className="add-item-form">
              <h3>Add New Item</h3>

              <div className="form-group">
                <label>Item Name :</label>
                <input 
                  type="text" 
                  placeholder="e.g. Shirt, Trouser, Fabric"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                />
              </div>

              <div className="form-buttons">
                <button onClick={() => setNewItemName('')} className="btn-delete">Clear</button>
                <button onClick={handleAddItem} className="btn-save">Save</button>
                <button onClick={() => setShowAddForm(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Accounts Master
  const AccountsMaster = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [newAccount, setNewAccount] = useState('')
    const [accounts, setAccounts] = useState([
      'Cash',
      'Expense',
      'Purchase',
      'Sales',
      'Wages'
    ])

    const filteredAccounts = accounts.filter(a =>
      a.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddAccount = () => {
      if (newAccount.trim() && !accounts.includes(newAccount.trim())) {
        setAccounts([...accounts, newAccount.trim()])
        setNewAccount('')
        setShowAddForm(false)
        showToast.success('Account added successfully!')
      } else if (accounts.includes(newAccount.trim())) {
        showToast.error('This account already exists!')
      }
    }

    const handleDeleteAccount = (index) => {
      if (window.confirm('Delete this account?')) {
        setAccounts(accounts.filter((_, i) => i !== index))
      }
    }

    return (
      <div className="masters-content">
        <div className="accounts-title-bar">Accounts</div>

        <div className="accounts-search-section">
          <label>Search</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts..."
          />
        </div>

        <div className="accounts-list-container">
          {filteredAccounts.length === 0 ? (
            <div className="no-accounts">
              {searchTerm ? 'No accounts found matching your search' : 'No accounts available'}
            </div>
          ) : (
            <div className="accounts-list">
              {filteredAccounts.map((account, idx) => (
                <div key={idx} className="account-item">
                  <span>{account}</span>
                  <button 
                    onClick={() => handleDeleteAccount(accounts.indexOf(account))}
                    className="btn-delete-account"
                  >
                    �
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="accounts-bottom-actions">
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-add-new">Add New</button>
          <button onClick={handleBack} className="btn-back">Back</button>
        </div>

        {showAddForm && (
          <div className="add-account-form-overlay">
            <div className="add-account-form">
              <h3>Add New Account</h3>
              <input 
                type="text" 
                placeholder="Account name *"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
              />
              <div className="form-buttons">
                <button onClick={handleAddAccount} className="btn-save">Save</button>
                <button onClick={() => setShowAddForm(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="masters">
      {showMenu && (
        <div className="masters-menu-overlay">
          <div className="masters-menu">
            <div className="menu-header">
              <div className="menu-logo">
                <span className="logo-icon">M</span>
              </div>
              <h2>Masters</h2>
              <button className="btn-close" onClick={() => setShowMenu(false)}>?</button>
            </div>
            <div className="menu-items">
              <button className="menu-item" onClick={() => handleMenuClick('clients')}>
                Clients
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('workers')}>
                Workers
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('items')}>
                Items
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('accounts')}>
                Accounts
              </button>
              <button className="menu-item menu-back" onClick={() => setShowMenu(false)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {!showMenu && (
        <>
          {selectedMaster === 'clients' && <ClientsMaster />}
          {selectedMaster === 'workers' && <WorkersMaster />}
          {selectedMaster === 'items' && <ItemsMaster />}
          {selectedMaster === 'accounts' && <AccountsMaster />}
        </>
      )}
    </div>
  )
}

export default Masters

