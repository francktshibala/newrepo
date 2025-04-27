import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ReviewSchema = Yup.object().shape({
  review_content: Yup.string()
    .min(5, 'Review is too short')
    .max(500, 'Review is too long')
    .required('Review content is required'),
  rating: Yup.number()
    .min(1, 'Please select a rating')
    .max(5, 'Please select a rating')
    .required('Rating is required'),
});

const StarRating = ({ rating }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`h-5 w-5 ${
          i <= rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    );
  }
  
  return <div className="flex">{stars}</div>;
};

const ReviewList = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getVehicleReviews(vehicleId);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    if (vehicleId) {
      fetchReviews();
    }
  }, [vehicleId]);
  
  const handleSubmitReview = async (values, { resetForm, setSubmitting }) => {
    try {
      const newReview = {
        ...values,
        inv_id: vehicleId,
      };
      
      const result = await reviewService.addReview(newReview);
      
      // Add the new review to the list
      setReviews([...reviews, result.review]);
      
      // Reset form and hide it
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <p>Loading reviews...</p>;
  }
  
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  
  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet for this vehicle.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.review_id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-2">
                <StarRating rating={review.rating} />
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}/5
                </span>
              </div>
              
              <p className="text-gray-800 mb-2">{review.review_content}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>{review.account_firstname} {review.account_lastname?.charAt(0)}.</p>
                <p>{new Date(review.review_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {user ? (
        showForm ? (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium mb-4">Write a Review</h4>
            
            <Formik
              initialValues={{
                review_content: '',
                rating: 5,
              }}
              validationSchema={ReviewSchema}
              onSubmit={handleSubmitReview}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFieldValue('rating', star)}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`h-8 w-8 ${
                              star <= values.rating ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                    
                    <ErrorMessage name="rating" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="review_content" className="block text-sm font-medium text-gray-700 mb-1">
                      Review
                    </label>
                    <Field
                      as="textarea"
                      name="review_content"
                      id="review_content"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink"
                      placeholder="Share your experience with this vehicle..."
                    />
                    <ErrorMessage name="review_content" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navHoverLink hover:bg-accent ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-navHoverLink hover:bg-accent"
          >
            Write a Review
          </button>
        )
      ) : (
        <p className="mt-4 text-sm text-gray-600">
          Please <a href="/login" className="text-navHoverLink hover:text-accent">log in</a> to leave a review.
        </p>
      )}
    </div>
  );
};

export default ReviewList;