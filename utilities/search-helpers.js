/**
 * Build a search filter object for database queries
 * @param {Object} params - Search parameters
 * @returns {Object} Filter object for SQL WHERE clause
 */
function buildSearchFilter(params) {
    const filter = {};
    const conditions = [];
    const values = [];
    let valueIndex = 1;
  
    // Add text search
    if (params.query) {
      const searchTerms = `%${params.query}%`.toLowerCase();
      conditions.push(`(LOWER(inv_make) LIKE $${valueIndex} OR LOWER(inv_model) LIKE $${valueIndex} OR LOWER(inv_description) LIKE $${valueIndex})`);
      values.push(searchTerms);
      valueIndex++;
    }
  
    // Add classification filter
    if (params.classification_id) {
      conditions.push(`classification_id = $${valueIndex}`);
      values.push(params.classification_id);
      valueIndex++;
    }
  
    // Add make filter
    if (params.make) {
      conditions.push(`LOWER(inv_make) = LOWER($${valueIndex})`);
      values.push(params.make);
      valueIndex++;
    }
  
    // Add model filter
    if (params.model) {
      conditions.push(`LOWER(inv_model) = LOWER($${valueIndex})`);
      values.push(params.model);
      valueIndex++;
    }
  
    // Add year filter
    if (params.year) {
      conditions.push(`inv_year = $${valueIndex}`);
      values.push(params.year);
      valueIndex++;
    }
  
    // Add price range
    if (params.minPrice || params.maxPrice) {
      if (params.minPrice) {
        conditions.push(`inv_price >= $${valueIndex}`);
        values.push(params.minPrice);
        valueIndex++;
      }
      
      if (params.maxPrice) {
        conditions.push(`inv_price <= $${valueIndex}`);
        values.push(params.maxPrice);
        valueIndex++;
      }
    }
  
    // Add color filter
    if (params.color) {
      conditions.push(`LOWER(inv_color) = LOWER($${valueIndex})`);
      values.push(params.color);
      valueIndex++;
    }
  
    // Combine all conditions
    if (conditions.length > 0) {
      filter.whereClause = conditions.join(' AND ');
      filter.values = values;
    } else {
      filter.whereClause = '';
      filter.values = [];
    }
  
    return filter;
  }
  
  module.exports = {
    buildSearchFilter
  };