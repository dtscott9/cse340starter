const utilities = require("./index.js");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email);
        if (emailExists) {
          throw new Error("Email exists. Please login or use different email");
        }
      }),

    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.loginRules = () => {
  return [
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    
      body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
}

//Check data and return errors or continue to registration

validate.checkRegData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("../views/clients/register", {
      errors,
      message: null,
      title: "Registration",
      nav,
      client_firstname,
      client_lastname,
      client_email,
    });
    return;
  }
  next();
};

validate.checkLoginData = async (req, res, next) => {
  const { cliient_email, client_password} = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("../views/clients/login", {
      errors,
      message: null,
      title: "Login",
      nav,
      cliient_email,
      client_password
    });
    return
  }
  next();
}

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
validate.updateAccRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email);
        if (emailExists) {
          throw new Error("Email exists. Please use different email");
        }
      }),
  ];
};

/*  **********************************
 *  Change Password Validation Rules
 * ********************************* */
validate.changePassRules = () => {
  return [
    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.checkUpdData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("../views/clients/update-account.ejs", {
      errors,
      message: null,
      title: "Update Account Info",
      nav,
      client_firstname,
      client_lastname,
      client_email,
    });
    return;
  }
  next();
};

module.exports = validate;
