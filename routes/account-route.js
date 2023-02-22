const express = require("express"); 
const router = new express.Router(); 
const util = require("../utilities");
const accController = require("../controllers/accountController.js");

router.get("/login", accController.buildLogin);
router.get("/registration", accController.buildRegister)
router.post('/register', accController.registerClient)
module.exports = router;