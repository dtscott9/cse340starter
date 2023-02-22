const pool = require("../database");

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

async function getVehiclesByClassificationId(classificationId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classificationId]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error" + error);
  }
}

async function getVehiclesByInvId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getVehiclesByInvId error" + error);
  }
}

//add new classification

async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

async function addVehicle(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  in_color,
  classification_id
) {
  try {
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, in_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      in_color,
      classification_id,
    ]);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getVehiclesByClassificationId,
  getVehiclesByInvId,
  addClassification,
  addVehicle,
};
