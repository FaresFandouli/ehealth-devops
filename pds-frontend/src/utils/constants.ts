// API Base URL
export const API_BASE_URL = 'http://localhost:8982/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  // Clinic/Patients
  CLINIC: {
    PATIENTS: '/clinic/patients',
    PATIENT_BY_ID: '/clinic/patients/:id',
  },
  // Medical Records
  MEDICAL: {
    RECORDS: '/medical/records',
    RECORD_BY_ID: '/medical/records/:id',
    PATIENT_RECORDS: '/medical/records/patient/:patientId',
  },
  // Consultations
  CONSULTATION: {
    CONSULTATIONS: '/consultation/consultations',
    CONSULTATION_BY_ID: '/consultation/consultations/:id',
    PATIENT_CONSULTATIONS: '/consultation/consultations/patient/:patientId',
    DOCTOR_CONSULTATIONS: '/consultation/consultations/doctor/:doctorId',
  },
  // Appointments
  APPOINTMENTS: {
    APPOINTMENTS: '/appointments',
    APPOINTMENT_BY_ID: '/appointments/:id',
  },
};

// User Roles
export const USER_ROLES = {
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  ADMIN: 'ADMIN',
  SECRETARY: 'SECRETARY',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const APPOINTMENT_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const APPOINTMENT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// Consultation Status
export const CONSULTATION_STATUS = {
  PENDING: 'PENDING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const CONSULTATION_STATUS_LABELS = {
  PENDING: 'Pending',
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const CONSULTATION_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ONGOING: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// Consultation Types
export const CONSULTATION_TYPES = {
  IN_PERSON: 'IN_PERSON',
  VIDEO: 'VIDEO',
  PHONE: 'PHONE',
};

export const CONSULTATION_TYPE_LABELS = {
  IN_PERSON: 'In-Person',
  VIDEO: 'Video Call',
  PHONE: 'Phone Call',
};

// Medical Record Types
export const MEDICAL_RECORD_TYPES = {
  DIAGNOSIS: 'DIAGNOSIS',
  PRESCRIPTION: 'PRESCRIPTION',
  LAB_RESULT: 'LAB_RESULT',
  IMAGING: 'IMAGING',
  PROCEDURE: 'PROCEDURE',
  OTHER: 'OTHER',
};

export const MEDICAL_RECORD_TYPE_LABELS = {
  DIAGNOSIS: 'Diagnosis',
  PRESCRIPTION: 'Prescription',
  LAB_RESULT: 'Lab Result',
  IMAGING: 'Imaging',
  PROCEDURE: 'Procedure',
  OTHER: 'Other',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

// Blood Types
export const BLOOD_TYPES = [
  'O+',
  'O-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
];

// Common Specialties
export const MEDICAL_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'Pediatrics',
  'Psychiatry',
  'General Practice',
  'Surgery',
  'Oncology',
  'Ophthalmology',
  'Otolaryngology',
  'Urology',
  'Gastroenterology',
  'Pulmonology',
  'Nephrology',
  'Endocrinology',
  'Rheumatology',
  'Hematology',
  'Immunology',
  'Infectious Disease',
];

// Days of Week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// Date Format
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const DISPLAY_DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';

// Notification Messages
export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    REGISTER: 'Registration successful',
    CREATE: 'Created successfully',
    UPDATE: 'Updated successfully',
    DELETE: 'Deleted successfully',
    APPOINTMENT_BOOKED: 'Appointment booked successfully',
    APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
    CONSULTATION_CREATED: 'Consultation created successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  // Error Messages
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    INVALID_INPUT: 'Invalid input. Please check your data.',
    APPOINTMENT_CONFLICT: 'This time slot is already booked.',
  },
  // Info Messages
  INFO: {
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
    CONFIRMING: 'Please confirm your action',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'pds_token',
  REFRESH_TOKEN: 'pds_refresh_token',
  USER: 'pds_user',
  THEME: 'pds_theme',
  SIDEBAR_COLLAPSED: 'pds_sidebar_collapsed',
};

// Time Slots (in 15-minute intervals)
export const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  PHONE_PATTERN: /^[0-9+\-() ]{10,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  POSTAL_CODE_PATTERN: /^[0-9]{4,6}$/,
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#3B82F6',
  PRIMARY_DARK: '#1E40AF',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#06B6D4',
  LIGHT: '#F3F4F6',
  DARK: '#1F2937',
  WHITE: '#FFFFFF',
};
