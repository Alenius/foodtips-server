const mongoose = require("mongoose");

var CuisineSchema = new mongoose.Schema({
  cuisine: String
});

var Cuisine = mongoose.model("Cuisine", CuisineSchema);

module.exports = { CuisineSchema, Cuisine };
