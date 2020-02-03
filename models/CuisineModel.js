const mongoose = require("mongoose");

var CuisineSchema = new mongoose.Schema({
  cuisine: { type: String, unique: true }
});

var Cuisine = mongoose.model("Cuisine", CuisineSchema);

module.exports = { CuisineSchema, Cuisine };
