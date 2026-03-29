import { useState, useEffect } from 'react'

// Toggle between localStorage and API
const USE_API = false // Set to true to use backend API

export function useAPIStorage(key, apiGet, apiUpdate, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (USE_API) {
      // Fetch from API
      apiGet()
        .then(response => {
          setValue(response.data)
          setLoading(false)
        })
        .catch(err => {
          console.error('API Error:', err)
          setError(err.message)
          setLoading(false)
          // Fallback to localStorage
          loadFromLocalStorage()
        })
    } else {
      // Use localStorage
      loadFromLocalStorage()
    }
  }, [])

  const loadFromLocalStorage = () => {
    try {
      const item = localStorage.getItem(key)
      setValue(item ? JSON.parse(item) : initialValue)
      setLoading(false)
    } catch {
      setValue(initialValue)
      setLoading(false)
    }
  }

  const setStoredValue = async (newValue) => {
    setValue(newValue)
    
    if (USE_API) {
      try {
        await apiUpdate(newValue)
      } catch (err) {
        console.error('API Update Error:', err)
        // Fallback to localStorage
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }

  return [value, setStoredValue, loading, error]
}

export const API_ENABLED = USE_API
