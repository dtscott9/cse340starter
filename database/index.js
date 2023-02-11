const { Pool } = require("pg")
require("dotenv").config()
/* ********
* Connection Pool
* SSL object needed for local testing of app
* when using remote DB connection (lines 11 - 13)
* Comment out for deployment
* ********* */

let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })
} else {
    pool = new pool ({
        connectionString: process.env.DATABASE_URL,
    })
}


module.exports = pool