const mongoose = require('mongoose');
const meetingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Check if the meeting date is not before today's date
        return value >= new Date();
      },
      message: 'Meeting date should be today or in the future'
    }
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: {
    type: String,
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
