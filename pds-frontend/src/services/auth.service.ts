import { apiClient } from './api.service';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '../types';

const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH: '/auth/refresh',
  UPDATE_PROFILE: '/auth/profile/update',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

export const authService = {
  /**
   * Login user
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.LOGIN, { username, password });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.REGISTER, data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout error:', error);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get(ENDPOINTS.PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
  },

  /**
   * Verify email token
   */
  verifyEmail: async (token: string): Promise<any> => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Check if username exists
   */
  checkUsernameExists: async (username: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/auth/check-username?username=${username}`);
      return response.data.exists;
    } catch {
      return false;
    }
  },

  /**
   * Check if email exists
   */
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/auth/check-email?email=${email}`);
      return response.data.exists;
    } catch {
      return false;
    }
  },
};

export default authService;
