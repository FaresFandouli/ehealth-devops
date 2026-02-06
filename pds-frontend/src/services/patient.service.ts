import { apiClient } from './api.service';
import { Patient, PatientFormData, PaginatedResponse, FilterOptions } from '../types';
import { buildQueryString } from '../utils/helpers';

const ENDPOINTS = {
  PATIENTS: '/clinic/patients',
  PATIENT_BY_ID: '/clinic/patients/:id',
  PATIENT_PROFILE: '/clinic/patients/profile',
  PATIENT_MEDICAL_RECORDS: '/clinic/patients/:id/medical-records',
  PATIENT_APPOINTMENTS: '/clinic/patients/:id/appointments',
  PATIENT_CONSULTATIONS: '/clinic/patients/:id/consultations',
  PATIENT_STATISTICS: '/clinic/patients/:id/statistics',
};

export const patientService = {
  /**
   * Get all patients
   */
  getAllPatients: async (
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Patient>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.PATIENTS}${query}`);
    return response.data;
  },

  /**
   * Get patient by ID
   */
  getPatientById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get(
      ENDPOINTS.PATIENT_BY_ID.replace(':id', id)
    );
    return response.data;
  },

  /**
   * Get current patient profile
   */
  getProfile: async (): Promise<Patient> => {
    const response = await apiClient.get(ENDPOINTS.PATIENT_PROFILE);
    return response.data;
  },

  /**
   * Create new patient
   */
  createPatient: async (data: PatientFormData): Promise<Patient> => {
    const response = await apiClient.post(ENDPOINTS.PATIENTS, data);
    return response.data;
  },

  /**
   * Update patient profile
   */
  updateProfile: async (id: string, data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await apiClient.put(
      ENDPOINTS.PATIENT_BY_ID.replace(':id', id),
      data
    );
    return response.data;
  },

  /**
   * Update current patient's profile
   */
  updateCurrentProfile: async (data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await apiClient.put(ENDPOINTS.PATIENT_PROFILE, data);
    return response.data;
  },

  /**
   * Delete patient
   */
  deletePatient: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PATIENT_BY_ID.replace(':id', id));
  },

  /**
   * Get patient's medical records
   */
  getMedicalRecords: async (
    patientId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<any>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_MEDICAL_RECORDS.replace(':id', patientId)}${query}`
    );
    return response.data;
  },

  /**
   * Get patient's appointments
   */
  getAppointments: async (
    patientId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<any>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_APPOINTMENTS.replace(':id', patientId)}${query}`
    );
    return response.data;
  },

  /**
   * Get patient's consultations
   */
  getConsultations: async (
    patientId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<any>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_CONSULTATIONS.replace(':id', patientId)}${query}`
    );
    return response.data;
  },

  /**
   * Get patient's statistics
   */
  getStatistics: async (patientId: string): Promise<any> => {
    const response = await apiClient.get(
      ENDPOINTS.PATIENT_STATISTICS.replace(':id', patientId)
    );
    return response.data;
  },

  /**
   * Search patients
   */
  searchPatients: async (
    query: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Patient>> => {
    const searchFilters = buildQueryString({ ...filters, search: query });
    const response = await apiClient.get(`${ENDPOINTS.PATIENTS}?${searchFilters}`);
    return response.data;
  },

  /**
   * Upload patient's profile picture
   */
  uploadProfilePicture: async (patientId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(
      `${ENDPOINTS.PATIENT_BY_ID.replace(':id', patientId)}/profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Export patient data
   */
  exportPatientData: async (patientId: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> => {
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_BY_ID.replace(':id', patientId)}/export?format=${format}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default patientService;
