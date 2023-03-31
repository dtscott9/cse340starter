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
  const classificationSelect = await utilities.getSelect();
  res.render("./inventory/vehicle_management.ejs", {
    title: "Vehicle Management",
    classificationSelect,
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

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invCont.getVehiclesJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const vehicleData = await invModel.getVehiclesByClassificationId(classification_id)
  if (vehicleData[0].inv_id) {
    return res.json(vehicleData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.editVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicleData = await invModel.getVehiclesByInvId(inv_id)
  const menu = await utilities.stickySelect(vehicleData[0].classification_id)
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("./inventory/edit-vehicle", {
    title: "Edit " + vehicleName,
    nav,
    menu: menu,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    in_color: vehicleData[0].in_color,
    classification_id: vehicleData[0].classification_id
  })
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    in_color,
    classification_id,
    inv_id,
  } = req.body
  console.log(req.body)
  const updateResult = await invModel.updateVehicle(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    in_color,
    classification_id,
    inv_id
  )
  console.log(updateResult);

  if (updateResult) {
    const vehicleName = updateResult[0].inv_make + " " + updateResult[0].inv_model
    const classificationSelect = await utilities.stickySelect(classification_id)
    res.status(201).render("inventory/vehicle_management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      message: `The ${vehicleName} was successfully updated.`,
      errors: null,
    })
  } else {
    const inv_id = inv_id
    const classificationSelect = await utilities.stickySelect(classification_id)
    const vehicleName = `${inv_make} ${inv_model}`
    res.status(501).render("inventory/edit-vehicle", {
    title: "Edit " + vehicleName,
    nav,
    classificationSelect: classificationSelect,
    message: "Sorry, the update failed.",
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    in_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete vehicle view
 * ************************** */
invCont.deleteVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicleData = await invModel.getVehiclesByInvId(inv_id)
  const menu = await utilities.stickySelect(vehicleData[0].classification_id)
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Edit " + vehicleName,
    nav,
    menu: menu,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    in_color: vehicleData[0].in_color,
    classification_id: vehicleData[0].classification_id
  })
}

/* ***************************
 *  Delete Vehicle Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    in_color,
    classification_id,
    inv_id,
  } = req.body
  console.log(req.body)
  const deleteResult = await invModel.deleteItem(
    inv_id
  )


  if (deleteResult) {
    const classificationSelect = await utilities.stickySelect(classification_id)
    res.status(201).render("inventory/vehicle_management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      message: `The vehicle was successfully deleted.`,
      errors: null,
    })
  } else {
    const inv_id = inv_id
    const classificationSelect = await utilities.stickySelect(classification_id)
    const vehicleName = `${inv_make} ${inv_model}`
    res.status(501).render("inventory/delete-confirm", {
    title: "Edit " + vehicleName,
    nav,
    classificationSelect: classificationSelect,
    message: "Sorry, the deletion failed.",
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    in_color,
    classification_id
    })
  }
}

module.exports = invCont;
