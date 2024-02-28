const mongo = require("mongoose");
const Schema = mongo.Schema;

const Match = new Schema({
  _id: { type: mongo.Schema.Types.ObjectId, auto: true },
  date: Date,
  location: String,
  scores: [Number],
  teams: [String],
});

module.exports = mongo.model("match", Match);
