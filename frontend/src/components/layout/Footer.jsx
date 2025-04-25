import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navHoverLink text-navHoverBg py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {currentYear}, CSE Motors</p>
      </div>
    </footer>
  );
};

export default Footer;