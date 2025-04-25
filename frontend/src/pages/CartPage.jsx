import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p>Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to view your cart.</p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {cart.items.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center mb-6">
          <p className="mb-4">Your cart is empty.</p>
          <Link 
            to="/inventory" 
            className="inline-block bg-navHoverLink text-white px-4 py-2 rounded hover:bg-accent"
          >
            Browse Inventory
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.inv_id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img 
                        src={item.inv_thumbnail} 
                        alt={`${item.inv_make} ${item.inv_model}`}
                        className="h-16 w-16 object-cover rounded" 
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-gray-900">
                        {item.inv_year} {item.inv_make} {item.inv_model}
                      </div>
                      <div className="text-gray-500">
                        ${item.inv_price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center">
                      <label htmlFor={`quantity-${item.inv_id}`} className="sr-only">
                        Quantity
                      </label>
                      <select
                        id={`quantity-${item.inv_id}`}
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.inv_id, Number(e.target.value))}
                        className="rounded-md border-gray-300 py-1.5 text-base leading-5 sm:text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.inv_id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={clearCart}
              className="text-red-600 hover:text-red-800"
            >
              Clear Cart
            </button>
            
            <div className="text-xl font-semibold">
              Subtotal: ${cart.subtotal.toLocaleString()}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link 
              to="/inventory" 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
            
            <Link 
              to="/checkout" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navHoverLink hover:bg-accent"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;