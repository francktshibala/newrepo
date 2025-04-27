import axios from 'axios';

// Create axios instance with debugging
const apiDebug = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Add a timeout to help with debugging
});

// Add request interceptor for debugging
apiDebug.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, config);
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiDebug.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Authentication services with debugging
export const authServiceDebug = {
  login: async (credentials) => {
    console.log('Attempting login with:', { ...credentials, account_password: '****' });
    try {
      const response = await apiDebug.post('/account/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.account));
        console.log('Login successful, user data stored in localStorage');
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    console.log('Attempting registration with:', { ...userData, account_password: '****' });
    try {
      const response = await apiDebug.post('/account/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  logout: () => {
    console.log('Logging out, clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('Current user from localStorage:', user);
    return user;
  }
};

// Inventory services with debugging
export const inventoryServiceDebug = {
  getClassifications: async () => {
    console.log('Fetching classifications');
    try {
      const response = await apiDebug.get('/inventory/classifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch classifications:', error);
      throw error;
    }
  },
  
  getVehiclesByClassification: async (classificationId) => {
    console.log(`Fetching vehicles for classification ID: ${classificationId}`);
    try {
      const response = await apiDebug.get(`/inventory/classification/${classificationId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch vehicles for classification ${classificationId}:`, error);
      throw error;
    }
  },
  
  getVehicleById: async (vehicleId) => {
    console.log(`Fetching vehicle with ID: ${vehicleId}`);
    try {
      const response = await apiDebug.get(`/inventory/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch vehicle ${vehicleId}:`, error);
      throw error;
    }
  }
};

export default apiDebug;