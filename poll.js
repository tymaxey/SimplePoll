var mongoose = require("mongoose");
var PollSchema = new mongoose.Schema({
  title: String,
  question: String,
  optionsObjArr: Array
});

module.exports = mongoose.model("Poll", PollSchema);
