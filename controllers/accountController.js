const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const messages = req.flash("notice")
  
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    messages,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const messages = req.flash("notice")
  
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      messages: req.flash("notice"),
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash("notice"),
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      messages: req.flash("notice"),
    })
  }
}

/* ****************************************
*  Process login request
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash("notice"),
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash("notice"),
        account_email,
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const messages = req.flash("notice")
  
  // Get account type from the request (will be added by authorization middleware)
  const account_type = res.locals.accountData.account_type
  const account_firstname = res.locals.accountData.account_firstname
  
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    messages,
    account_type,
    account_firstname,
    account_id: res.locals.accountData.account_id,
  })
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  
  // Get account data from model
  const accountData = await accountModel.getAccountById(account_id)
  
  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }
  
  const messages = req.flash("notice")
  
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    messages,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  
  if (updateResult) {
    // Get updated account data
    const accountData = await accountModel.getAccountById(account_id)
    
    // Update JWT token with new account data
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    
    req.flash("notice", "Account updated successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed. Please try again.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      messages: req.flash("notice"),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
*  Process password update
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  
  // Hash the new password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "An error occurred while processing your request. Please try again.")
    return res.redirect(`/account/update/${account_id}`)
  }
  
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
  
  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed. Please try again.")
    return res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
*  Process logout
* *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement, 
  buildAccountUpdate, 
  updateAccount, 
  updatePassword, 
  accountLogout
}