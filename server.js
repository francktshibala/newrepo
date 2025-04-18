/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventory"); 
const accountRoute = require("./routes/accountRoute");
const reviewRoute = require("./routes/reviewRoute"); // ADD THIS LINE
const errorRoute = require("./routes/error");
const utilities = require("./utilities");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./utilities/error-middleware");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware
 *************************/
// Body parser for handling POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Express Flash
app.use(flash());

// JWT Token processing
app.use(utilities.checkJWTToken);

// Pass nav to all views
app.use(async (req, res, next) => {
  // Add navigation to all views
  req.nav = await utilities.getNav();
  
  // Set res.locals.nav for EJS access
  res.locals.nav = req.nav;
  
  // Continue
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Review routes - ADD THIS SECTION
app.use("/reviews", reviewRoute);

// Error routes
app.use("/error", errorRoute);

// 404 route - must be after all other routes
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(errorMiddleware);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});