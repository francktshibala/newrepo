const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

/* ****************************************
*  Check Account Type
* ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        
        if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
          res.locals.accountData = accountData
          res.locals.loggedin = 1
          next()
        } else {
          req.flash("notice", "You do not have permissions to access this page")
          return res.redirect("/account/")
        }
      }
    )
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

/* **************************************
* Build the classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Check if Classification exists
* ************************************ */
Util.checkExistingClassification = async (classification_name) => {
  return await invModel.checkExistingClassification(classification_name)
}

/* **************************************
* Error handling middleware function
* **************************************/
Util.handleErrors = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util