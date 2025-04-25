import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MediaGallery from '../components/vehicles/MediaGallery';
import FinancingCalculator from '../components/inventory/FinancingCalculator';
import ReviewList from '../components/reviews/ReviewList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/inventory/vehicle/${id}`);
        setVehicle(response.data.vehicle);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchVehicle();
    }
  }, [id]);
  
  const handleAddToCart = () => {
    addToCart(vehicle.inv_id);
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navHoverLink mx-auto"></div>
        <p className="mt-4">Loading vehicle details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link 
            to="/inventory" 
            className="text-navHoverLink hover:text-accent"
          >
            &larr; Back to inventory
          </Link>
        </div>
      </div>
    );
  }
  
  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Vehicle not found
        </div>
        <div className="mt-4">
          <Link 
            to="/inventory" 
            className="text-navHoverLink hover:text-accent"
          >
            &larr; Back to inventory
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          to="/inventory" 
          className="text-navHoverLink hover:text-accent"
        >
          &larr; Back to inventory
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.inv_year} {vehicle.inv_make} {vehicle.inv_model}
          </h1>
          
          <div className="mt-2 flex items-center">
            <span className="text-gray-500">
              {vehicle.classification_name}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-gray-500">
              {vehicle.inv_miles.toLocaleString()} miles
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-gray-500">
              {vehicle.inv_color}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t border-gray-200">
          <div className="md:col-span-2">
            {/* Media Gallery */}
            <MediaGallery vehicleId={vehicle.inv_id} />
            
            {/* Tabs for additional details */}
            <div className="mt-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-navHoverLink text-navHoverLink'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'features'
                        ? 'border-navHoverLink text-navHoverLink'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reviews'
                        ? 'border-navHoverLink text-navHoverLink'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>
              
              <div className="py-6">
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Vehicle Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {vehicle.inv_description}
                    </p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Year</h4>
                        <p className="mt-1 text-gray-900">{vehicle.inv_year}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Make</h4>
                        <p className="mt-1 text-gray-900">{vehicle.inv_make}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Model</h4>
                        <p className="mt-1 text-gray-900">{vehicle.inv_model}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Color</h4>
                        <p className="mt-1 text-gray-900">{vehicle.inv_color}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Mileage</h4>
                        <p className="mt-1 text-gray-900">{vehicle.inv_miles.toLocaleString()} miles</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Vehicle Features</h3>
                    <p className="text-gray-700 mb-4">
                      This section would typically list all the features of the vehicle.
                      Contact us for a complete list of features for this {vehicle.inv_make} {vehicle.inv_model}.
                    </p>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                    <ReviewList vehicleId={vehicle.inv_id} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            {/* Price and CTA */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${vehicle.inv_price.toLocaleString()}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-navHoverLink text-white rounded-md hover:bg-accent"
                >
                  Add to Cart
                </button>
                
                <Link
                  to={`/schedule-test-drive/${vehicle.inv_id}`}
                  className="block w-full py-3 px-4 border border-navHoverLink text-navHoverLink text-center rounded-md hover:bg-gray-50"
                >
                  Schedule Test Drive
                </Link>
              </div>
              
              {user && (
                <div className="mt-4 text-sm text-gray-500">
                  <p>Questions? Call us at (555) 123-4567</p>
                </div>
              )}
            </div>
            
            {/* Financing Calculator */}
            <FinancingCalculator vehiclePrice={vehicle.inv_price} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;