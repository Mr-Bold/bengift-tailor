import { useState, useEffect } from 'react'
import './App.css'
import './styles/responsive.css'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import NewJobCard from './pages/NewJobCard'
import JobRegister from './pages/JobRegister'
import Reports from './pages/Reports'
import Masters from './pages/Masters'
import ShopInfo from './pages/ShopInfo'
import Settings from './pages/Settings'
import About from './pages/About'
import SkeletonLoader from './components/SkeletonLoader'
import { jobsAPI, customersAPI, workersAPI, fabricsAPI, shopAPI } from './services/api'

// Utility functions
const uid = () => Math.random().toString(36).slice(2, 11)
const today = () => new Date().toISOString().split('T')[0]

// Hybrid storage: API + localStorage fallback
function useHybridStorage(localKey, apiGetFn, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [useAPI, setUseAPI] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      if (useAPI && apiGetFn) {
        const response = await apiGetFn()
        const apiData = response.data
        setValue(apiData)
        localStorage.setItem(localKey, JSON.stringify(apiData))
      } else {
        loadFromLocalStorage()
      }
    } catch (error) {
      console.warn(`API unavailable for ${localKey}, using localStorage`)
      setUseAPI(false)
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const item = localStorage.getItem(localKey)
      setValue(item ? JSON.parse(item) : initialValue)
    } catch {
      setValue(initialValue)
    }
  }

  const setStoredValue = (newValue) => {
    setValue(newValue)
    // Always save to localStorage immediately for backup
    localStorage.setItem(localKey, JSON.stringify(newValue))
    // Note: API saves are handled in individual components (NewJobCard, Masters, etc.)
    // This is because each operation (create/update/delete) needs different API calls
  }

  return [value, setStoredValue, loading, useAPI]
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  
  const [jobs, setJobs, jobsLoading, jobsUseAPI] = useHybridStorage('tm_jobs', jobsAPI.getAll, [])
  const [customers, setCustomers, customersLoading] = useHybridStorage('tm_customers', customersAPI.getAll, [])
  const [workers, setWorkers, workersLoading] = useHybridStorage('tm_workers', workersAPI.getAll, [])
  const [fabrics, setFabrics, fabricsLoading] = useHybridStorage('tm_fabrics', fabricsAPI.getAll, [])
  const [shopInfo, setShopInfo, shopLoading] = useHybridStorage('tm_shop', shopAPI.get, {
    name: 'BenGift Clothing',
    phone: '+233209609002',
    email: 'info@bengiftclothing.com',
    address: '',
    gstNo: '',
    logo: ''
  })
  
  const [measurements, setMeasurements] = useState(() => {
    try {
      const item = localStorage.getItem('tm_measurements')
      return item ? JSON.parse(item) : []
    } catch {
      return []
    }
  })
  
  const [garmentTypes, setGarmentTypes] = useState(() => {
    try {
      const item = localStorage.getItem('tm_garments')
      return item ? JSON.parse(item) : [
        'Shirt', 'Pant', 'Suit', 'Blazer', 'Kurta', 'Sherwani', 'Dress', 'Blouse', 'Skirt'
      ]
    } catch {
      return ['Shirt', 'Pant', 'Suit', 'Blazer', 'Kurta', 'Sherwani', 'Dress', 'Blouse', 'Skirt']
    }
  })

  const dataLoading = jobsLoading || customersLoading || workersLoading || fabricsLoading || shopLoading

  const context = {
    jobs,
    setJobs,
    customers,
    setCustomers,
    workers,
    setWorkers,
    shopInfo,
    setShopInfo,
    measurements,
    setMeasurements,
    fabrics,
    setFabrics,
    garmentTypes,
    setGarmentTypes,
    uid,
    today,
    useAPI: jobsUseAPI
  }

  // Handle page changes with loading state
  const handlePageChange = (page) => {
    setIsLoading(true)
    setCurrentPage(page)
    
    // Simulate loading delay to show skeleton
    setTimeout(() => {
      setIsLoading(false)
    }, 400)
  }

  // Determine skeleton type based on page
  const getSkeletonType = () => {
    if (currentPage === 'dashboard') return 'dashboard'
    if (currentPage === 'newjob') return 'form'
    if (currentPage === 'jobs' || currentPage === 'reports') return 'table'
    return 'default'
  }

  const pages = {
    dashboard: <Dashboard ctx={context} setPage={handlePageChange} />,
    newjob: <NewJobCard ctx={context} setPage={handlePageChange} />,
    jobs: <JobRegister ctx={context} setPage={handlePageChange} />,
    reports: <Reports ctx={context} setPage={handlePageChange} />,
    masters: <Masters ctx={context} />,
    shopinfo: <ShopInfo ctx={context} />,
    settings: <Settings ctx={context} />,
    about: <About ctx={context} />
  }

  // Show loading screen while data loads
  if (dataLoading) {
    return (
      <div className="app">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handlePageChange}
          shopInfo={shopInfo}
        />
        <main className="main-content">
          <SkeletonLoader type="dashboard" />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
        shopInfo={shopInfo}
      />
      <main className="main-content">
        {isLoading ? (
          <SkeletonLoader type={getSkeletonType()} />
        ) : (
          pages[currentPage]
        )}
      </main>
    </div>
  )
}

export default App
