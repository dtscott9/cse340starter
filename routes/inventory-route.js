const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController.js");
const invValidate = require("../utilities/inventory-validation");
const util = require("../utilities");

//For getting classifications
router.get("/type/:classificationId", invController.buildByClassification);
router.get("/detail/:inv_id", invController.buildByInvId);
//For vehicle management
router.get("/", util.checkClientType, invController.buildManagement);
//For adding classifications
router.get("/addClassification", invController.buildClassificationForm);
router.post(
  "/classificationAdded",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  invController.addClassification
);
//For adding vehicles to inventory
router.get("/addVehicle", invController.buildVehicleForm);
router.post(
  "/vehicleAdded",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  invController.addVehicle
);

module.exports = router;
