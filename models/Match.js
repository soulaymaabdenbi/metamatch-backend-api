const mongo = require("mongoose");
const Schema = mongo.Schema;

const Match = new Schema({
  //  id: String,
  date: Date,
  location: String,
  teamA: String,
  teamB: String,
});

module.exports = mongo.model("match", Match);
