/**
 * Fuzzy search utility for filtering data
 */
export function fuzzySearch(items, searchTerm, fields) {
  if (!searchTerm || searchTerm.trim() === '') return items
  
  const term = searchTerm.toLowerCase().trim()
  
  return items.filter(item => {
    return fields.some(field => {
      const value = getNestedValue(item, field)
      if (!value) return false
      return String(value).toLowerCase().includes(term)
    })
  })
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Advanced filter for multiple criteria
 */
export function advancedFilter(items, filters) {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === '') return true
      
      const itemValue = getNestedValue(item, key)
      if (!itemValue) return false
      
      return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
    })
  })
}

/**
 * Sort items by field
 */
export function sortBy(items, field, direction = 'asc') {
  return [...items].sort((a, b) => {
    const aVal = getNestedValue(a, field)
    const bVal = getNestedValue(b, field)
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}
