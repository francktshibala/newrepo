const pool = require("../database/")

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, review_rating, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.reviews (review_text, review_rating, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *"
    const result = await pool.query(sql, [review_text, review_rating, inv_id, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error adding review:", error)
    throw error
  }
}

/* ***************************
 *  Get reviews by inventory ID
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM public.reviews AS r
      JOIN public.account AS a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("Error getting reviews by inventory ID:", error)
    return [] // Return empty array instead of throwing error
  }
}

/* ***************************
 *  Get reviews by account ID
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year
      FROM public.reviews AS r
      JOIN public.inventory AS i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("Error getting reviews by account ID:", error)
    return [] // Return empty array instead of throwing error
  }
}

/* ***************************
 *  Get a single review by ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const sql = "SELECT * FROM public.reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error getting review by ID:", error)
    throw error
  }
}

/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(review_id, review_text, review_rating) {
  try {
    const sql = "UPDATE public.reviews SET review_text = $1, review_rating = $2 WHERE review_id = $3 RETURNING *"
    const result = await pool.query(sql, [review_text, review_rating, review_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error updating review:", error)
    throw error
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE review_id = $1 RETURNING *"
    const result = await pool.query(sql, [review_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error deleting review:", error)
    throw error
  }
}

/* ***************************
 *  Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = "SELECT ROUND(AVG(review_rating), 1) as average_rating, COUNT(*) as review_count FROM public.reviews WHERE inv_id = $1"
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error getting average rating:", error)
    // Return default values instead of throwing
    return { average_rating: 0, review_count: 0 }
  }
}

/* ***************************
 *  Check if user has already reviewed this vehicle
 * ************************** */
async function hasUserReviewed(inv_id, account_id) {
  try {
    const sql = "SELECT COUNT(*) as review_count FROM public.reviews WHERE inv_id = $1 AND account_id = $2"
    const result = await pool.query(sql, [inv_id, account_id])
    return parseInt(result.rows[0].review_count) > 0
  } catch (error) {
    console.error("Error checking if user has reviewed:", error)
    return false
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
  getAverageRating,
  hasUserReviewed
};