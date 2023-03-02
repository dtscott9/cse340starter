const utilities = require("./index.js");
const { body, validationResult } = require("express-validator");
const invValidate = {};

/*  **********************************
 *  Classification Validation Rules
 * ********************************* */
invValidate.classificationRules = () => {
  return [
    // Must be all one word with no spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Must be one word, no special characters"), // on error this message is sent.
  ];
};

invValidate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("../views/inventory/add-classification", {
      errors,
      message: null,
      title: "Add Classification",
      nav,
      classification_name,
    });

    return;
  }
  next();
};

/*  **********************************
 *  Inventory Validation Rules
 * ********************************* */
invValidate.inventoryRules = () => {
  return [
    // Must be all one word with no spaces or special characters
    body("inv_make")
      .trim()
      .escape()
      .isLength({min: 1})
      .withMessage("Please enter the vehicle make."), // on error this message is sent.

    body("inv_model")
      .trim()
      .escape()
      .isLength({min: 1})
      .withMessage("Please enter the vehicle model."),
    body("inv_year")
      .trim()
      .isNumeric()
      .withMessage("Please enter the vehicle year."),
    body("inv_description")
      .trim()
      .escape()
      .isLength({min: 1})
      .withMessage("Please enter the vehicle description."),
    body("inv_image")
      .trim()
      .matches("/images/vehicles/.+.png")
      .withMessage("Please enter a correct vehicle image path."),
    body("inv_thumbnail")
      .trim()
      .matches("/images/vehicles/.+.png")
      .withMessage("Please enter a correct vehicle image path."),
    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("Please a number for the vehicle price."),
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Please a number for the vehicle miles."),
    body("in_color")
      .trim()
      .escape()
      .isLength({min: 1})
      .withMessage("Please enter the color of the vehicle."),
  ];
};

invValidate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    in_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let menu = await utilities.stickySelect(classification_id);
    res.render("../views/inventory/add-vehicle", {
      errors,
      message: null,
      title: "Add Vehicle",
      nav,
      menu,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      in_color,
    });

    return;
  }
  next();
};

module.exports = invValidate;
