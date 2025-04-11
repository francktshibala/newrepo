// Needed Resources
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const reviewValidate = require('../utilities/review-validation')

// Route to build add review view
router.get(
  "/add/:inventoryId", 
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildAddReview)
)

// Route to process new review
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Route to build user reviews view
router.get(
  "/user",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildUserReviews)
)

// Route to build edit review view
router.get(
  "/edit/:reviewId",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
)

// Route to process review update
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.reviewUpdateRules(),
  reviewValidate.checkReviewUpdateData,
  utilities.handleErrors(reviewController.updateReview)
)

// Route to process review deletion
router.get(
  "/delete/:reviewId",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router