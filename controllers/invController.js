const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehiclesByClassificationId
    (classificationId)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification-view", {
        title: className +" " + "vehicles",
        nav,
        message: null,
        data,
    })
}

invCont.buildByInvId = async function(req, res, next) {
    const inv_id = req.params.inv_id
    let data = await invModel.getVehiclesByInvId(inv_id)
    let nav = await utilities.getNav()
    const carYear = data[0].inv_year;
    const carMake = data[0].inv_make;
    const carModel = data[0].inv_model;
    res.render("./inventory/vehicle-detail.ejs", {
        title: carYear + ' ' + carMake + ' ' + carModel,
        nav,
        message: null,
        data,
    })
}

module.exports = invCont;