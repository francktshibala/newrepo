import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { inventoryService } from '../services/api';
import { useCart } from '../context/CartContext';

const InventoryListPage = () => {
  const { classification_id } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [classification, setClassification] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let result;
        
        if (classification_id) {
          result = await inventoryService.getVehiclesByClassification(classification_id);
          setClassification(result.classification_name || '');
        } else {
          // Get all vehicles
          const classResults = await inventoryService.getClassifications();
          const classificationPromises = classResults.classifications.map(cls => 
            inventoryService.getVehiclesByClassification(cls.classification_id)
          );
          
          const allResults = await Promise.all(classificationPromises);
          const allVehicles = allResults.flatMap(res => res.vehicles || []);
          
          result = { vehicles: allVehicles };
          setClassification('All Vehicles');
        }
        
        setVehicles(result.vehicles || []);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [classification_id]);
  
  const handleAddToCart = (vehicle) => {
    addToCart(vehicle.inv_id);
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navHoverLink mx-auto"></div>
          <p className="mt-4">Loading vehicles...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">{classification}</h1>
      
      {vehicles.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-700 mb-4">No vehicles found in this category.</p>
          <Link to="/inventory" className="text-navHoverLink hover:text-accent">
            View all inventory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
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
                  {vehicle.inv_color} • {vehicle.inv_miles.toLocaleString()} miles
                </p>
                
                <p className="text-gray-700 font-bold text-xl">
                  ${vehicle.inv_price.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-gray-100 border-t border-gray-200">
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
  );
};

export default InventoryListPage;