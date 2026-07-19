import axios from 'axios';

// In production: VITE_API_URL = your deployed backend URL
// In development: Vite proxy handles /api → http://localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/user/signup', userData),
  login: (credentials) => api.post('/user/login', credentials),
  logout: () => api.get('/user/logout'),
  getCurrentUser: () => api.get('/user/current'),
  checkAuth: () => api.get('/user/auth-status'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  changeUsername: (newUsername) => api.put('/user/profile/username', { newUsername }),
  changePassword: (passwordData) => api.put('/user/profile/password', passwordData),
  getFavorites: () => api.get('/user/favorites'),
  toggleFavorite: (listingId) => api.post(`/user/favorites/${listingId}`)
};

// Listings API calls
export const listingsAPI = {
  getAllListings: (params) => api.get('/listing', { params }),
  getListingById: (id) => api.get(`/listing/${id}`),
  createListing: (formData) => api.post('/listing', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateListing: (id, formData) => api.patch(`/listing/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteListing: (id) => api.delete(`/listing/${id}`),
  getEditPage: (id) => api.get(`/listing/${id}/edit`)
};

// Booking API calls
export const bookingsAPI = {
  getBookedDates: (listingId) => api.get(`/listing/${listingId}/booking`),
  createBooking: (listingId, data) => api.post(`/listing/${listingId}/booking`, { booking: data }),
  getMyBookings: () => api.get('/bookings/mine'),
  getHostBookings: () => api.get('/bookings/hosting'),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
};

// Report API calls
export const reportsAPI = {
  reportListing: (listingId, data) => api.post(`/listing/${listingId}/report`, { report: data }),
};

// Admin API calls
export const adminAPI = {
  getReports: () => api.get('/admin/reports'),
  updateReportStatus: (id, status) => api.patch(`/admin/reports/${id}`, { status }),
};

// Reviews API calls
export const reviewsAPI = {
  addReview: (listingId, reviewData) => api.post(`/listing/${listingId}/review`, reviewData),
  deleteReview: (listingId, reviewId) => api.delete(`/listing/${listingId}/review/${reviewId}`)
};

// Notifications API calls
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export default api;
