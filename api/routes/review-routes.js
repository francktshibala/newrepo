const express = require('express');
const router = express.Router();
const reviewModel = require('../../models/review-model');
const utilities = require('../../utilities');
const jwtUtils = require('../../utilities/jwt-helpers');

// Middleware to check JWT token
const checkJWT = (req, res, next) => {
  // Get token from authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    });
  }
  
  // Verify token
  const decoded = jwtUtils.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
  
  // Attach user to request object
  req.user = decoded;
  next();
};

// Get reviews for a vehicle
router.get('/vehicle/:invId', async (req, res) => {
  try {
    const inv_id = req.params.invId;
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
    
    // Get average rating
    const ratingData = await reviewModel.getAverageRating(inv_id);
    
    res.json({
      success: true,
      reviews,
      averageRating: ratingData.average_rating,
      reviewCount: ratingData.review_count
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

// Add a review (protected route)
router.post('/', checkJWT, async (req, res) => {
  try {
    const { review_text, review_rating, inv_id } = req.body;
    const account_id = req.user.account_id;
    
    // Check if user has already reviewed this vehicle
    const hasReviewed = await reviewModel.hasUserReviewed(inv_id, account_id);
    if (hasReviewed) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this vehicle'
      });
    }
    
    // Validate input
    if (!review_text || !review_rating || !inv_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Add review
    const result = await reviewModel.addReview(
      review_text,
      review_rating,
      inv_id,
      account_id
    );
    
    if (result) {
      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to add review'
      });
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding review'
    });
  }
});

// Get user's reviews (protected route)
router.get('/user', checkJWT, async (req, res) => {
  try {
    const account_id = req.user.account_id;
    const userReviews = await reviewModel.getReviewsByAccountId(account_id);
    
    res.json({
      success: true,
      reviews: userReviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews'
    });
  }
});

// Add more review API routes as needed...

module.exports = router;