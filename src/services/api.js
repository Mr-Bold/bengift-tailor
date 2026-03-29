import axios from 'axios'

// Production backend URL - update this with your actual Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bengift-clothing.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout for production
})

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
