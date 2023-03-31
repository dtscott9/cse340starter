const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const accModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const { parse } = require("dotenv");
require("dotenv").config();
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
  let hashedPassword;
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: "Sorry, there was an error processing the registration.",
      errors: null,
    });
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
  let nav = await utilities.getNav();
  const { client_email, client_password } = req.body;
  const clientData = await accModel.getClientByEmail(client_email);
  res.locals.email = client_email;
  if (!clientData) {
    const message = "Please check your credentials and try again.";
    res.status(400).render("clients/login", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password;
      const accessToken = jwt.sign(
        clientData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      let user = {
        name: clientData.client_firstname,
        type: clientData.client_type,
      };
      res.cookie("jwt", accessToken, { httpOnly: true });
      return res.redirect("/client/");
    }
  } catch (error) {
    return res.status(403).send("Access Forbidden");
  }
}

//Logged in View

async function buildLoggedIn(req, res, next) {
  let nav = await utilities.getNav();
  res.render("clients/loggedIn.ejs", {
    title: "Account Management",
    nav,
    message: "Logged in",
    errors: null,
  });
}

async function buildEditAccountView(req, res, next) {
  let nav = await utilities.getNav();
  const client_id = parseInt(req.params.client_id);
  const clientInfo = await accModel.getClientById(client_id);
  res.render("clients/update-account.ejs", {
    title: "Update Account Info",
    nav,
    message: null,
    errors: null,
    client_id: clientInfo[0].client_id,
    client_firstname: clientInfo[0].client_firstname,
    client_lastname: clientInfo[0].client_lastname,
    client_email: clientInfo[0].client_email,
  });
}

/* ****************************************
 *  Process update request
 **************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_id } =
    req.body;

  const updResult = await accModel.updateClient(
    client_firstname,
    client_lastname,
    client_email,
    client_id
  );
  console.log(updResult);
  const clientData = {
    client_id: updResult[0].client_id,
    client_type: updResult[0].client_type,
    client_firstname: updResult[0].client_firstname,
  };
  if (updResult) {
    res.status(201).render("clients/loggedIn.ejs", {
      title: "Account Management",
      nav,
      message: `Success, you\'ve updated your account.\nFirst Name: ${client_firstname}\nLast Name: ${client_lastname}\nEmail: ${client_email}.`,
      errors: null,
      clientData
    });
  } else {
    const client_id = client_id;
    const message = "Sorry, the update failed.";
    res.status(501).render("clients/update-account.ejs", {
      title: "Update Account Info",
      nav,
      message,
      errors: null,
      client_id,
      client_firstname,
      client_lastname,
      client_email,
    });
  }
}

/* ****************************************
 *  Process Password Change request
 **************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { client_password, client_id } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render("clients/update-account", {
      title: "Update Account Info",
      nav,
      message: "Sorry, there was an error processing the update.",
      errors: null,
    });
  }

  const passResult = await accModel.changeClientPassword(
    hashedPassword,
    client_id
  );
  console.log(passResult);
  const clientData = {
    client_id: passResult[0].client_id,
    client_type: passResult[0].client_type,
    client_firstname: passResult[0].client_firstname,
  };
  if (passResult) {
    res.status(201).render("clients/loggedIn.ejs", {
      title: "Account Management",
      nav,
      message: `Success, you\'ve changed your password.`,
      errors: null,
      clientData
    });
  } else {
    const message = "Sorry, unable to change password.";
    res.status(501).render("clients/update-account.ejs", {
      title: "Update Account Info",
      nav,
      message,
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerClient,
  loginClient,
  buildLoggedIn,
  buildEditAccountView,
  updateAccount,
  changePassword,
};
