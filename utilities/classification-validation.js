const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name."),
      
    // classification_name must be only alphanumeric characters (no spaces or special characters)
    body("classification_name")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers (no spaces or special characters)."),
      
    // classification_name cannot already exist in the database
    body("classification_name")
      .custom(async (classification_name) => {
        const classificationExists = await utilities.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification name already exists. Please use a different name.")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      messages: null,
    })
    return
  }
  next()
}

module.exports = validate