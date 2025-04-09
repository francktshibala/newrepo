// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view - requires employee or admin
router.get("/", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

// Route to build add classification view - requires employee or admin
router.get("/add-classification", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process add classification - requires employee or admin
router.post(
  "/add-classification", 
  utilities.checkAccountType,
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view - requires employee or admin
router.get("/add-inventory", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to process add inventory - requires employee or admin
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;