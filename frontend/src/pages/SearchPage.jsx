import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import searchService from '../services/searchService';
import { useCart } from '../context/CartContext';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    classification: queryParams.get('classification') || '',
    make: queryParams.get('make') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    color: queryParams.get('color') || ''
  });
  
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchParams = {
          query: initialQuery,
          ...filters
        };
        
        const data = await searchService.searchVehicles(searchParams);
        setSearchResults(data.results || []);
      } catch (err) {
        console.error('Error searching vehicles:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [initialQuery, filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleAddToCart = (vehicle) => {
    addToCart(vehicle.inv_id);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {initialQuery
          ? `Search Results for "${initialQuery}"`
          : 'All Vehicles'}
      </h1>
      
      <div className="mb-6">
        <SearchBar />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterPanel 
            initialFilters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <svg 
                className="animate-spin h-10 w-10 text-navHoverLink mx-auto" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
              <p className="text-gray-700 mb-4">
                No vehicles found matching your search criteria.
              </p>
              <button
                onClick={() => setFilters({
                  classification: '',
                  make: '',
                  minPrice: '',
                  maxPrice: '',
                  color: ''
                })}
                className="px-4 py-2 bg-navHoverLink text-white rounded-md hover:bg-accent"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((vehicle) => (
                <div 
                  key={vehicle.inv_id}
                  className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
                >
                  <Link to={`/inventory/detail/${vehicle.inv_id}`}>
                    <img
                      src={vehicle.inv_thumbnail}
                      alt={`${vehicle.inv_make} ${vehicle.inv_model}`}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  
                  <div className="p-4 flex-grow">
                    <Link 
                      to={`/inventory/detail/${vehicle.inv_id}`}
                      className="text-lg font-semibold text-navHoverLink hover:text-accent"
                    >
                      {vehicle.inv_year} {vehicle.inv_make} {vehicle.inv_model}
                    </Link>
                    
                    <p className="text-gray-600 mb-2">
                      {vehicle.classification_name}
                    </p>
                    
                    <p className="text-gray-700 font-bold text-xl">
                      ${vehicle.inv_price.toLocaleString()}
                    </p>
                    
                    <p className="text-gray-600 mt-2">
                      {vehicle.inv_color} • {vehicle.inv_miles.toLocaleString()} miles
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        to={`/inventory/detail/${vehicle.inv_id}`}
                        className="flex-1 px-4 py-2 bg-navHoverLink text-white text-center rounded hover:bg-accent"
                      >
                        View Details
                      </Link>
                      
                      <button
                        onClick={() => handleAddToCart(vehicle)}
                        className="px-4 py-2 border border-navHoverLink text-navHoverLink rounded hover:bg-gray-100"
                        aria-label="Add to cart"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;