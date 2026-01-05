import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  requestOTP: (phone) => api.post('/auth/otp/request', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/otp/verify', { phone, otp }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Appointments API
export const appointmentsAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  checkIn: (id) => api.post(`/appointments/${id}/check-in`),
  cancel: (id, reason) => api.post(`/appointments/${id}/cancel`, { reason }),
  createFollowUp: (id, data) => api.post(`/appointments/${id}/follow-up`, data),
  getChain: (id) => api.get(`/appointments/${id}/chain`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Patients API
export const patientsAPI = {
  getProfile: () => api.get('/patients/me'),
  updateProfile: (data) => api.put('/patients/me', data),
  getConsents: () => api.get('/patients/me/consents'),
  createConsent: (data) => api.post('/patients/me/consents', data),
  getTeleconsultStatus: () => api.get('/patients/me/consents/teleconsult/status'),
};

// Doctors API
export const doctorsAPI = {
  getSlots: (doctorId, params) => api.get(`/doctors/${doctorId}/slots`, { params }),
  getAvailability: () => api.get('/doctors/me/availability-rules'),
  updateAvailability: (data) => api.put('/doctors/me/availability-rules', data),
};

// Payments API
export const paymentsAPI = {
  create: (appointmentId, data) => api.post(`/payments/appointments/${appointmentId}/payments`, data),
  getByAppointment: (appointmentId) => api.get(`/payments/appointments/${appointmentId}/payments`),
  getReceipt: (appointmentId) => api.get(`/payments/appointments/${appointmentId}/receipt`),
  checkRefundEligibility: (appointmentId) => api.get(`/payments/appointments/${appointmentId}/refunds/eligibility`),
  requestRefund: (appointmentId, reason) => api.post(`/payments/appointments/${appointmentId}/refunds`, { reason }),
};

// Admin API
export const adminAPI = {
  getBranches: () => api.get('/admin/branches'),
  createBranch: (data) => api.post('/admin/branches', data),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export default api;
