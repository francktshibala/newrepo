// src/services/searchService.js
import api from './api';
import mockApiService from './mockApiService';

// Flag to switch between real API and mock data
const USE_MOCK_DATA = true;

const searchService = USE_MOCK_DATA
  ? mockApiService.searchService
  : {
    searchVehicles: async (params) => {
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.classification) queryParams.append('classification', params.classification);
      if (params.make) queryParams.append('make', params.make);
      if (params.model) queryParams.append('model', params.model);
      if (params.year) queryParams.append('year', params.year);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.color) queryParams.append('color', params.color);
      
      const response = await api.get(`/inventory/search?${queryParams.toString()}`);
      return response.data;
    },
    
    getFilterOptions: async () => {
      const response = await api.get('/inventory/filter-options');
      return response.data;
    }
  };

export default searchService;