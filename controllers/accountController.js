const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const accModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("clients/login", {
    title: "Login",
    nav,
    message: null,
  });
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("clients/register", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  });
}

/* ****************************************
 *  Process registration request
 **************************************** */
async function registerClient(req, res) {
  let nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body;
  
    // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10)
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: 'Sorry, there was an error processing the registration.',
      errors: null,
    })
  }

  const regResult = await accModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  );
  console.log(regResult);
  if (regResult) {
    res.status(201).render("clients/login.ejs", {
      title: "Login",
      nav,
      message: `Congratulations, you\'re registered ${client_firstname}. Please log in.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the registration failed.";
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginClient(req, res) {
  let nav = await utilities.getNav()
  const { client_email, client_password } = req.body
  const clientData = await accModel.getClientByEmail(client_email)
  res.locals.email = client_email;
  if (!clientData) {
    const message = "Please check your credentials and try again."
    res.status(400).render("clients/login", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password
      const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      let user = {name: clientData.client_firstname, type: clientData.client_type};
      res.cookie("jwt", accessToken, { httpOnly: true })
      return res.redirect("/client/")
    }
  } catch (error) {
    return res.status(403).send('Access Forbidden')
  }
}

//Logged in View

async function buildLoggedIn(req, res, next) {
  let nav = await utilities.getNav();
  res.render("clients/loggedIn.ejs", {
    title: "Account Management",
    nav,
    message: "Logged in",
    errors: null
  });
}


module.exports = { buildLogin, buildRegister, registerClient, loginClient, buildLoggedIn };
