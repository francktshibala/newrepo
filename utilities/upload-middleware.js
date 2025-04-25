const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/images/vehicles/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename
    const uniqueFilename = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});

// Filter function to validate file types
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to process uploaded images (resize, create thumbnail)
const processImages = async (req, res, next) => {
  // Skip if no files were uploaded
  if (!req.files || req.files.length === 0) {
    return next();
  }
  
  try {
    // Process each uploaded file
    for (let file of req.files) {
      const filePath = file.path;
      const fileExt = path.extname(file.filename);
      const fileNameWithoutExt = file.filename.replace(fileExt, '');
      
      // Create thumbnail
      const thumbnailPath = path.join(uploadsDir, `${fileNameWithoutExt}-tn${fileExt}`);
      
      await sharp(filePath)
        .resize(200, 200, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(thumbnailPath);
      
      // Add thumbnail path to file object
      file.thumbnail = `/images/vehicles/uploads/${fileNameWithoutExt}-tn${fileExt}`;
      file.path = `/images/vehicles/uploads/${file.filename}`;
    }
    
    next();
  } catch (error) {
    console.error('Error processing images:', error);
    next(error);
  }
};

module.exports = {
  upload,
  processImages
};