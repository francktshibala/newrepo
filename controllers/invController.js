const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    messages: null,
    errors: null
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryItemById(inventory_id)
    const vehicleHtml = await utilities.buildVehicleDetailHtml(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      vehicleHtml,
      messages: null,
      errors: null
    })
  } catch (error) {
    console.error("Error in buildByInventoryId: ", error)
    next(error)
  }
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let messages = null
    if (req.flash && req.flash("notice")) {
      messages = {
        notice: req.flash("notice")
      }
    }
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      messages,
      errors: null,
    })
  } catch (error) {
    console.error("Error in buildManagementView: ", error)
    next(error)
  }
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  let messages = null
  if (req.flash && req.flash("notice")) {
    messages = {
      notice: req.flash("notice")
    }
  }
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages,
    errors: null,
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  
  try {
    const result = await invModel.addClassification(classification_name)
    
    if (result) {
      req.flash("notice", `The ${classification_name} classification was successfully added.`)
      // Generate a new navigation bar with the new classification
      let nav = await utilities.getNav()
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the addition failed.")
      let nav = await utilities.getNav()
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        messages: {
          notice: req.flash("notice")
        },
        errors: null,
      })
    }
  } catch (error) {
    console.error("Add classification error:", error)
    req.flash("notice", "Sorry, there was an error processing the request.")
    let nav = await utilities.getNav()
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: {
        notice: req.flash("notice")
      },
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  let messages = null
  if (req.flash && req.flash("notice")) {
    messages = {
      notice: req.flash("notice")
    }
  }
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    messages,
    errors: null,
  })
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body
  
  try {
    const inventoryResult = await invModel.addInventory(
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
    )
    
    if (inventoryResult) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} was successfully added to inventory.`
      )
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the addition failed.")
      let classificationSelect = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        messages: {
          notice: req.flash("notice")
        },
        errors: null,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      })
    }
  } catch (error) {
    console.error("Add inventory error:", error)
    req.flash("notice", "Sorry, there was an error processing the request.")
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      messages: {
        notice: req.flash("notice")
      },
      errors: null,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
  }
}

module.exports = invCont