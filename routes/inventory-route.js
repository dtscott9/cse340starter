const express = require("express"); 
const router = new express.Router(); 
const invController = require("../controllers/invController.js");

//For getting classifications
router.get("/type/:classificationId", invController.buildByClassification);
router.get("/detail/:inv_id", invController.buildByInvId);
//For vehicle management
router.get("/", invController.buildManagement)
//For adding classifications
router.get("/addClassification", invController.buildClassificationForm);
router.post("/classificationAdded", invController.addClassification);
//For adding vehicles to inventory
router.get("/addVehicle", invController.buildVehicleForm);
router.post("/vehicleAdded", invController.addVehicle);

module.exports = router;