const mongo = require("mongoose");
const Schema = mongo.Schema;

const Session = new Schema({
  //id: String,
  date: Date,
  time: String,
  location: String,
  topics: [String],
});

module.exports = mongo.model("session", Session);
