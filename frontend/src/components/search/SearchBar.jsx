import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg">
      <input
        type="text"
        placeholder="Search for vehicles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-navHoverLink"
      />
      
      <button
        type="submit"
        className="px-4 py-2 bg-navHoverLink text-white rounded-r-md hover:bg-accent"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;