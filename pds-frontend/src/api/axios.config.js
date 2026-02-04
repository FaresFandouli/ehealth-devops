import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (for Keycloak integration)
    const token = localStorage.getItem('pds_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('pds_user')
      localStorage.removeItem('pds_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
