import { apiClient } from './api.service';
import { Appointment, AppointmentFormData, PaginatedResponse, FilterOptions, APPOINTMENT_STATUS } from '../types';
import { buildQueryString } from '../utils/helpers';

const ENDPOINTS = {
  APPOINTMENTS: '/consultation/appointments',
  APPOINTMENT_BY_ID: '/consultation/appointments/:id',
  APPOINTMENT_AVAILABLE_SLOTS: '/consultation/appointments/available-slots',
};

export const appointmentService = {
  /**
   * Get all appointments
   */
  getAllAppointments: async (
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Appointment>> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.APPOINTMENTS}${query}`);
    return response.data;
  },

  /**
   * Get appointment by ID
   */
  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get(
      ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id)
    );
    return response.data;
  },

  /**
   * Create new appointment
   */
  createAppointment: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await apiClient.post(ENDPOINTS.APPOINTMENTS, data);
    return response.data;
  },

  /**
   * Update appointment
   */
  updateAppointment: async (
    id: string,
    data: Partial<AppointmentFormData>
  ): Promise<Appointment> => {
    const response = await apiClient.put(
      ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id),
      data
    );
    return response.data;
  },

  /**
   * Cancel appointment
   */
  cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
    const response = await apiClient.post(
      `${ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id)}/cancel`,
      { reason }
    );
    return response.data;
  },

  /**
   * Confirm appointment
   */
  confirmAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.post(
      `${ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id)}/confirm`
    );
    return response.data;
  },

  /**
   * Complete appointment
   */
  completeAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.post(
      `${ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id)}/complete`
    );
    return response.data;
  },

  /**
   * Delete appointment
   */
  deleteAppointment: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id));
  },

  /**
   * Get available time slots for a doctor on a specific date
   */
  getAvailableSlots: async (
    doctorId: string,
    date: string
  ): Promise<string[]> => {
    const response = await apiClient.get(
      `${ENDPOINTS.APPOINTMENT_AVAILABLE_SLOTS}?doctorId=${doctorId}&date=${date}`
    );
    return response.data;
  },

  /**
   * Get appointment statistics
   */
  getStatistics: async (filters?: FilterOptions): Promise<any> => {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await apiClient.get(`${ENDPOINTS.APPOINTMENTS}/statistics${query}`);
    return response.data;
  },

  /**
   * Reschedule appointment
   */
  rescheduleAppointment: async (
    id: string,
    newDate: string,
    newTime: string
  ): Promise<Appointment> => {
    const response = await apiClient.post(
      `${ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id)}/reschedule`,
      { scheduledDate: newDate, scheduledTime: newTime }
    );
    return response.data;
  },

  /**
   * Send reminder for appointment
   */
  sendReminder: async (id: string): Promise<any> => {
    const response = await apiClient.post(
      `${ENDPOINTS.APPOINTMENT_BY_ID.replace(':id', id)}/send-reminder`
    );
    return response.data;
  },

  /**
   * Get upcoming appointments
   */
  getUpcomingAppointments: async (limit: number = 5): Promise<Appointment[]> => {
    const response = await apiClient.get(
      `${ENDPOINTS.APPOINTMENTS}/upcoming?limit=${limit}`
    );
    return response.data;
  },

  /**
   * Export appointments to PDF
   */
  exportAppointmentsToPDF: async (filters?: FilterOptions): Promise<Blob> => {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get(`${ENDPOINTS.APPOINTMENTS}/export/pdf?${query}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export appointments to CSV
   */
  exportAppointmentsToCSV: async (filters?: FilterOptions): Promise<Blob> => {
    const query = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get(`${ENDPOINTS.APPOINTMENTS}/export/csv?${query}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default appointmentService;
