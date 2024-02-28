const mongo = require('mongoose');

const joueur = new mongo.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  }
});

module.exports = mongo.model('joueur',joueur);