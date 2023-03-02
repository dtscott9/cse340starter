const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassification = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  let data = await invModel.getVehiclesByClassificationId(classificationId);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification-view", {
    title: className + " " + "vehicles",
    nav,
    message: null,
    data,
  });
};

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  let data = await invModel.getVehiclesByInvId(inv_id);
  let nav = await utilities.getNav();
  const carYear = data[0].inv_year;
  const carMake = data[0].inv_make;
  const carModel = data[0].inv_model;
  res.render("./inventory/vehicle-detail.ejs", {
    title: carYear + " " + carMake + " " + carModel,
    nav,
    message: null,
    data,
  });
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/vehicle_management.ejs", {
    title: "Vehicle Management",
    nav,
    message: null,
  });
};

//build classification form

invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification.ejs", {
    title: "Add Classification",
    nav,
    message: null,
    errors: null
  });
};

//Process request to add to classification

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const addClassResult = await invModel.addClassification(classification_name);
  console.log(addClassResult);
  if (addClassResult) {
    res.status(201).render("inventory/vehicle_management.ejs", {
      title: "Vehicle Management",
      nav,
      message: "Your new classification has been added",
      errors: null,
    });
  } else {
    const message = "Sorry, unable to add the classification";
    res.status(501).render("inventory/add-classification.ejs", {
      title: "Add Classification",
      nav,
      message,
      errors: null,
    });
  }
};

//build vehicle form

invCont.buildVehicleForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  let menu = await utilities.getSelect();
  res.render("./inventory/add-vehicle.ejs", {
    title: "Add Vehicle",
    nav,
    menu,
    message: null,
    errors: null
  });
};

//Process new vehicle request

invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, in_color, classification_id } = req.body;
  const addVehicleResult = await invModel.addVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, in_color, classification_id);
  console.log(addVehicleResult);
  if (addVehicleResult) {
    res.status(201).render("inventory/vehicle_management.ejs", {
      title: "Vehicle Management",
      nav,
      message: "Your new vehicle has been added",
      errors: null,
    });
  } else {
    const message = "Sorry, unable to add the vehicle";
    res.status(501).render("inventory/add-vehicle.ejs", {
      title: "Add Vehicle",
      nav,
      message,
      errors: null,
    });
  }
};

module.exports = invCont;
