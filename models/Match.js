const mongo = require("mongoose");
const Schema = mongo.Schema;

const Match = new Schema({
  //_id: mongo.Schema.Types.ObjectId,
  date: Date,
  time: String,
  location: String,
  teamA: String,
  teamB: String,
});

module.exports = mongo.model("match", Match);
