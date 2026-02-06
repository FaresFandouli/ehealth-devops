import { apiClient } from './api.service';
import { MedicalRecord, MedicalRecordFormData, PaginatedResponse, FilterOptions } from '../types';
import { buildQueryString } from '../utils/helpers';

const ENDPOINTS = {
  RECORDS: '/medical/records',
  RECORD_BY_ID: '/medical/records/:id',
  PATIENT_RECORDS: '/medical/records/patient/:patientId',
};

export const medicalRecordService = {
  /**
   * Get all medical records
   */
  getAllRecords: async (
    filters?: FilterOptions
  ): Promise<PaginatedResponse<MedicalRecord>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.RECORDS}${query}`);
    return response.data;
  },

  /**
   * Get medical record by ID
   */
  getRecordById: async (id: string): Promise<MedicalRecord> => {
    const response = await apiClient.get(
      ENDPOINTS.RECORD_BY_ID.replace(':id', id)
    );
    return response.data;
  },

  /**
   * Get patient's medical records
   */
  getPatientRecords: async (
    patientId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<MedicalRecord>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_RECORDS.replace(':patientId', patientId)}${query}`
    );
    return response.data;
  },

  /**
   * Create new medical record
   */
  createRecord: async (data: MedicalRecordFormData): Promise<MedicalRecord> => {
    const response = await apiClient.post(ENDPOINTS.RECORDS, data);
    return response.data;
  },

  /**
   * Update medical record
   */
  updateRecord: async (
    id: string,
    data: Partial<MedicalRecordFormData>
  ): Promise<MedicalRecord> => {
    const response = await apiClient.put(
      ENDPOINTS.RECORD_BY_ID.replace(':id', id),
      data
    );
    return response.data;
  },

  /**
   * Delete medical record
   */
  deleteRecord: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.RECORD_BY_ID.replace(':id', id));
  },

  /**
   * Upload file for medical record
   */
  uploadFile: async (recordId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(
      `${ENDPOINTS.RECORD_BY_ID.replace(':id', recordId)}/upload`,
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
   * Download file from medical record
   */
  downloadFile: async (recordId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `${ENDPOINTS.RECORD_BY_ID.replace(':id', recordId)}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get medical record statistics
   */
  getStatistics: async (patientId?: string): Promise<any> => {
    const url = patientId
      ? `${ENDPOINTS.RECORDS}/statistics?patientId=${patientId}`
      : `${ENDPOINTS.RECORDS}/statistics`;
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Export medical records to PDF
   */
  exportRecordsToPDF: async (patientId: string, filters?: FilterOptions): Promise<Blob> => {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_RECORDS.replace(':patientId', patientId)}/export/pdf?${query}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get recent records for a patient
   */
  getRecentRecords: async (patientId: string, limit: number = 10): Promise<MedicalRecord[]> => {
    const response = await apiClient.get(
      `${ENDPOINTS.PATIENT_RECORDS.replace(':patientId', patientId)}?limit=${limit}&sortBy=recordDate&order=desc`
    );
    return response.data.content || response.data;
  },

  /**
   * Search medical records
   */
  searchRecords: async (
    query: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<MedicalRecord>> => {
    const searchFilters = buildQueryString({ ...filters, search: query });
    const response = await apiClient.get(`${ENDPOINTS.RECORDS}?${searchFilters}`);
    return response.data;
  },

  /**
   * Get records by type
   */
  getRecordsByType: async (
    type: string,
    patientId?: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<MedicalRecord>> => {
    const query = buildQueryString({ ...filters, recordType: type, patientId });
    const response = await apiClient.get(`${ENDPOINTS.RECORDS}?${query}`);
    return response.data;
  },
};

export default medicalRecordService;
