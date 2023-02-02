const express = require("express"); 
const router = new express.Router(); 
const invController = require("../controllers/invController.js");

router.get("/type/:classificationId", invController.buildByClassification);

module.exports = router;