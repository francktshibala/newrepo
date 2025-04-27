import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AccountPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your order history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Account Information</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account settings.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.account_firstname} {user?.account_lastname}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.account_email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Account type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.account_type || 'Client'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Order History</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">View your recent purchase history.</p>
        </div>
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="px-4 py-5 text-center">
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="px-4 py-5 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <p>You haven't placed any orders yet.</p>
              <Link 
                to="/inventory" 
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-navHoverLink hover:bg-accent"
              >
                Browse Inventory
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.order_id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-navHoverLink truncate">
                      Order #{order.order_id}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {order.order_status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: ${order.order_total?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <Link 
          to="/account/edit" 
          className="block w-full sm:w-auto sm:inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-navHoverLink hover:bg-accent"
        >
          Edit Account Details
        </Link>
        <Link 
          to="/account/change-password" 
          className="ml-0 sm:ml-3 block w-full sm:w-auto sm:inline-block px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default AccountPage;