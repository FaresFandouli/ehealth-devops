import apiClient from './axios.config'

const CLINIC_BASE = '/clinic/appointments'

export const appointmentsAPI = {
  getAll: async () => {
    const response = await apiClient.get(`${CLINIC_BASE}/getAllAppointments`)
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`${CLINIC_BASE}/${id}`)
    return response.data
  },

  getByPatient: async (patientId) => {
    const response = await apiClient.get(`${CLINIC_BASE}/patient/${patientId}`)
    return response.data
  },

  getByDoctor: async (doctorId) => {
    const response = await apiClient.get(`${CLINIC_BASE}/doctor/${doctorId}`)
    return response.data
  },

  // Prendre un rendez-vous (nouveau systeme avec verification de disponibilite)
  book: async (appointmentData) => {
    const response = await apiClient.post(`${CLINIC_BASE}/book`, appointmentData)
    return response.data
  },

  // Annuler un rendez-vous
  cancel: async (id) => {
    const response = await apiClient.put(`${CLINIC_BASE}/${id}/cancel`)
    return response.data
  },

  // Garder create comme alias de book pour compatibilite
  create: async (appointmentData) => {
    const response = await apiClient.post(`${CLINIC_BASE}/book`, appointmentData)
    return response.data
  },

  update: async (id, appointmentData) => {
    const response = await apiClient.put(`${CLINIC_BASE}/updateAppointment/${id}`, appointmentData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${CLINIC_BASE}/deleteAppointment/${id}`)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`${CLINIC_BASE}/${id}/status`, { status })
    return response.data
  },
}

export default appointmentsAPI
