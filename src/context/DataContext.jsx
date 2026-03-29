import { createContext, useState, useEffect, useContext } from 'react'
import { jobsAPI, customersAPI, workersAPI, fabricsAPI, shopAPI } from '../services/api'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export function DataProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [customers, setCustomers] = useState([])
  const [workers, setWorkers] = useState([])
  const [fabrics, setFabrics] = useState([])
  const [shopInfo, setShopInfo] = useState({
    name: 'BenGift Clothing',
    phone: '+233209609002',
    email: 'info@bengiftclothing.com',
    address: '',
    currency: '₵'
  })
  const [garmentTypes, setGarmentTypes] = useState([
    'Shirt', 'Pant', 'Suit', 'Blazer', 'Kurta', 'Sherwani', 'Dress', 'Blouse', 'Skirt'
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load all data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      
      const [jobsRes, customersRes, workersRes, fabricsRes, shopRes] = await Promise.all([
        jobsAPI.getAll().catch(() => ({ data: [] })),
        customersAPI.getAll().catch(() => ({ data: [] })),
        workersAPI.getAll().catch(() => ({ data: [] })),
        fabricsAPI.getAll().catch(() => ({ data: [] })),
        shopAPI.get().catch(() => ({ data: null }))
      ])
      
      setJobs(jobsRes.data)
      setCustomers(customersRes.data)
      setWorkers(workersRes.data)
      setFabrics(fabricsRes.data)
      
      if (shopRes.data) {
        setShopInfo(shopRes.data)
        if (shopRes.data.garmentTypes) {
          setGarmentTypes(shopRes.data.garmentTypes)
        }
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Jobs operations
  const addJob = async (job) => {
    try {
      const response = await jobsAPI.create(job)
      setJobs([...jobs, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating job:', err)
      throw err
    }
  }

  const updateJob = async (id, updates) => {
    try {
      const response = await jobsAPI.update(id, updates)
      setJobs(jobs.map(j => j._id === id ? response.data : j))
      return response.data
    } catch (err) {
      console.error('Error updating job:', err)
      throw err
    }
  }

  const deleteJob = async (id) => {
    try {
      await jobsAPI.delete(id)
      setJobs(jobs.filter(j => j._id !== id))
    } catch (err) {
      console.error('Error deleting job:', err)
      throw err
    }
  }

  const updateJobStatus = async (id, status) => {
    try {
      const response = await jobsAPI.updateStatus(id, status)
      setJobs(jobs.map(j => j._id === id ? response.data : j))
    } catch (err) {
      console.error('Error updating job status:', err)
      throw err
    }
  }

  // Customers operations
  const addCustomer = async (customer) => {
    try {
      const response = await customersAPI.create(customer)
      setCustomers([...customers, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating customer:', err)
      throw err
    }
  }

  const updateCustomer = async (id, updates) => {
    try {
      const response = await customersAPI.update(id, updates)
      setCustomers(customers.map(c => c._id === id ? response.data : c))
    } catch (err) {
      console.error('Error updating customer:', err)
      throw err
    }
  }

  const deleteCustomer = async (id) => {
    try {
      await customersAPI.delete(id)
      setCustomers(customers.filter(c => c._id !== id))
    } catch (err) {
      console.error('Error deleting customer:', err)
      throw err
    }
  }

  // Workers operations
  const addWorker = async (worker) => {
    try {
      const response = await workersAPI.create(worker)
      setWorkers([...workers, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating worker:', err)
      throw err
    }
  }

  const updateWorker = async (id, updates) => {
    try {
      const response = await workersAPI.update(id, updates)
      setWorkers(workers.map(w => w._id === id ? response.data : w))
    } catch (err) {
      console.error('Error updating worker:', err)
      throw err
    }
  }

  const deleteWorker = async (id) => {
    try {
      await workersAPI.delete(id)
      setWorkers(workers.filter(w => w._id !== id))
    } catch (err) {
      console.error('Error deleting worker:', err)
      throw err
    }
  }

  // Fabrics operations
  const addFabric = async (fabric) => {
    try {
      const response = await fabricsAPI.create(fabric)
      setFabrics([...fabrics, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating fabric:', err)
      throw err
    }
  }

  const updateFabric = async (id, updates) => {
    try {
      const response = await fabricsAPI.update(id, updates)
      setFabrics(fabrics.map(f => f._id === id ? response.data : f))
    } catch (err) {
      console.error('Error updating fabric:', err)
      throw err
    }
  }

  const deleteFabric = async (id) => {
    try {
      await fabricsAPI.delete(id)
      setFabrics(fabrics.filter(f => f._id !== id))
    } catch (err) {
      console.error('Error deleting fabric:', err)
      throw err
    }
  }

  // Shop operations
  const updateShopInfo = async (updates) => {
    try {
      const response = await shopAPI.update(updates)
      setShopInfo(response.data)
    } catch (err) {
      console.error('Error updating shop:', err)
      throw err
    }
  }

  const value = {
    jobs,
    setJobs,
    customers,
    setCustomers,
    workers,
    setWorkers,
    fabrics,
    setFabrics,
    shopInfo,
    setShopInfo,
    garmentTypes,
    setGarmentTypes,
    loading,
    error,
    // Operations
    addJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addWorker,
    updateWorker,
    deleteWorker,
    addFabric,
    updateFabric,
    deleteFabric,
    updateShopInfo,
    refreshData: loadAllData,
    // Utilities
    uid: () => Math.random().toString(36).slice(2, 11),
    today: () => new Date().toISOString().split('T')[0]
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
