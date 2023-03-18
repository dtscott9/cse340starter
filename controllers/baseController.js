const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("index", { title: "Home", nav})
}

baseController.buildErrorTest = async function(req, res) {
    // const nav = await utilities.getNav();
    res.render("clients/login", {
        nav
    })
}

module.exports = baseController