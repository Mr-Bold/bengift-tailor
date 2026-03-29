import { useState } from 'react'
import './Masters.css'
import { customersAPI, workersAPI, fabricsAPI } from '../services/api'

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
    const [newClient, setNewClient] = useState({ 
      name: '', 
      address: '', 
      city: '', 
      state: '', 
      dob: '', 
      phone: '', 
      email: '' 
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
          const savedClient = await customersAPI.create(client)
          setCustomers([...customers, savedClient.data])
          setNewClient({ name: '', address: '', city: '', state: '', dob: '', phone: '', email: '' })
          setShowAddForm(false)
          alert('Client added successfully!')
        } catch (error) {
          console.error('Error adding client:', error)
          alert('Error adding client. Saved to localStorage as backup.')
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
                  <button 
                    onClick={() => handleDeleteClient(client.id || client._id)}
                    className="btn-delete-client"
                  >
                    Delete
                  </button>
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
          const savedWorker = await workersAPI.create(worker)
          setWorkers([...workers, savedWorker.data])
          setNewWorker({ name: '', address: '', city: '', state: '', phone: '', skill: '', salary: '' })
          setShowAddForm(false)
          alert('Worker added successfully!')
        } catch (error) {
          console.error('Error adding worker:', error)
          alert('Error adding worker. Saved to localStorage as backup.')
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
                    {worker.salary && <p>Salary: ₵{worker.salary}/month</p>}
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
  // Items Master
    const ItemsMaster = () => {
      const [searchTerm, setSearchTerm] = useState('')
      const [showAddForm, setShowAddForm] = useState(false)
      const [itemType, setItemType] = useState('fabric')
      const [newItem, setNewItem] = useState({
        name: '',
        measurementFields: '',
        fees: 0,
        workerFees: 0,
        productionCapacity: 0,
        pendingOrders: 0
      })

      const filteredGarments = garmentTypes.filter(g =>
        g.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const filteredFabrics = fabrics.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const handleAddItem = async () => {
        if (newItem.name.trim()) {
          if (itemType === 'garment') {
            setGarmentTypes([...garmentTypes, newItem.name.trim()])
            alert('Garment type added successfully!')
          } else {
            try {
              const fabric = {
                name: newItem.name.trim(),
                measurementFields: newItem.measurementFields,
                fees: parseFloat(newItem.fees) || 0,
                workerFees: parseFloat(newItem.workerFees) || 0,
                productionCapacity: parseInt(newItem.productionCapacity) || 0
              }
              const savedFabric = await fabricsAPI.create(fabric)
              setFabrics([...fabrics, savedFabric.data])
              alert('Fabric added successfully!')
            } catch (error) {
              console.error('Error adding fabric:', error)
              alert('Error adding fabric. Saved to localStorage as backup.')
              // Fallback
              setFabrics([...fabrics, { 
                id: uid(), 
                name: newItem.name.trim(),
                measurementFields: newItem.measurementFields,
                fees: newItem.fees,
                workerFees: newItem.workerFees,
                productionCapacity: newItem.productionCapacity,
                pendingOrders: newItem.pendingOrders
              }])
            }
          }
          setNewItem({
            name: '',
            measurementFields: '',
            fees: 0,
            workerFees: 0,
            productionCapacity: 0,
            pendingOrders: 0
          })
          setShowAddForm(false)
        }
      }

      const handleDeleteGarment = (index) => {
        if (window.confirm('Delete this garment type?')) {
          setGarmentTypes(garmentTypes.filter((_, i) => i !== index))
        }
      }

      const handleDeleteFabric = async (id) => {
        if (window.confirm('Delete this fabric?')) {
          try {
            const fabric = fabrics.find(f => f.id === id || f._id === id)
            if (fabric && fabric._id) {
              await fabricsAPI.delete(fabric._id)
            }
            setFabrics(fabrics.filter(f => f.id !== id && f._id !== id))
          } catch (error) {
            console.error('Error deleting fabric:', error)
            setFabrics(fabrics.filter(f => f.id !== id && f._id !== id))
          }
        }
      }

      const allItems = searchTerm ? [...filteredGarments, ...filteredFabrics.map(f => f.name)] : []
      const hasResults = searchTerm && (filteredGarments.length > 0 || filteredFabrics.length > 0)

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
            {searchTerm && !hasResults ? (
              <div className="no-items">No items found matching your search</div>
            ) : !searchTerm ? (
              <div className="items-display">
                <div className="items-section">
                  <h4>Garment Types ({garmentTypes.length})</h4>
                  <div className="items-list">
                    {garmentTypes.map((g, i) => (
                      <div key={i} className="item-card">
                        <span>{g}</span>
                        <button 
                          onClick={() => handleDeleteGarment(i)}
                          className="btn-delete-item"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="items-section">
                  <h4>Fabrics ({fabrics.length})</h4>
                  <div className="items-list">
                    {fabrics.map(f => (
                      <div key={f.id || f._id} className="item-card">
                        <span>{f.name}</span>
                        <button 
                          onClick={() => handleDeleteFabric(f.id || f._id)}
                          className="btn-delete-item"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="search-results">
                {filteredGarments.length > 0 && (
                  <div className="results-section">
                    <h5>Garment Types</h5>
                    {filteredGarments.map((g, i) => (
                      <div key={i} className="result-item">{g}</div>
                    ))}
                  </div>
                )}
                {filteredFabrics.length > 0 && (
                  <div className="results-section">
                    <h5>Fabrics</h5>
                    {filteredFabrics.map(f => (
                      <div key={f.id || f._id} className="result-item">{f.name}</div>
                    ))}
                  </div>
                )}
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
                  <label>Item Type :</label>
                  <select 
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="item-type-select"
                  >
                    <option value="garment">Garment Type (No Fees)</option>
                    <option value="fabric">Fabric/Item with Fees</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Name :</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Shirt, Trouser"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>

                {itemType === 'fabric' && (
                  <>
                    <div className="form-group">
                      <label>Item's Measurement Fields</label>
                      <p className="field-hint">Enter field name line by line, if field has default value, enter field name and =value e.g. Height=100,Double Pocket=Yes</p>
                      <textarea 
                        placeholder="Measurement 1&#10;Measurement 2&#10;Measurement 3=Default Value"
                        value={newItem.measurementFields}
                        onChange={(e) => setNewItem({...newItem, measurementFields: e.target.value})}
                        rows="6"
                      />
                    </div>

                    <div className="form-group">
                      <label>Fees :</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newItem.fees}
                        onChange={(e) => setNewItem({...newItem, fees: parseFloat(e.target.value) || 0})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Worker's Fees :</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newItem.workerFees}
                        onChange={(e) => setNewItem({...newItem, workerFees: parseFloat(e.target.value) || 0})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Per day production capacity :</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newItem.productionCapacity}
                        onChange={(e) => setNewItem({...newItem, productionCapacity: parseFloat(e.target.value) || 0})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Pending orders :</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newItem.pendingOrders}
                        onChange={(e) => setNewItem({...newItem, pendingOrders: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </>
                )}

                <div className="form-buttons">
                  <button onClick={() => setNewItem({ name: '', measurementFields: '', fees: 0, workerFees: 0, productionCapacity: 0, pendingOrders: 0 })} className="btn-delete">Delete</button>
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
        alert('Account added successfully!')
      } else if (accounts.includes(newAccount.trim())) {
        alert('This account already exists!')
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
                    ×
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
              <button className="btn-close" onClick={() => setShowMenu(false)}>✕</button>
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
