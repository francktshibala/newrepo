const utilities = require("../utilities")
const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")

const reviewController = {}

/* ***************************
 *  Build add review view
 * ************************** */
reviewController.buildAddReview = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  
  try {
    // Get vehicle data
    const vehicle = await invModel.getInventoryItemById(inv_id)
    if (!vehicle) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv")
    }
    
    // Check if user has already reviewed this vehicle
    const hasReviewed = await reviewModel.hasUserReviewed(inv_id, res.locals.accountData.account_id)
    if (hasReviewed) {
      req.flash("notice", "You have already reviewed this vehicle. You can edit your existing review.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }
    
    const vehicleName = `${vehicle.inv_make} ${vehicle.inv_model}`
    let nav = await utilities.getNav()
    
    res.render("reviews/add-review", {
      title: `Review ${vehicleName}`,
      nav,
      errors: null,
      messages: req.flash("notice"),
      inv_id,
      vehicleName,
      review_text: "",
      review_rating: 5
    })
  } catch (error) {
    console.error("Error in buildAddReview:", error)
    next(error)
  }
}

/* ***************************
 *  Process new review
 * ************************** */
reviewController.addReview = async function (req, res, next) {
  const { review_text, review_rating, inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  try {
    const result = await reviewModel.addReview(
      review_text, 
      review_rating, 
      inv_id, 
      account_id
    )
    
    if (result) {
      req.flash("notice", "Review added successfully!")
      return res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Error adding review.")
      return res.redirect(`/reviews/add/${inv_id}`)
    }
  } catch (error) {
    console.error("Error in addReview:", error)
    next(error)
  }
}

/* ***************************
 *  Build user reviews view
 * ************************** */
reviewController.buildUserReviews = async function (req, res, next) {
  try {
    // Make sure account data is available
    if (!res.locals.accountData || !res.locals.accountData.account_id) {
      req.flash("notice", "Please log in to view your reviews.")
      return res.redirect("/account/login")
    }
    
    const account_id = res.locals.accountData.account_id
    
    // Get user reviews
    const userReviews = await reviewModel.getReviewsByAccountId(account_id)
    let nav = await utilities.getNav()
    
    res.render("reviews/user-reviews", {
      title: "My Reviews",
      nav,
      reviews: userReviews || [], // Ensure reviews is always an array
      errors: null,
      messages: req.flash("notice")
    })
  } catch (error) {
    console.error("Error in buildUserReviews:", error)
    next(error)
  }
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewController.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.reviewId)
  const account_id = res.locals.accountData.account_id
  
  try {
    // Get review data
    const review = await reviewModel.getReviewById(review_id)
    
    // Check if review exists
    if (!review) {
      req.flash("notice", "Review not found.")
      return res.redirect("/reviews/user")
    }
    
    // Check if user owns the review
    if (review.account_id !== account_id) {
      req.flash("notice", "You can only edit your own reviews.")
      return res.redirect("/reviews/user")
    }
    
    // Get vehicle data
    const vehicle = await invModel.getInventoryItemById(review.inv_id)
    const vehicleName = `${vehicle.inv_make} ${vehicle.inv_model}`
    
    let nav = await utilities.getNav()
    
    res.render("reviews/edit-review", {
      title: `Edit Review for ${vehicleName}`,
      nav,
      errors: null,
      messages: req.flash("notice"),
      review_id,
      inv_id: review.inv_id,
      review_text: review.review_text,
      review_rating: review.review_rating,
      vehicleName
    })
  } catch (error) {
    console.error("Error in buildEditReview:", error)
    next(error)
  }
}

/* ***************************
 *  Process review update
 * ************************** */
reviewController.updateReview = async function (req, res, next) {
  const { review_id, review_text, review_rating } = req.body
  const account_id = res.locals.accountData.account_id
  
  try {
    // Get review data to check ownership
    const review = await reviewModel.getReviewById(review_id)
    
    // Check if review exists
    if (!review) {
      req.flash("notice", "Review not found.")
      return res.redirect("/reviews/user")
    }
    
    // Check if user owns the review
    if (review.account_id !== account_id) {
      req.flash("notice", "You can only edit your own reviews.")
      return res.redirect("/reviews/user")
    }
    
    // Update the review
    const result = await reviewModel.updateReview(
      review_id,
      review_text,
      review_rating
    )
    
    if (result) {
      req.flash("notice", "Review updated successfully!")
      return res.redirect("/reviews/user")
    } else {
      req.flash("notice", "Error updating review.")
      return res.redirect(`/reviews/edit/${review_id}`)
    }
  } catch (error) {
    console.error("Error in updateReview:", error)
    next(error)
  }
}

/* ***************************
 *  Process review deletion
 * ************************** */
reviewController.deleteReview = async function (req, res, next) {
  const review_id = parseInt(req.params.reviewId)
  const account_id = res.locals.accountData.account_id
  
  try {
    // Get review data to check ownership
    const review = await reviewModel.getReviewById(review_id)
    
    // Check if review exists
    if (!review) {
      req.flash("notice", "Review not found.")
      return res.redirect("/reviews/user")
    }
    
    // Check if user owns the review or is admin
    if (review.account_id !== account_id && res.locals.accountData.account_type !== 'Admin') {
      req.flash("notice", "You can only delete your own reviews.")
      return res.redirect("/reviews/user")
    }
    
    // Delete the review
    const result = await reviewModel.deleteReview(review_id)
    
    if (result) {
      req.flash("notice", "Review deleted successfully!")
    } else {
      req.flash("notice", "Error deleting review.")
    }
    
    return res.redirect("/reviews/user")
  } catch (error) {
    console.error("Error in deleteReview:", error)
    next(error)
  }
}

module.exports = reviewController