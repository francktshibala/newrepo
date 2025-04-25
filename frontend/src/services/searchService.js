import api from './api';

export const searchService = {
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