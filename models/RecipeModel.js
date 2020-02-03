var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var recipeSchema = new Schema({
  _id: { type: Schema.Types.ObjectID, auto: true },
  title: { type: String, unique: true },
  link: String,
  cuisine: { type: Schema.Types.ObjectID, ref: "Cuisine", required: true },
  tags: [{ type: Schema.Types.ObjectID, ref: "Tag" }],
  vegetarian: Boolean,
  vegan: Boolean
});

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
