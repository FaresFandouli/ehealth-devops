import { format, parse, parseISO, isValid } from 'date-fns';
import { DATE_FORMAT, DATETIME_FORMAT, DISPLAY_DATE_FORMAT, DISPLAY_DATETIME_FORMAT } from './constants';

/**
 * Format a date string to display format
 */
export const formatDate = (date: string | Date, displayFormat: string = DISPLAY_DATE_FORMAT): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, displayFormat) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a datetime string to display format
 */
export const formatDateTime = (date: string | Date, displayFormat: string = DISPLAY_DATETIME_FORMAT): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, displayFormat) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

/**
 * Parse a date string in a specific format
 */
export const parseDate = (dateString: string, dateFormat: string = DATE_FORMAT): Date | null => {
  try {
    const date = parse(dateString, dateFormat, new Date());
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

/**
 * Format a time string
 */
export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return time;
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(date);
  } catch {
    return 'Unknown';
  }
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.getTime() > new Date().getTime();
  } catch {
    return false;
  }
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.getTime() < new Date().getTime();
  } catch {
    return false;
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-() ]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Truncate text
 */
export const truncateText = (text: string, length: number = 50): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string | Date): number => {
  try {
    const dateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const monthDiff = today.getMonth() - dateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate())) {
      age--;
    }
    return age;
  } catch {
    return 0;
  }
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Generate random color
 */
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#06B6D4',
    '#EF4444',
    '#F97316',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Get color based on status
 */
export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
    case 'ONGOING':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Merge objects
 */
export const mergeObjects = <T extends Record<string, any>>(obj1: T, obj2: Partial<T>): T => {
  return { ...obj1, ...obj2 };
};

/**
 * Get query params from URL
 */
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  return queryParams.toString();
};

/**
 * Download file
 */
export const downloadFile = (content: string, filename: string, type: string = 'text/plain'): void => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Export to CSV
 */
export const exportToCSV = (data: any[], filename: string = 'export.csv'): void => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(',')),
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
};

/**
 * Print element
 */
export const printElement = (elementId: string): void => {
  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    const element = document.getElementById(elementId);
    if (element) {
      printWindow.document.write(element.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }
};
