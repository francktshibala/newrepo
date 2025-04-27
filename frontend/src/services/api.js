// src/services/api.js
import axios from 'axios';
import mockApiService from './mockApiService';

// Flag to switch between real API and mock data
const USE_MOCK_DATA = true;

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
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
  (error) => Promise.reject(error)
);

// If using mock data, return the mock implementations
// Otherwise, use the real API calls
export const authService = USE_MOCK_DATA 
  ? mockApiService.authService 
  : {
    login: async (credentials) => {
      const response = await api.post('/account/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.account));
      }
      return response.data;
    },
    
    register: async (userData) => {
      return await api.post('/account/register', userData);
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
      return null;
    }
  };

export const inventoryService = USE_MOCK_DATA
  ? mockApiService.inventoryService
  : {
    getClassifications: async () => {
      const response = await api.get('/inventory/classifications');
      return response.data;
    },
    
    getVehiclesByClassification: async (classificationId) => {
      const response = await api.get(`/inventory/classification/${classificationId}`);
      return response.data;
    },
    
    getVehicleById: async (vehicleId) => {
      const response = await api.get(`/inventory/vehicle/${vehicleId}`);
      return response.data;
    }
  };

export const reviewService = USE_MOCK_DATA
  ? mockApiService.reviewService
  : {
    getVehicleReviews: async (vehicleId) => {
      const response = await api.get(`/reviews/vehicle/${vehicleId}`);
      return response.data;
    },
    
    addReview: async (reviewData) => {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    },
    
    getUserReviews: async () => {
      const response = await api.get('/reviews/user');
      return response.data;
    }
  };

// Add cart service for mock implementation
export const cartService = USE_MOCK_DATA
  ? mockApiService.cartService
  : {
    // Real implementation would go here
  };

export default api;