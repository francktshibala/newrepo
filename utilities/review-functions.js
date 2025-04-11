/* *****************************
 * Build star rating HTML
 * ***************************** */
function buildStarRating(rating) {
    // Convert rating to number and ensure it's between 1-5
    const numRating = Math.min(Math.max(parseFloat(rating) || 0, 0), 5);
    
    // Round to nearest half
    const roundedRating = Math.round(numRating * 2) / 2;
    
    let stars = '';
    
    // Full stars
    for (let i = 1; i <= Math.floor(roundedRating); i++) {
      stars += '<span class="star full">★</span>';
    }
    
    // Half star
    if (roundedRating % 1 !== 0) {
      stars += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = Math.ceil(roundedRating); i < 5; i++) {
      stars += '<span class="star empty">☆</span>';
    }
    
    return stars;
  }
  
  /* *****************************
   * Format date for display
   * ***************************** */
  function formatReviewDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  /* *****************************
   * Build review HTML
   * ***************************** */
  function buildReviewHtml(review, isOwner = false) {
    const stars = buildStarRating(review.review_rating);
    const formattedDate = formatReviewDate(review.review_date);
    
    let html = `
      <div class="review">
        <div class="review-header">
          <div class="review-rating">${stars} <span class="rating-number">${review.review_rating}/5</span></div>
          <div class="review-author">${review.account_firstname} ${review.account_lastname}</div>
          <div class="review-date">${formattedDate}</div>
        </div>
        <div class="review-text">${review.review_text}</div>`;
        
    if (isOwner) {
      html += `
        <div class="review-actions">
          <a href="/reviews/edit/${review.review_id}" class="review-edit-link">Edit</a>
          <a href="/reviews/delete/${review.review_id}" class="review-delete-link" 
             onclick="return confirm('Are you sure you want to delete this review?')">Delete</a>
        </div>`;
    }
    
    html += `</div>`;
    
    return html;
  }
  
  /* *****************************
   * Build reviews section HTML
   * ***************************** */
  function buildReviewsSection(reviews, averageRating, reviewCount, accountId = null) {
    if (!reviews || reviews.length === 0) {
      return `
        <div class="reviews-section">
          <h3>Reviews (0)</h3>
          <p>This vehicle has no reviews yet. Be the first to leave a review!</p>
        </div>
      `;
    }
    
    const stars = buildStarRating(averageRating);
    
    let html = `
      <div class="reviews-section">
        <h3>Reviews (${reviewCount})</h3>
        <div class="average-rating">
          <div class="rating-display">
            ${stars} <span class="average">${averageRating}/5</span>
          </div>
          <p>${reviewCount} customer ${reviewCount === 1 ? 'review' : 'reviews'}</p>
        </div>
        <div class="reviews-list">
    `;
    
    reviews.forEach(review => {
      const isOwner = accountId && review.account_id === accountId;
      html += buildReviewHtml(review, isOwner);
    });
    
    html += `
        </div>
      </div>
    `;
    
    return html;
  }
  
  module.exports = {
    buildStarRating,
    formatReviewDate,
    buildReviewHtml,
    buildReviewsSection
  };