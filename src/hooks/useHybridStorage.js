import { useState, useEffect } from 'react'

/**
 * Hybrid storage hook that uses both API and localStorage
 * - Tries API first
 * - Falls back to localStorage if API fails
 * - Syncs localStorage with API data
 */
export function useHybridStorage(localKey, apiGet, apiSet, initialValue) {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [useAPI, setUseAPI] = useState(true)

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Try API first
      if (useAPI && apiGet) {
        const response = await apiGet()
        let apiData = response.data
        
        // Normalize MongoDB _id to id for consistency
        if (Array.isArray(apiData)) {
          apiData = apiData.map(item => ({
            ...item,
            id: item._id || item.id
          }))
        }
        
        setData(apiData)
        // Sync to localStorage as backup
        localStorage.setItem(localKey, JSON.stringify(apiData))
      } else {
        // Use localStorage
        loadFromLocalStorage()
      }
    } catch (error) {
      console.warn(`API failed for ${localKey}, using localStorage:`, error.message)
      setUseAPI(false)
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const item = localStorage.getItem(localKey)
      setData(item ? JSON.parse(item) : initialValue)
    } catch {
      setData(initialValue)
    }
  }

  const updateData = async (newData) => {
    setData(newData)
    
    // Always save to localStorage immediately
    localStorage.setItem(localKey, JSON.stringify(newData))
    
    // Try to sync with API
    if (useAPI && apiSet) {
      try {
        await apiSet(newData)
      } catch (error) {
        console.warn(`API sync failed for ${localKey}:`, error.message)
        // Continue using localStorage
      }
    }
  }

  return [data, updateData, loading]
}
