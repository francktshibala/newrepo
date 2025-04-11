const utilities = require(".")
const { body, validationResult } = require("express-validator")

/* ************************
 * Review Data Validation Rules
 ************************* */
const validate = {}

// Review rules for creating a new review
validate.reviewRules = () => {
  return [
    // review_text is required and must be at least 10 characters long
    body("review_text")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),

    // review_rating is required and must be between 1 and 5
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
      
    // inv_id is required
    body("inv_id")
      .isInt()
      .withMessage("Invalid inventory ID.")
  ]
}

// Rules for updating an existing review
validate.reviewUpdateRules = () => {
  return [
    // review_id is required
    body("review_id")
      .isInt()
      .withMessage("Invalid review ID."),
      
    // review_text is required and must be at least 10 characters long
    body("review_text")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),

    // review_rating is required and must be between 1 and 5
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5.")
  ]
}

/* ************************
 * Check Review Data and returns errors or continues to save
 ************************* */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, review_rating, inv_id } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    
    // Get vehicle name for the form (would need to fetch from model)
    const vehicleName = "Vehicle" // Placeholder - in a real app, you'd get this from a model
    
    res.render("reviews/add-review", {
      errors,
      title: `Review ${vehicleName}`,
      nav,
      inv_id,
      vehicleName,
      review_text,
      review_rating,
      messages: null,
    })
    return
  }
  next()
}

/* ************************
 * Check Review Update Data and returns errors or continues to save
 ************************* */
validate.checkReviewUpdateData = async (req, res, next) => {
  const { review_id, review_text, review_rating } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    
    // Get vehicle name for the form (would need to fetch from model)
    const vehicleName = "Vehicle" // Placeholder - in a real app, you'd get this from a model
    
    res.render("reviews/edit-review", {
      errors,
      title: `Edit Review for ${vehicleName}`,
      nav,
      review_id,
      review_text,
      review_rating,
      vehicleName,
      messages: null,
    })
    return
  }
  next()
}

module.exports = validate