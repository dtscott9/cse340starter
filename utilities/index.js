const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

//Constructs the nav HTML unordered List

Util.buildNav = function (data) {
  let list = "<ul>";
  list += '<li><a href="/" title="Home Page">Home</a><li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

//Builds the navigation bar

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  nav = Util.buildNav(data);
  return nav;
};

Util.getCarDetails = async function (req, res, next) {
  let data = await invModel.getVehiclesByInvId();
  h1 = "<h1>";
  data.rows.forEach((row) => {
    h1 += "Hello</h1>";
  });
  return h1;
};

Util.buildSelect = function (data) {
  let select = "<select name='classification_id'>";
  data.rows.forEach((row) => {
    select += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  select += "</select>";
  return select;
};

Util.getSelect = async function (req, res, next) {
  let data = await invModel.getClassifications();
  select = Util.buildSelect(data);
  return select;
};

Util.stickySelect = async function (classification_id) {
  let data = await invModel.getClassifications();
  let select = "<select name='classification_id'>";
  data.rows.forEach((row) => {
    select += `<option value="${row.classification_id}"`;
    if (row.classification_id == classification_id) {
      select += `selected>${row.classification_name}</option>`;
    } else {
      select += `>${row.classification_name}</option>`;
    }
  });
  select += "</select>";
  return select;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, clientData) {
        if (err) {
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.clientData = clientData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

Util.checkClientType = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.clientData = clientData;
    if (
      req.clientData.client_type == "Employee" ||
      req.clientData.client_type == "Admin"
    ) {
      next();
    } else {
      res.status(403).redirect("/");
    }
  } else {
    res.status(403).redirect("/");
  }
};

/* ****************************************
 *  Authorize JWT Token
 * ************************************ */
Util.jwtAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.clientData = clientData;
    next();
  } catch (error) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(403).redirect("/client/login");
  }
};

Util.checkClientLogin = (req, res, next) => {
  if (req.cookies.jwt) {
    res.locals.loggedin = 1;
    next();
  } else {
    next();
  }
};

Util.logOut = (req, res, next) => {
  res.clearCookie("jwt", { httpOnly: true });
  return res.status(403).redirect("/");
};

module.exports = Util;
