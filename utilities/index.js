const invModel = require("../models/inventory-model")
const Util = {}

//Constructs the nav HTML unordered List

Util.buildNav = function (data) {
    let list = "<ul>"
    list += '<li><a href="/" title="Home Page">Home</a><li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

//Builds the navigation bar

Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications()
    nav = Util.buildNav(data)
    return nav
}


Util.getCarDetails = async function(req, res, next) {
    let data = await invModel.getVehiclesByInvId();
    h1 = "<h1>"
    data.rows.forEach((row) => {
        h1 += "Hello</h1>"
    })
    return h1;
}

module.exports = Util