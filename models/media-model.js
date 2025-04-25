const pool = require("../database/")

/* ***************************
 * Add media to a vehicle
 * ************************** */
async function addVehicleMedia(inv_id, media_type, media_url, media_title, is_primary = false, sort_order = 0) {
  try {
    // Check if this is set as primary and there's already a primary image
    if (is_primary) {
      // Remove primary flag from existing primary images
      await pool.query(
        "UPDATE vehicle_media SET is_primary = FALSE WHERE inv_id = $1 AND media_type = $2 AND is_primary = TRUE",
        [inv_id, media_type]
      );
    }
    
    const sql = `
      INSERT INTO vehicle_media (
        inv_id, 
        media_type, 
        media_url, 
        media_title, 
        is_primary, 
        sort_order
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const result = await pool.query(sql, [
      inv_id, 
      media_type, 
      media_url, 
      media_title, 
      is_primary, 
      sort_order
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("Error in addVehicleMedia:", error);
    throw error;
  }
}

/* ***************************
 * Get media for a vehicle
 * ************************** */
async function getVehicleMedia(inv_id) {
  try {
    const sql = `
      SELECT * 
      FROM vehicle_media
      WHERE inv_id = $1
      ORDER BY media_type, is_primary DESC, sort_order, created_at
    `;
    
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("Error in getVehicleMedia:", error);
    throw error;
  }
}

/* ***************************
 * Update vehicle media
 * ************************** */
async function updateVehicleMedia(media_id, media_title, is_primary, sort_order) {
  try {
    // Get media info to check if we need to update primary flag
    const mediaInfo = await pool.query(
      "SELECT inv_id, media_type FROM vehicle_media WHERE media_id = $1",
      [media_id]
    );
    
    if (mediaInfo.rows.length === 0) {
      throw new Error("Media not found");
    }
    
    const { inv_id, media_type } = mediaInfo.rows[0];
    
    // If setting this as primary, remove primary flag from others
    if (is_primary) {
      await pool.query(
        "UPDATE vehicle_media SET is_primary = FALSE WHERE inv_id = $1 AND media_type = $2 AND is_primary = TRUE AND media_id != $3",
        [inv_id, media_type, media_id]
      );
    }
    
    const sql = `
      UPDATE vehicle_media 
      SET 
        media_title = $1, 
        is_primary = $2, 
        sort_order = $3
      WHERE media_id = $4
      RETURNING *
    `;
    
    const result = await pool.query(sql, [
      media_title,
      is_primary,
      sort_order,
      media_id
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateVehicleMedia:", error);
    throw error;
  }
}

/* ***************************
 * Delete vehicle media
 * ************************** */
async function deleteVehicleMedia(media_id) {
  try {
    const sql = "DELETE FROM vehicle_media WHERE media_id = $1 RETURNING *";
    const result = await pool.query(sql, [media_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error in deleteVehicleMedia:", error);
    throw error;
  }
}

module.exports = {
  addVehicleMedia,
  getVehicleMedia,
  updateVehicleMedia,
  deleteVehicleMedia
};