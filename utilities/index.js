const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>' 
      + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML to match website style
* ************************************ */
Util.buildVehicleDetailHtml = async function(vehicle){
  if (!vehicle) {
    return '<p class="notice">Sorry, the requested vehicle could not be found.</p>'
  }
  
  // Format the price and mileage with commas
  const formattedPrice = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.inv_price)
  
  const formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  // Create HTML structure for vehicle detail like images 5 and 6
  let html = '<div class="detail-view">'
  
  // Vehicle image
  html += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`
  
  // Vehicle details
  html += '<div class="vehicle-details">'
  html += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  
  // Details list
  html += '<div class="detail-list">'
  html += `<div class="detail-item"><strong>Price:</strong> ${formattedPrice}</div>`
  html += `<div class="detail-item"><strong>Description:</strong> <div class="detail-description">${vehicle.inv_description}</div></div>`
  html += `<div class="detail-item"><strong>Color:</strong> ${vehicle.inv_color}</div>`
  html += `<div class="detail-item"><strong>Miles:</strong> ${formattedMiles}</div>`
  html += '</div>' // End detail-list
  
  html += '</div>' // End vehicle-details
  html += '</div>' // End detail-view
  
  return html
}

module.exports = Util
