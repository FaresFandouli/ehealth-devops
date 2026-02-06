import { apiClient } from './api.service';
import { Doctor, DoctorFormData, PaginatedResponse, FilterOptions } from '../types';
import { buildQueryString } from '../utils/helpers';

const ENDPOINTS = {
  DOCTORS: '/clinic/doctors',
  DOCTOR_BY_ID: '/clinic/doctors/:id',
  DOCTOR_PATIENTS: '/clinic/doctors/:id/patients',
  DOCTOR_SCHEDULE: '/clinic/doctors/:id/schedule',
  DOCTOR_CONSULTATIONS: '/clinic/doctors/:id/consultations',
  DOCTOR_STATISTICS: '/clinic/doctors/:id/statistics',
};

export const doctorService = {
  /**
   * Get all doctors
   */
  getAllDoctors: async (
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Doctor>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.DOCTORS}${query}`);
    return response.data;
  },

  /**
   * Get doctor by ID
   */
  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get(
      ENDPOINTS.DOCTOR_BY_ID.replace(':id', id)
    );
    return response.data;
  },

  /**
   * Get current doctor profile
   */
  getProfile: async (): Promise<Doctor> => {
    const response = await apiClient.get(`${ENDPOINTS.DOCTORS}/profile`);
    return response.data;
  },

  /**
   * Update doctor profile
   */
  updateProfile: async (id: string, data: Partial<DoctorFormData>): Promise<Doctor> => {
    const response = await apiClient.put(
      ENDPOINTS.DOCTOR_BY_ID.replace(':id', id),
      data
    );
    return response.data;
  },

  /**
   * Get doctor's patients
   */
  getDoctorPatients: async (
    doctorId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<any>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.DOCTOR_PATIENTS.replace(':id', doctorId)}${query}`
    );
    return response.data;
  },

  /**
   * Get doctor's schedule
   */
  getSchedule: async (doctorId: string): Promise<any> => {
    const response = await apiClient.get(
      ENDPOINTS.DOCTOR_SCHEDULE.replace(':id', doctorId)
    );
    return response.data;
  },

  /**
   * Update doctor's schedule
   */
  updateSchedule: async (doctorId: string, schedule: any): Promise<any> => {
    const response = await apiClient.put(
      ENDPOINTS.DOCTOR_SCHEDULE.replace(':id', doctorId),
      schedule
    );
    return response.data;
  },

  /**
   * Get doctor's consultations
   */
  getConsultations: async (
    doctorId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<any>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.DOCTOR_CONSULTATIONS.replace(':id', doctorId)}${query}`
    );
    return response.data;
  },

  /**
   * Get doctor's statistics
   */
  getStatistics: async (doctorId: string): Promise<any> => {
    const response = await apiClient.get(
      ENDPOINTS.DOCTOR_STATISTICS.replace(':id', doctorId)
    );
    return response.data;
  },

  /**
   * Get available time slots for a doctor
   */
  getAvailableSlots: async (
    doctorId: string,
    date: string
  ): Promise<string[]> => {
    const response = await apiClient.get(
      `${ENDPOINTS.DOCTORS}/${doctorId}/available-slots?date=${date}`
    );
    return response.data;
  },

  /**
   * Search doctors by specialty
   */
  searchBySpecialty: async (
    specialty: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Doctor>> => {
    const query = buildQueryString({ ...filters, specialty });
    const response = await apiClient.get(`${ENDPOINTS.DOCTORS}?${query}`);
    return response.data;
  },

  /**
   * Get top-rated doctors
   */
  getTopRated: async (limit: number = 10): Promise<Doctor[]> => {
    const response = await apiClient.get(`${ENDPOINTS.DOCTORS}/top-rated?limit=${limit}`);
    return response.data;
  },

  /**
   * Upload doctor's profile picture
   */
  uploadProfilePicture: async (doctorId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(
      `${ENDPOINTS.DOCTOR_BY_ID.replace(':id', doctorId)}/profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default doctorService;
