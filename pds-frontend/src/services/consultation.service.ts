import { apiClient } from './api.service';
import { Consultation, ConsultationFormData, PaginatedResponse, FilterOptions } from '../types';
import { buildQueryString } from '../utils/helpers';

const ENDPOINTS = {
  CONSULTATIONS: '/consultation/consultations',
  CONSULTATION_BY_ID: '/consultation/consultations/:id',
  CONSULTATION_BY_APPOINTMENT: '/consultation/consultations/appointment/:appointmentId',
};

export const consultationService = {
  /**
   * Get all consultations
   */
  getAllConsultations: async (
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Consultation>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.CONSULTATIONS}${query}`);
    return response.data;
  },

  /**
   * Get consultation by ID
   */
  getConsultationById: async (id: string): Promise<Consultation> => {
    const response = await apiClient.get(
      ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id)
    );
    return response.data;
  },

  /**
   * Get consultation by appointment ID
   */
  getByAppointmentId: async (appointmentId: string): Promise<Consultation> => {
    const response = await apiClient.get(
      ENDPOINTS.CONSULTATION_BY_APPOINTMENT.replace(':appointmentId', appointmentId)
    );
    return response.data;
  },

  /**
   * Create new consultation
   */
  createConsultation: async (data: ConsultationFormData): Promise<Consultation> => {
    const response = await apiClient.post(ENDPOINTS.CONSULTATIONS, data);
    return response.data;
  },

  /**
   * Update consultation
   */
  updateConsultation: async (
    id: string,
    data: Partial<ConsultationFormData>
  ): Promise<Consultation> => {
    const response = await apiClient.put(
      ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id),
      data
    );
    return response.data;
  },

  /**
   * Delete consultation
   */
  deleteConsultation: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id));
  },

  /**
   * Complete consultation
   */
  completeConsultation: async (id: string): Promise<Consultation> => {
    const response = await apiClient.post(
      `${ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id)}/complete`
    );
    return response.data;
  },

  /**
   * Cancel consultation
   */
  cancelConsultation: async (id: string, reason?: string): Promise<Consultation> => {
    const response = await apiClient.post(
      `${ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id)}/cancel`,
      { reason }
    );
    return response.data;
  },

  /**
   * Start video consultation
   */
  startVideoConsultation: async (id: string): Promise<any> => {
    const response = await apiClient.post(
      `${ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id)}/start-video`
    );
    return response.data;
  },

  /**
   * End video consultation
   */
  endVideoConsultation: async (id: string): Promise<any> => {
    const response = await apiClient.post(
      `${ENDPOINTS.CONSULTATION_BY_ID.replace(':id', id)}/end-video`
    );
    return response.data;
  },

  /**
   * Get consultation statistics
   */
  getStatistics: async (filters?: FilterOptions): Promise<any> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.CONSULTATIONS}/statistics${query}`);
    return response.data;
  },

  /**
   * Get doctor's consultations
   */
  getDoctorConsultations: async (
    doctorId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Consultation>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.CONSULTATIONS}?doctorId=${doctorId}${query ? '&' + query.substring(1) : ''}`
    );
    return response.data;
  },

  /**
   * Get patient's consultations
   */
  getPatientConsultations: async (
    patientId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Consultation>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.CONSULTATIONS}?patientId=${patientId}${query ? '&' + query.substring(1) : ''}`
    );
    return response.data;
  },

  /**
   * Export consultations to PDF
   */
  exportConsultationsToPDF: async (filters?: FilterOptions): Promise<Blob> => {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get(
      `${ENDPOINTS.CONSULTATIONS}/export/pdf?${query}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get recent consultations
   */
  getRecentConsultations: async (limit: number = 5): Promise<Consultation[]> => {
    const response = await apiClient.get(
      `${ENDPOINTS.CONSULTATIONS}/recent?limit=${limit}`
    );
    return response.data;
  },
};

export default consultationService;
