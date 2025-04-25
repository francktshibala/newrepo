const pool = require("../database/")

/* ***************************
 * Get or create shopping cart
 * ************************** */
async function getOrCreateCart(account_id) {
  try {
    // Check if user already has a cart
    const cartSql = "SELECT * FROM shopping_cart WHERE account_id = $1";
    const cartResult = await pool.query(cartSql, [account_id]);
    
    if (cartResult.rowCount > 0) {
      // Cart exists, return it
      return cartResult.rows[0];
    } else {
      // Create new cart
      const newCartSql = "INSERT INTO shopping_cart (account_id) VALUES ($1) RETURNING *";
      const newCartResult = await pool.query(newCartSql, [account_id]);
      return newCartResult.rows[0];
    }
  } catch (error) {
    console.error("Error in getOrCreateCart:", error);
    throw error;
  }
}

/* ***************************
 * Add item to cart
 * ************************** */
async function addToCart(cart_id, inv_id, quantity = 1) {
  try {
    // Check if item already in cart
    const checkSql = "SELECT * FROM cart_items WHERE cart_id = $1 AND inv_id = $2";
    const checkResult = await pool.query(checkSql, [cart_id, inv_id]);
    
    if (checkResult.rowCount > 0) {
      // Item exists, update quantity
      const updateSql = "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND inv_id = $3 RETURNING *";
      const updateResult = await pool.query(updateSql, [quantity, cart_id, inv_id]);
      return updateResult.rows[0];
    } else {
      // Add new item
      const insertSql = "INSERT INTO cart_items (cart_id, inv_id, quantity) VALUES ($1, $2, $3) RETURNING *";
      const insertResult = await pool.query(insertSql, [cart_id, inv_id, quantity]);
      return insertResult.rows[0];
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
}

/* ***************************
 * Remove item from cart
 * ************************** */
async function removeFromCart(cart_id, inv_id) {
  try {
    const sql = "DELETE FROM cart_items WHERE cart_id = $1 AND inv_id = $2 RETURNING *";
    const result = await pool.query(sql, [cart_id, inv_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error;
  }
}

/* ***************************
 * Update item quantity
 * ************************** */
async function updateCartItemQuantity(cart_id, inv_id, quantity) {
  try {
    const sql = "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND inv_id = $3 RETURNING *";
    const result = await pool.query(sql, [quantity, cart_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    throw error;
  }
}

/* ***************************
 * Get cart items with details
 * ************************** */
async function getCartItems(cart_id) {
  try {
    const sql = `
      SELECT ci.item_id, ci.cart_id, ci.inv_id, ci.quantity, ci.added_at,
             i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_image, i.inv_thumbnail
      FROM cart_items ci
      JOIN inventory i ON ci.inv_id = i.inv_id
      WHERE ci.cart_id = $1
      ORDER BY ci.added_at DESC
    `;
    const result = await pool.query(sql, [cart_id]);
    return result.rows;
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
}

/* ***************************
 * Clear cart
 * ************************** */
async function clearCart(cart_id) {
  try {
    const sql = "DELETE FROM cart_items WHERE cart_id = $1 RETURNING *";
    const result = await pool.query(sql, [cart_id]);
    return result.rowCount;
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
}

module.exports = {
  getOrCreateCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartItems,
  clearCart
};