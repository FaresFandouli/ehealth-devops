// User Types
export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN' | 'SECRETARY';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  token: string;
  refreshToken?: string;
}

// Doctor Types
export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  clinicName?: string;
  clinicAddress?: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee?: number;
  availability?: TimeSlot[];
  avatar?: string;
  bio?: string;
  isAvailable: boolean;
  patientsCount: number;
}

// Patient Types
export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType?: string;
  address: string;
  city: string;
  postalCode: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  avatar?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctor?: Doctor;
  patient?: Patient;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Consultation Types
export interface Consultation {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  doctor?: Doctor;
  patient?: Patient;
  appointment?: Appointment;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes: string;
  followUpDate?: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  consultationLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Medical Record Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  patient?: Patient;
  doctor?: Doctor;
  recordType: 'DIAGNOSIS' | 'PRESCRIPTION' | 'LAB_RESULT' | 'IMAGING' | 'PROCEDURE' | 'OTHER';
  title: string;
  description: string;
  findings?: string;
  recommendations?: string;
  fileUrl?: string;
  recordDate: string;
  createdAt: string;
  updatedAt: string;
}

// Time Slot Types
export interface TimeSlot {
  id?: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

// Statistics Types
export interface DashboardStats {
  totalPatients?: number;
  totalConsultations?: number;
  totalAppointments?: number;
  completedConsultations?: number;
  pendingAppointments?: number;
  totalEarnings?: number;
  appointmentsThisMonth?: number;
  patientsThisMonth?: number;
  consultationsThisMonth?: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

export interface DoctorFormData {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: number;
  clinicName?: string;
  clinicAddress?: string;
  consultationFee?: number;
  bio?: string;
}

export interface PatientFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType?: string;
  address: string;
  city: string;
  postalCode: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
}

export interface AppointmentFormData {
  doctorId: string;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  notes?: string;
}

export interface ConsultationFormData {
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes: string;
  followUpDate?: string;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
}

export interface MedicalRecordFormData {
  patientId: string;
  recordType: 'DIAGNOSIS' | 'PRESCRIPTION' | 'LAB_RESULT' | 'IMAGING' | 'PROCEDURE' | 'OTHER';
  title: string;
  description: string;
  findings?: string;
  recommendations?: string;
  recordDate: string;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  specialty?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
