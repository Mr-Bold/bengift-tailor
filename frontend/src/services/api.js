import axios from 'axios'

// Production backend URL - update this with your actual Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout for production
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    // Axios already extracts response.data, so we just return it as is
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })

          const newToken = response.data.data.token
          localStorage.setItem('token', newToken)

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    const { token, refreshToken, user } = response.data.data
    
    // Store tokens and user info
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    const { token, refreshToken, user } = response.data.data
    
    // Store tokens and user info
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    
    return response.data
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await api.post('/auth/logout', { refreshToken })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.clear()
    }
  },

  getProfile: () => api.get('/auth/profile'),

  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await api.post('/auth/refresh', { refreshToken })
    const newToken = response.data.data.token
    localStorage.setItem('token', newToken)
    return response.data
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  updateStatus: (id, status) => api.patch(`/jobs/${id}/status`, { status }),
  delete: (id) => api.delete(`/jobs/${id}`),
  getNextJobNumber: () => api.get('/jobs/meta/next-job-number'),
  getStats: () => api.get('/jobs/meta/stats')
}

// Customers API
export const customersAPI = {
  getAll: (search) => api.get('/customers', { params: { search } }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (filters) => api.post('/customers/search', filters)
}

// Workers API
export const workersAPI = {
  getAll: (status) => api.get('/workers', { params: { status } }),
  getById: (id) => api.get(`/workers/${id}`),
  create: (data) => api.post('/workers', data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  delete: (id) => api.delete(`/workers/${id}`)
}

// Fabrics API
export const fabricsAPI = {
  getAll: () => api.get('/fabrics'),
  getById: (id) => api.get(`/fabrics/${id}`),
  create: (data) => api.post('/fabrics', data),
  update: (id, data) => api.put(`/fabrics/${id}`, data),
  delete: (id) => api.delete(`/fabrics/${id}`)
}

// Shop API
export const shopAPI = {
  get: () => api.get('/shop'),
  update: (data) => api.put('/shop', data)
}

// SMS API
export const smsAPI = {
  send: (to, message) => api.post('/sms/send', { to, message }),
  sendBulk: (recipients, message) => api.post('/sms/send-bulk', { recipients, message })
}

export default api
