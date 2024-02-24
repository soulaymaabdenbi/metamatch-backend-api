const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


module.exports = {
    createUser: async (req, res) => {
        const {username, email, password, address, phone, userType, profile} = req.body;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({status: false, message: "Invalid email address"});
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }

        try {
            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                return res.status(400).json({status: false, message: "User already exists"});
            }
            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();

            const newUser = new User({
                username,
                email,
                password: encryptedPassword,
                address: address,
                phone,
                userType: userType,
                profile: profile || "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                verification: false,
            });

            const savedUser = await newUser.save();

            res.status(201).json({status: true, message: "User created successfully", user: savedUser});
        } catch (error) {
            res.status(500).json({status: false, message: "Error creating user", error: error.message});
        }
    }, loginUser: async (req, res) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({status: false, message: "Invalid email address"});
        }

        try {
            const user = await User.findOne({email: req.body.email}, {__v: 0, updatedAt: 0, createdAt: 0});
            if (!user) {
                return res.status(401).json({status: false, message: "Wrong email"});
            }

            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (decryptedPassword !== req.body.password) {
                return res.status(401).json({status: false, message: "Wrong password"});
            }

            const token = jwt.sign({
                id: user._id, userType: user.userType, email: user.email
            }, process.env.JWT_SECRET, {expiresIn: "21d"});

            const {password, email, ...others} = user._doc;

            res.status(200).json({...others, token});
        } catch (e) {
            res.status(500).json({status: false, message: e.message});
        }
    }
}
