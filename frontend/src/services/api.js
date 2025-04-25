import axios from 'axios';

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

// Authentication services
export const authService = {
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

// Inventory services
export const inventoryService = {
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

// Review services
export const reviewService = {
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

export default api;