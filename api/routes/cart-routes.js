const express = require('express');
const router = express.Router();
const cartModel = require('../../models/cart-model');
const jwtUtils = require('../../utilities/jwt-helpers');

// JWT middleware
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
  
  req.user = decoded;
  next();
};

// Get user's cart
router.get('/', checkJWT, async (req, res) => {
  try {
    // Get or create cart
    const cart = await cartModel.getOrCreateCart(req.user.account_id);
    
    // Get cart items with product details
    const items = await cartModel.getCartItems(cart.cart_id);
    
    // Calculate cart totals
    const subtotal = items.reduce((sum, item) => sum + (item.inv_price * item.quantity), 0);
    
    res.json({
      success: true,
      cart: {
        cart_id: cart.cart_id,
        items,
        subtotal,
        itemCount: items.length
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart'
    });
  }
});

// Add item to cart
router.post('/', checkJWT, async (req, res) => {
  try {
    const { inv_id, quantity = 1 } = req.body;
    
    if (!inv_id) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID is required'
      });
    }
    
    // Get or create cart
    const cart = await cartModel.getOrCreateCart(req.user.account_id);
    
    // Add item to cart
    const result = await cartModel.addToCart(cart.cart_id, inv_id, quantity);
    
    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      item: result
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart'
    });
  }
});

// Update cart item quantity
router.put('/item/:itemId', checkJWT, async (req, res) => {
  try {
    const { inv_id, quantity } = req.body;
    
    if (!inv_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID and quantity are required'
      });
    }
    
    // Get cart
    const cart = await cartModel.getOrCreateCart(req.user.account_id);
    
    // Update item quantity
    const result = await cartModel.updateCartItemQuantity(cart.cart_id, inv_id, quantity);
    
    res.json({
      success: true,
      message: 'Cart updated',
      item: result
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart'
    });
  }
});

// Remove item from cart
router.delete('/item/:itemId', checkJWT, async (req, res) => {
  try {
    const inv_id = req.params.itemId;
    
    // Get cart
    const cart = await cartModel.getOrCreateCart(req.user.account_id);
    
    // Remove item
    const result = await cartModel.removeFromCart(cart.cart_id, inv_id);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      result
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart'
    });
  }
});

// Clear cart
router.delete('/', checkJWT, async (req, res) => {
  try {
    // Get cart
    const cart = await cartModel.getOrCreateCart(req.user.account_id);
    
    // Clear cart
    const count = await cartModel.clearCart(cart.cart_id);
    
    res.json({
      success: true,
      message: `Cart cleared, ${count} items removed`
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart'
    });
  }
});

module.exports = router;