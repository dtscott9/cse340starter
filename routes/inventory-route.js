const express = require("express"); 
const router = new express.Router(); 
const invController = require("../controllers/invController.js");

router.get("/type/:classificationId", invController.buildByClassification);
router.get("/detail/:inv_id", invController.buildByInvId);
module.exports = router;