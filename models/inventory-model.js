const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  } catch (error) {
    console.error("getClassifications error: " + error)
    throw error
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    throw error
  }
}

/* ***************************
 *  Get inventory item by inventory id
 * ************************** */
async function getInventoryItemById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryItemById error: " + error)
    throw error
  }
}

/* ***************************
 *  Check if classification exists
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const data = await pool.query(sql, [classification_name])
    return data.rowCount > 0
  } catch (error) {
    console.error("Error checking for existing classification:", error)
    throw error
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("Error adding classification:", error)
    throw error
  }
}

/* ***************************
 *  Search inventory with filters
 * ************************** */
async function searchInventory(searchParams) {
  try {
    const { buildSearchFilter } = require('../utilities/search-helpers');
    const filter = buildSearchFilter(searchParams);
    
    let sql = `
      SELECT i.*, c.classification_name
      FROM inventory AS i
      JOIN classification AS c ON i.classification_id = c.classification_id
    `;
    
    if (filter.whereClause) {
      sql += ` WHERE ${filter.whereClause}`;
    }
    
    sql += ` ORDER BY i.inv_make, i.inv_model`;
    
    const result = await pool.query(sql, filter.values);
    return result.rows;
  } catch (error) {
    console.error("Error in searchInventory:", error);
    throw error;
  }
}

// Also add these functions to get distinct makes and colors

/* ***************************
 *  Get distinct vehicle makes
 * ************************** */
async function getDistinctMakes() {
  try {
    const sql = "SELECT DISTINCT inv_make FROM inventory ORDER BY inv_make";
    const result = await pool.query(sql);
    return result.rows.map(row => row.inv_make);
  } catch (error) {
    console.error("Error in getDistinctMakes:", error);
    throw error;
  }
}

/* ***************************
 *  Get distinct vehicle colors
 * ************************** */
async function getDistinctColors() {
  try {
    const sql = "SELECT DISTINCT inv_color FROM inventory ORDER BY inv_color";
    const result = await pool.query(sql);
    return result.rows.map(row => row.inv_color);
  } catch (error) {
    console.error("Error in getDistinctColors:", error);
    throw error;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    
    const data = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    ])
    
    return data.rows[0]
  } catch (error) {
    console.error("Error adding inventory:", error)
    throw error
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryItemById,
  checkExistingClassification,
  addClassification,
  addInventory,
  searchInventory,
  getDistinctMakes,
  getDistinctColors
};