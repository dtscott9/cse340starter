const regValidate = require("../utilities/account-validation");
const express = require("express");
const router = new express.Router();
const util = require("../utilities");
const accController = require("../controllers/accountController.js");


router.get("/login", util.handleErrors(accController.buildLogin));
// Process the login request
router.post(
  "/loggedIn",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accController.loginClient
);
router.get("/registration", util.handleErrors(accController.buildRegister));
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  util.handleErrors(accController.registerClient)
);

router.get("/", util.checkJWTToken, util.handleErrors(accController.buildLoggedIn));

router.get("/logout", util.logOut);

module.exports = router;

