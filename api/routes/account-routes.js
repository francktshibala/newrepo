const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/accountController');
const utilities = require('../../utilities');
const jwtUtils = require('../../utilities/jwt-helpers');

// Middleware to check JWT token
const checkJWT = (req, res, next) => {
  // Get token from authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    });
  }
  
  // Verify token
  const decoded = jwtUtils.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
  
  // Attach user to request object
  req.user = decoded;
  next();
};

// Login route
router.post('/login', accountController.accountLoginAPI);

// Register route
router.post('/register', async (req, res) => {
  try {
    // Extract registration data
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    
    // Check if email already exists
    const emailExists = await accountController.checkExistingEmail(account_email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    // Register account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
    
    if (regResult) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Get account data (protected route)
router.get('/profile', checkJWT, async (req, res) => {
  try {
    const accountData = await accountModel.getAccountById(req.user.account_id);
    
    if (!accountData) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    // Remove password before sending
    delete accountData.account_password;
    
    res.json({
      success: true,
      account: accountData
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// Add more account API routes as needed...

module.exports = router;