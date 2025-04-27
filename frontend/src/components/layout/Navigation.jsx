import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryServiceDebug } from '../../services/apiDebug';
import axios from 'axios';

const Navigation = () => {
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        console.log('Fetching classifications...');
        
        // First try with the debug service
        const result = await inventoryServiceDebug.getClassifications();
        console.log('Classifications result:', result);
        
        setClassifications(result.classifications || []);
      } catch (err) {
        console.error('Error fetching classifications with service:', err);
        
        // Fallback to direct axios call if service fails
        try {
          console.log('Trying direct API call...');
          const response = await axios.get('/api/inventory/classifications');
          console.log('Direct API response:', response.data);
          
          setClassifications(response.data.classifications || []);
        } catch (axiosErr) {
          console.error('Error with direct API call:', axiosErr);
          setError('Failed to load navigation. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, []);

  // Static navigation as fallback if API fails
  const staticClassifications = [
    { classification_id: 1, classification_name: 'SUV' },
    { classification_id: 2, classification_name: 'Classic' },
    { classification_id: 3, classification_name: 'Sports' },
    { classification_id: 4, classification_name: 'Truck' },
    { classification_id: 5, classification_name: 'Sedan' }
  ];

  const displayClassifications = classifications.length > 0 ? classifications : staticClassifications;

  if (loading) {
    return (
      <nav className="bg-navHoverLink py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-white hover:text-navHoverBg">
                Home
              </Link>
            </li>
            <li>
              <span className="text-white">Loading...</span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  if (error) {
    // Show static navigation with error notification
    return (
      <nav className="bg-navHoverLink py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-white hover:text-navHoverBg">
                Home
              </Link>
            </li>
            {staticClassifications.map((cls) => (
              <li key={cls.classification_id}>
                <Link 
                  to={`/inventory/${cls.classification_id}`}
                  className="text-white hover:text-navHoverBg"
                >
                  {cls.classification_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-navHoverLink py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-8">
          <li>
            <Link to="/" className="text-white hover:text-navHoverBg">
              Home
            </Link>
          </li>
          {displayClassifications.map((classification) => (
            <li key={classification.classification_id}>
              <Link 
                to={`/inventory/${classification.classification_id}`}
                className="text-white hover:text-navHoverBg"
              >
                {classification.classification_name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;