import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../../services/api';

const Navigation = () => {
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const result = await inventoryService.getClassifications();
        setClassifications(result.classifications || []);
      } catch (err) {
        console.error('Error fetching classifications:', err);
        setError('Failed to load navigation');
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, []);

  if (loading) {
    return <div className="bg-navBg py-4">Loading navigation...</div>;
  }

  if (error) {
    return <div className="bg-navBg py-4">Error: {error}</div>;
  }

  return (
    <nav className="bg-navHoverLink py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-8">
          <li>
            <Link to="/" className="text-navLink hover:text-navHoverBg">
              Home
            </Link>
          </li>
          {classifications.map((classification) => (
            <li key={classification.classification_id}>
              <Link 
                to={`/inventory/${classification.classification_id}`}
                className="text-navLink hover:text-navHoverBg"
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