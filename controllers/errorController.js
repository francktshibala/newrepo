/* ****************************
 * Error Controller
 * ***************************** */

const errorController = {}

/* ***************************
 * Trigger intentional 500 error
 * ************************** */
errorController.triggerError = async function (req, res, next) {
  // Create an intentional error
  try {
    throw new Error("Intentional 500 error triggered")
  } catch (error) {
    next(error)
  }
}

module.exports = errorController