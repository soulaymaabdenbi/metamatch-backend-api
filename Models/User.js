const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: false},
    address: {type: String, required: false},
    phone: {type: String, required: false},
    userType: {
        type: String, required: true, enum: ["Player", "Admin", "Coach", "Physiotherapist","Doctor"]
    },
    profile: {
        type: String,
        required: true,
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
    },
    verification: {type: Boolean, default: true},
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);