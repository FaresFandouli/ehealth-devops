import apiClient from './axios.config'

const authAPI = {
  // Login with username and password
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Logout (invalidate token on server)
  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout error:', error)
    }
  },
}

export default authAPI
