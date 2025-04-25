import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartIcon from '../cart/CartIcon';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-navHoverLink">
            CSE Motors
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.account_firstname}</span>
              <Link to="/account" className="text-navHoverLink hover:text-accent">
                My Account
              </Link>
              <CartIcon />
              <button 
                onClick={logout}
                className="text-navHoverLink hover:text-accent"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-navHoverLink hover:text-accent">
                Login
              </Link>
              <Link to="/register" className="text-navHoverLink hover:text-accent">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;