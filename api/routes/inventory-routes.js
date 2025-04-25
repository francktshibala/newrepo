const express = require('express');
const router = express.Router();
const invModel = require('../../models/inventory-model');
const utilities = require('../../utilities');

// Get all classifications
router.get('/classifications', async (req, res) => {
  try {
    const data = await invModel.getClassifications();
    res.json({
      success: true,
      classifications: data.rows
    });
  } catch (error) {
    console.error('Error fetching classifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classifications'
    });
  }
});

// Get inventory by classification ID
router.get('/classification/:classificationId', async (req, res) => {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    
    if (data.length > 0) {
      res.json({
        success: true,
        vehicles: data
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No vehicles found for this classification'
      });
    }
  } catch (error) {
    console.error('Error fetching inventory by classification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching inventory'
    });
  }
});

// Get vehicle by ID
router.get('/vehicle/:invId', async (req, res) => {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryItemById(inv_id);
    
    if (data) {
      res.json({
        success: true,
        vehicle: data
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicle'
    });
  }
});

// Search inventory
router.get('/search', async (req, res) => {
  try {
    // Extract search parameters
    const searchParams = {
      query: req.query.q,
      classification_id: req.query.classification,
      make: req.query.make,
      model: req.query.model,
      year: req.query.year,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      color: req.query.color
    };
    
    // Get search results
    const results = await invModel.searchInventory(searchParams);
    
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error searching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching inventory'
    });
  }
});

// Get filter options
router.get('/filter-options', async (req, res) => {
  try {
    // Get distinct makes and colors
    const [makes, colors, classifications] = await Promise.all([
      invModel.getDistinctMakes(),
      invModel.getDistinctColors(),
      invModel.getClassifications()
    ]);
    
    res.json({
      success: true,
      makes,
      colors,
      classifications: classifications.rows
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options'
    });
  }
});

// Add more inventory API routes as needed...

module.exports = router;