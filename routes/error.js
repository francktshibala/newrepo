// Error Routes
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Route to trigger an intentional 500 error
router.get("/trigger-error", errorController.triggerError)

module.exports = router