const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_id is required
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),
      
    // Make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle make."),
      
    // Model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle model."),
      
    // Description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),
      
    // Image path is required
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),
      
    // Thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),
      
    // Price is required and must be decimal
    body("inv_price")
      .trim()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage("Please provide a valid price (digits only)."),
      
    // Year is required and must be 4 digits
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Please provide a valid 4-digit year."),
      
    // Miles is required and must be numeric
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Please provide a valid mileage (digits only)."),
      
    // Color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle color."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body
  
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors,
      messages: null,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate