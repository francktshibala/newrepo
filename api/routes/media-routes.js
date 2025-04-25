const express = require('express');
const router = express.Router();
const mediaModel = require('../../models/media-model');
const { upload, processImages } = require('../../utilities/upload-middleware');
const jwtUtils = require('../../utilities/jwt-helpers');

// Middleware to check JWT token
const checkJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    });
  }
  
  const decoded = jwtUtils.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
  
  // Check if user has required permissions
  if (decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  }
  
  req.user = decoded;
  next();
};

// Get all media for a vehicle
router.get('/vehicle/:invId', async (req, res) => {
  try {
    const inv_id = req.params.invId;
    const media = await mediaModel.getVehicleMedia(inv_id);
    
    res.json({
      success: true,
      media
    });
  } catch (error) {
    console.error('Error fetching vehicle media:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle media'
    });
  }
});

// Upload media for a vehicle (protected route)
router.post(
  '/upload/:invId',
  checkJWT,
  upload.array('images', 10), // Allow up to 10 images
  processImages,
  async (req, res) => {
    try {
      const inv_id = req.params.invId;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files were uploaded'
        });
      }
      
      const uploadedMedia = [];
      
      // Process each uploaded file
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const isMainImage = i === 0 && req.body.setMainImage === 'true';
        
        // Save to database
        const media = await mediaModel.addVehicleMedia(
          inv_id,
          'image',
          file.path,
          file.originalname,
          isMainImage,
          i
        );
        
        // Also add thumbnail
        await mediaModel.addVehicleMedia(
          inv_id,
          'image',
          file.thumbnail,
          `Thumbnail: ${file.originalname}`,
          false,
          i + 100 // Make sure thumbnails sort after main images
        );
        
        uploadedMedia.push(media);
      }
      
      res.status(201).json({
        success: true,
        message: `${req.files.length} files uploaded successfully`,
        media: uploadedMedia
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading media'
      });
    }
  }
);

// Update media details (protected route)
router.put('/:mediaId', checkJWT, async (req, res) => {
  try {
    const media_id = req.params.mediaId;
    const { media_title, is_primary, sort_order } = req.body;
    
    const result = await mediaModel.updateVehicleMedia(
      media_id,
      media_title,
      is_primary === 'true',
      sort_order
    );
    
    res.json({
      success: true,
      media: result
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating media'
    });
  }
});

// Delete media (protected route)
router.delete('/:mediaId', checkJWT, async (req, res) => {
  try {
    const media_id = req.params.mediaId;
    
    const result = await mediaModel.deleteVehicleMedia(media_id);
    
    res.json({
      success: true,
      deleted: result
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting media'
    });
  }
});

module.exports = router;