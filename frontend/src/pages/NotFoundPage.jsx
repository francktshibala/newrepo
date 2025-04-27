import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl font-bold text-navHoverLink mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="inline-block bg-navHoverLink text-white px-6 py-3 rounded-md hover:bg-accent"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;