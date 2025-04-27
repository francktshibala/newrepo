import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CheckoutSchema = Yup.object().shape({
  shipping_address: Yup.string().required('Shipping address is required'),
  shipping_city: Yup.string().required('City is required'),
  shipping_state: Yup.string().required('State is required'),
  shipping_zip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
    .required('ZIP code is required'),
  payment_method: Yup.string().required('Payment method is required'),
  card_number: Yup.string()
    .when('payment_method', {
      is: 'credit_card',
      then: (schema) => schema
        .matches(/^\d{16}$/, 'Card number must be 16 digits')
        .required('Card number is required'),
      otherwise: (schema) => schema.optional(),
    }),
  expiration_date: Yup.string()
    .when('payment_method', {
      is: 'credit_card',
      then: (schema) => schema
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format must be MM/YY')
        .required('Expiration date is required'),
      otherwise: (schema) => schema.optional(),
    }),
  cvv: Yup.string()
    .when('payment_method', {
      is: 'credit_card',
      then: (schema) => schema
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
        .required('CVV is required'),
      otherwise: (schema) => schema.optional(),
    }),
});

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  if (cart.items.length === 0 && !orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p>Your cart is empty. Please add items before proceeding to checkout.</p>
        </div>
        <Link 
          to="/inventory" 
          className="inline-block bg-navHoverLink text-white px-4 py-2 rounded hover:bg-accent"
        >
          Browse Inventory
        </Link>
      </div>
    );
  }
  
  if (orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg 
            className="mx-auto h-16 w-16 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
          
          <h1 className="text-2xl font-bold mt-4 mb-2">Order Complete!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          <p className="text-gray-700 font-medium">
            Order Number: <span className="font-bold">{orderNumber}</span>
          </p>
          
          <p className="mt-8 text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          
          <div className="mt-8">
            <Link 
              to="/account" 
              className="inline-block bg-navHoverLink text-white px-6 py-2 rounded hover:bg-accent"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      // Create order
      const response = await axios.post('/api/orders', {
        ...values,
        items: cart.items.map(item => ({
          inv_id: item.inv_id,
          quantity: item.quantity
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Order successful
      setOrderNumber(response.data.order_id);
      setOrderComplete(true);
      
      // Clear cart
      clearCart();
    } catch (err) {
      console.error('Error processing order:', err);
      setError(err.response?.data?.message || 'Failed to process your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping & Payment Information</h2>
              
              <Formik
                initialValues={{
                  shipping_address: '',
                  shipping_city: '',
                  shipping_state: '',
                  shipping_zip: '',
                  payment_method: 'credit_card',
                  card_number: '',
                  expiration_date: '',
                  cvv: ''
                }}
                validationSchema={CheckoutSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, errors, touched }) => (
                  <Form className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                      
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                            Street Address
                          </label>
                          <Field
                            type="text"
                            name="shipping_address"
                            id="shipping_address"
                            className={`mt-1 block w-full border ${
                              errors.shipping_address && touched.shipping_address
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                          />
                          <ErrorMessage name="shipping_address" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <Field
                            type="text"
                            name="shipping_city"
                            id="shipping_city"
                            className={`mt-1 block w-full border ${
                              errors.shipping_city && touched.shipping_city
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                          />
                          <ErrorMessage name="shipping_city" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <Field
                            type="text"
                            name="shipping_state"
                            id="shipping_state"
                            className={`mt-1 block w-full border ${
                              errors.shipping_state && touched.shipping_state
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                          />
                          <ErrorMessage name="shipping_state" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="shipping_zip" className="block text-sm font-medium text-gray-700">
                            ZIP Code
                          </label>
                          <Field
                            type="text"
                            name="shipping_zip"
                            id="shipping_zip"
                            className={`mt-1 block w-full border ${
                              errors.shipping_zip && touched.shipping_zip
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                          />
                          <ErrorMessage name="shipping_zip" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pb-6">
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center">
                            <Field
                              type="radio"
                              name="payment_method"
                              id="credit_card"
                              value="credit_card"
                              className="h-4 w-4 text-navHoverLink focus:ring-navHoverLink border-gray-300"
                            />
                            <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                              Credit Card
                            </label>
                          </div>
                          
                          {values.payment_method === 'credit_card' && (
                            <div className="mt-4 ml-6 space-y-4">
                              <div>
                                <label htmlFor="card_number" className="block text-sm font-medium text-gray-700">
                                  Card Number
                                </label>
                                <Field
                                  type="text"
                                  name="card_number"
                                  id="card_number"
                                  placeholder="XXXX XXXX XXXX XXXX"
                                  className={`mt-1 block w-full border ${
                                    errors.card_number && touched.card_number
                                      ? 'border-red-500'
                                      : 'border-gray-300'
                                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                                />
                                <ErrorMessage name="card_number" component="p" className="mt-1 text-sm text-red-600" />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700">
                                    Expiration Date
                                  </label>
                                  <Field
                                    type="text"
                                    name="expiration_date"
                                    id="expiration_date"
                                    placeholder="MM/YY"
                                    className={`mt-1 block w-full border ${
                                      errors.expiration_date && touched.expiration_date
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                                  />
                                  <ErrorMessage name="expiration_date" component="p" className="mt-1 text-sm text-red-600" />
                                </div>
                                
                                <div>
                                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                    CVV
                                  </label>
                                  <Field
                                    type="text"
                                    name="cvv"
                                    id="cvv"
                                    placeholder="XXX"
                                    className={`mt-1 block w-full border ${
                                      errors.cvv && touched.cvv
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                                  />
                                  <ErrorMessage name="cvv" component="p" className="mt-1 text-sm text-red-600" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <Field
                              type="radio"
                              name="payment_method"
                              id="paypal"
                              value="paypal"
                              className="h-4 w-4 text-navHoverLink focus:ring-navHoverLink border-gray-300"
                            />
                            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                              PayPal
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 bg-navHoverLink text-white rounded-md hover:bg-accent ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? 'Processing...' : 'Complete Order'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Items ({cart.itemCount})</h3>
                  
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.inv_id} className="py-2 flex justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.inv_year} {item.inv_make} {item.inv_model}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.inv_price * item.quantity).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium">${cart.subtotal.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-sm font-medium">Free</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Tax</p>
                    <p className="text-sm font-medium">
                      ${(cart.subtotal * 0.0725).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <p className="text-base font-medium">Total</p>
                    <p className="text-base font-bold">
                      ${(cart.subtotal + (cart.subtotal * 0.0725)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/cart" 
                  className="block text-center text-sm text-navHoverLink hover:text-accent"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;