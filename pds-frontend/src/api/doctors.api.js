import apiClient from './axios.config'

const AUTH_BASE = '/auth'
const CLINIC_BASE = '/clinic/availability'

export const doctorsAPI = {
  // Recuperer tous les medecins (optionnel: filtrer par specialite)
  getBySpeciality: async (speciality) => {
    const params = speciality ? `?speciality=${speciality}` : ''
    const response = await apiClient.get(`${AUTH_BASE}/doctors${params}`)
    return response.data
  },

  // Recuperer les disponibilites d'un medecin
  getAvailability: async (doctorId) => {
    const response = await apiClient.get(`${CLINIC_BASE}/${doctorId}`)
    return response.data
  },

  // Recuperer les creneaux libres pour une date donnee
  getAvailableSlots: async (doctorId, date) => {
    const response = await apiClient.get(`${CLINIC_BASE}/${doctorId}/slots?date=${date}`)
    return response.data
  },

  // Definir une disponibilite (pour le medecin)
  setAvailability: async (availabilityData) => {
    const response = await apiClient.post(CLINIC_BASE, availabilityData)
    return response.data
  },

  // Supprimer une disponibilite
  deleteAvailability: async (id) => {
    const response = await apiClient.delete(`${CLINIC_BASE}/${id}`)
    return response.data
  },
}

export default doctorsAPI
