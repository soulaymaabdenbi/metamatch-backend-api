const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {validateEmail, validatePassword, encryptPassword, generateRandomPassword} = require('../utils/helper');
const {sendAccountCredentials} = require("../utils/smtp_function");

module.exports = {

    createUser: async (req, res) => {
        let {
            fullname, username, email, address, phone, role, profile, height,      // New field
            weight,      // New field
            age,         // New field
            nationality  // New field
        } = req.body;


        try {
            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                return res.status(400).json({status: false, message: "User already exists"});
            }
            password = generateRandomPassword();
            const encryptedPassword = encryptPassword(password);

            const newUser = new User({
                fullname,
                username,
                email,
                password: encryptedPassword,
                address,
                phone,
                role,
                profile: profile || "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                verification: false,
                height,
                weight,
                age,
                nationality
            });

            const savedUser = await newUser.save();
            await sendAccountCredentials(email, username, password); // Make sure this function exists and is imported
            res.status(201).json({status: true, message: "User created successfully", user: savedUser});
        } catch (error) {
            res.status(500).json({status: false, message: "Error creating user", error: error.message});
        }
    }, loginUser: async (req, res) => {
        const {email, password} = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid email address"});
        }

        try {
            const user = await User.findOne({email: email}).select('-__v -updatedAt -createdAt');
            if (!user) {
                return res.status(401).json({status: false, message: "Wrong email or password"}); // Use a generic message for security
            }

            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (decryptedPassword !== password) {
                return res.status(401).json({status: false, message: "Wrong email or password"}); // Use a generic message for security
            }

            const token = jwt.sign({
                id: user._id, role: user.role, email: user.email
            }, process.env.JWT_SECRET, {expiresIn: "21d"});

            const {password: userPassword, ...userDetails} = user._doc;

            res.status(200).json({...userDetails, token});
        } catch (error) {
            res.status(500).json({status: false, message: error.message});
        }
    }
}
