import React, { useState, useEffect } from 'react';
import searchService from '../../services/searchService';

const FilterPanel = ({ initialFilters, onFilterChange }) => {
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    colors: [],
    classifications: []
  });
  
  const [filters, setFilters] = useState(initialFilters || {
    classification: '',
    make: '',
    minPrice: '',
    maxPrice: '',
    color: ''
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await searchService.getFilterOptions();
        setFilterOptions({
          makes: data.makes || [],
          colors: data.colors || [],
          classifications: data.classifications || []
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  const handleReset = () => {
    const resetFilters = {
      classification: '',
      make: '',
      minPrice: '',
      maxPrice: '',
      color: ''
    };
    
    setFilters(resetFilters);
    
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading filters...</div>;
  }
  
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="classification" className="block text-sm font-medium text-gray-700">
            Classification
          </label>
          <select
            id="classification"
            name="classification"
            value={filters.classification}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink sm:text-sm rounded-md"
          >
            <option value="">All Classifications</option>
            {filterOptions.classifications.map((classification) => (
              <option 
                key={classification.classification_id} 
                value={classification.classification_id}
              >
                {classification.classification_name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">
            Make
          </label>
          <select
            id="make"
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink sm:text-sm rounded-md"
          >
            <option value="">All Makes</option>
            {filterOptions.makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min="0"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink sm:text-sm rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink sm:text-sm rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <select
            id="color"
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink sm:text-sm rounded-md"
          >
            <option value="">All Colors</option>
            {filterOptions.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
        
        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navHoverLink"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;