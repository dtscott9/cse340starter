const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController.js");
const invValidate = require("../utilities/inventory-validation");
const util = require("../utilities");

//For getting classifications
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassification));
router.get("/detail/:inv_id", util.handleErrors(invController.buildByInvId));
//For vehicle management
router.get("/", util.checkClientType, util.handleErrors(invController.buildManagement));
//For adding classifications
router.get("/addClassification", util.handleErrors(invController.buildClassificationForm));
router.post(
  "/classificationAdded",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  util.handleErrors(invController.addClassification)
);
//For adding vehicles to inventory
router.get("/addVehicle", util.handleErrors(invController.buildVehicleForm));
router.post(
  "/vehicleAdded",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  util.handleErrors(invController.addVehicle)
);

module.exports = router;
