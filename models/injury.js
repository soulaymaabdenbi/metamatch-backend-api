const mongoo = require('mongoose');

const recoveryStatusEnum = ["In Progress", "Recovered", "In Rehabilitation"];

const injury = new mongoo.Schema({
  player_id: {
    type: mongoo.Schema.Types.ObjectId,
    ref: 'joueur',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  recovery_status: {
    type: String,
    required: true,
    enum: recoveryStatusEnum
  },
  duration: {
    type: String,
    required: true
  }
});

module.exports = mongoo.model('injury',injury);