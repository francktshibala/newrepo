import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const RegisterSchema = Yup.object().shape({
  account_firstname: Yup.string()
    .min(2, 'First name is too short')
    .max(50, 'First name is too long')
    .required('First name is required'),
  account_lastname: Yup.string()
    .min(2, 'Last name is too short')
    .max(50, 'Last name is too long')
    .required('Last name is required'),
  account_email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  account_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
});

const RegisterPage = () => {
  const { register, login } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Attempt to register the user
      await register(values);
      
      // Show success message
      setSuccess(true);
      
      // Automatically login
      await login(values.account_email, values.account_password);
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-10 px-4 sm:px-6">
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">
              Registration successful! You will be redirected to the home page shortly.
            </p>
          </div>
        )}
        
        <Formik
          initialValues={{
            account_firstname: '',
            account_lastname: '',
            account_email: '',
            account_password: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="account_firstname" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Field
                  id="account_firstname"
                  name="account_firstname"
                  type="text"
                  autoComplete="given-name"
                  className={`mt-1 block w-full border ${
                    errors.account_firstname && touched.account_firstname
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                />
                <ErrorMessage
                  name="account_firstname"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              
              <div>
                <label htmlFor="account_lastname" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Field
                  id="account_lastname"
                  name="account_lastname"
                  type="text"
                  autoComplete="family-name"
                  className={`mt-1 block w-full border ${
                    errors.account_lastname && touched.account_lastname
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                />
                <ErrorMessage
                  name="account_lastname"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              
              <div>
                <label htmlFor="account_email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  id="account_email"
                  name="account_email"
                  type="email"
                  autoComplete="email"
                  className={`mt-1 block w-full border ${
                    errors.account_email && touched.account_email
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                />
                <ErrorMessage
                  name="account_email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              
              <div>
                <label htmlFor="account_password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  id="account_password"
                  name="account_password"
                  type="password"
                  autoComplete="new-password"
                  className={`mt-1 block w-full border ${
                    errors.account_password && touched.account_password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink`}
                />
                <ErrorMessage
                  name="account_password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navHoverLink hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navHoverLink ${
                    (isSubmitting || success) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        
        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-navHoverLink hover:text-accent">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;