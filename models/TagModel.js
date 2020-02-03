const mongoose = require("mongoose");

var TagSchema = new mongoose.Schema({
  tag: { type: String, unique: true }
});

const Tag = mongoose.model("Tag", TagSchema);
module.exports = { Tag, TagSchema };
